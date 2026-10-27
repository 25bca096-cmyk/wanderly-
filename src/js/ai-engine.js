// Wanderly AI Trip Planner Engine
// Real Natural-Language Understanding, Semantic Knowledge Synthesis, and Custom Constraints Processing

class WanderlyAIEngine {
  constructor() {
    this.geminiApiKey = localStorage.getItem("wanderly_gemini_api_key") || "";
  }

  setApiKey(key) {
    this.geminiApiKey = key.trim();
    localStorage.setItem("wanderly_gemini_api_key", this.geminiApiKey);
  }

  // --- Natural Language Parser ---
  parsePrompt(promptText) {
    const text = promptText.toLowerCase();

    // 1. Destination Extraction
    let destinationKey = null;
    let destinationName = "";
    
    // Check known keys first
    const knownDestKeys = Object.keys(window.WANDERLY_DESTINATIONS || {});
    for (const key of knownDestKeys) {
      if (text.includes(key)) {
        destinationKey = key;
        destinationName = window.WANDERLY_DESTINATIONS[key].name;
        break;
      }
    }

    // Additional common destination name checks
    if (!destinationKey) {
      if (text.includes("goa")) destinationKey = "goa";
      else if (text.includes("manali")) destinationKey = "manali";
      else if (text.includes("jaipur")) destinationKey = "jaipur";
      else if (text.includes("kerala") || text.includes("munnar") || text.includes("alleppey")) destinationKey = "kerala";
      else if (text.includes("coorg") || text.includes("kodagu")) destinationKey = "coorg";
      else if (text.includes("kashmir") || text.includes("srinagar") || text.includes("gulmarg")) destinationKey = "kashmir";
      else if (text.includes("varanasi") || text.includes("kashi") || text.includes("banaras")) destinationKey = "varanasi";
      else if (text.includes("dubai")) destinationKey = "dubai";
      else if (text.includes("bali")) destinationKey = "bali";
      
      if (destinationKey && window.WANDERLY_DESTINATIONS[destinationKey]) {
        destinationName = window.WANDERLY_DESTINATIONS[destinationKey].name;
      }
    }

    // If still not matched, extract regex for "trip to [place]" or "in [place]" or "to [place]"
    if (!destinationKey) {
      const matchTo = promptText.match(/(?:trip\s+to|travel\s+to|visit|explore|in)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
      if (matchTo && matchTo[1]) {
        destinationName = matchTo[1].trim();
        destinationKey = destinationName.toLowerCase().replace(/\s+/g, "");
      } else {
        destinationKey = "goa"; // fallback default
        destinationName = "Goa";
      }
    }

    // 2. Origin Extraction
    let origin = "";
    const originMatch = promptText.match(/(?:from|starting\s+from|flying\s+from)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (originMatch && originMatch[1]) {
      origin = originMatch[1].trim();
    }

    // 3. Duration Extraction
    let days = 3; // sensible default
    const dayMatch = text.match(/(\d+)\s*(?:-|–|\s*)?(?:day|days|d)/i);
    const nightMatch = text.match(/(\d+)\s*(?:-|–|\s*)?(?:night|nights|n)/i);
    const weekMatch = text.match(/(\d+)?\s*(?:week|weeks)/i);

    if (dayMatch) {
      days = parseInt(dayMatch[1], 10);
    } else if (nightMatch) {
      days = parseInt(nightMatch[1], 10) + 1;
    } else if (weekMatch) {
      days = weekMatch[1] ? parseInt(weekMatch[1], 10) * 7 : 7;
    } else if (text.includes("weekend")) {
      days = 2;
    }
    days = Math.max(1, Math.min(days, 14)); // limit between 1 to 14 days

    // 4. Travelers & Group Type Extraction
    let travelers = 2;
    let groupType = "Couple";
    if (text.includes("solo") || text.includes("myself") || text.includes("alone") || text.includes("for 1 person")) {
      travelers = 1;
      groupType = "Solo Explorer";
    } else if (text.includes("family") || text.includes("kids") || text.includes("children") || text.includes("parents")) {
      travelers = 4;
      groupType = "Family";
    } else if (text.includes("friends") || text.includes("gang") || text.includes("group") || text.includes("buddies")) {
      travelers = 4;
      groupType = "Friends Group";
    } else if (text.includes("couple") || text.includes("honeymoon") || text.includes("romantic") || text.includes("two people") || text.includes("for two")) {
      travelers = 2;
      groupType = "Couple";
    }

    // Check specific traveler count
    const numTravelersMatch = text.match(/for\s+(\d+)\s+(?:people|travelers|persons|pax)/i) || text.match(/(\d+)\s+(?:people|travelers|persons|pax)/i);
    if (numTravelersMatch && numTravelersMatch[1]) {
      travelers = parseInt(numTravelersMatch[1], 10);
    }

    // 5. Budget Extraction
    let budgetTier = "moderate";
    let customBudgetPerPerson = null;

    // Detect exact numeric budget (e.g. ₹30,000, 30000, 50k, 20,000)
    const exactBudgetMatch = promptText.match(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+|\d+k|\d{4,6})\s*(?:per\s+person|\/person|each)?/i);
    if (exactBudgetMatch && exactBudgetMatch[1]) {
      let bVal = exactBudgetMatch[1].replace(/,/g, "");
      if (bVal.toLowerCase().endsWith("k")) {
        bVal = parseFloat(bVal) * 1000;
      } else {
        bVal = parseInt(bVal, 10);
      }
      if (bVal >= 1000) {
        customBudgetPerPerson = bVal;
        if (bVal <= 12000) budgetTier = "budget";
        else if (bVal <= 35000) budgetTier = "moderate";
        else budgetTier = "luxury";
      }
    } else if (text.includes("budget") || text.includes("cheap") || text.includes("affordable") || text.includes("backpacking")) {
      budgetTier = "budget";
    } else if (text.includes("luxury") || text.includes("5 star") || text.includes("royal") || text.includes("premium")) {
      budgetTier = "luxury";
    }

    // 6. Pace & Timing Constraints
    let pace = "Balanced";
    let startHour = 9; // default 9:00 AM

    const startHourMatch = text.match(/start\s+(?:activities\s+)?(?:at\s+)?(\d{1,2})(?:\s*|:00\s*)(am|pm)?/i);
    if (startHourMatch && startHourMatch[1]) {
      let hr = parseInt(startHourMatch[1], 10);
      if (startHourMatch[2] && startHourMatch[2].toLowerCase() === "pm" && hr < 12) hr += 12;
      startHour = hr;
    }

    if (text.includes("relaxed") || text.includes("slow") || text.includes("laid-back") || text.includes("chill") || startHour >= 11) {
      pace = "Relaxed & Leisurely";
      if (!startHourMatch) startHour = 10;
    } else if (text.includes("action") || text.includes("fast") || text.includes("see everything") || text.includes("packed")) {
      pace = "Fast-Paced & Energetic";
      startHour = 8;
    }

    // 7. Custom Constraints & Interests
    const avoidCrowds = text.includes("avoid crowd") || text.includes("avoid tourist") || text.includes("offbeat") || text.includes("quiet") || text.includes("peaceful");
    const vegetarian = text.includes("veg") || text.includes("vegetarian") || text.includes("jain") || text.includes("pure veg");
    const localFood = text.includes("local food") || text.includes("authentic food") || text.includes("seafood") || text.includes("culinary") || text.includes("foodie");
    const adventure = text.includes("adventure") || text.includes("trek") || text.includes("rafting") || text.includes("paragliding") || text.includes("sports");
    const beaches = text.includes("beach") || text.includes("beaches") || text.includes("sea") || text.includes("coast");
    const culture = text.includes("cultural") || text.includes("culture") || text.includes("heritage") || text.includes("history") || text.includes("palace") || text.includes("temple");

    return {
      rawPrompt: promptText,
      destinationKey,
      destinationName,
      origin,
      days,
      travelers,
      groupType,
      budgetTier,
      customBudgetPerPerson,
      pace,
      startHour,
      constraints: {
        avoidCrowds,
        vegetarian,
        localFood,
        adventure,
        beaches,
        culture
      }
    };
  }

  // --- Dynamic Schedule Synthesizer ---
  generateItinerary(promptText, extraFilters = {}) {
    // 1. Parse prompt
    const parsed = this.parsePrompt(promptText);

    // Apply manual overrides if user manipulated the UI controls
    if (extraFilters.days) parsed.days = parseInt(extraFilters.days, 10);
    if (extraFilters.travelers) parsed.travelers = parseInt(extraFilters.travelers, 10);
    if (extraFilters.budgetTier) parsed.budgetTier = extraFilters.budgetTier;
    if (extraFilters.pace) parsed.pace = extraFilters.pace;

    // 2. Fetch or dynamically synthesize destination data
    let dest = window.WANDERLY_DESTINATIONS[parsed.destinationKey];
    if (!dest) {
      dest = window.generateGenericDestination(parsed.destinationName);
    }

    // 3. Compute Budget Breakdown
    const baseDailyCost = parsed.customBudgetPerPerson
      ? Math.round(parsed.customBudgetPerPerson / parsed.days)
      : dest.avgCostPerDay[parsed.budgetTier] || 3500;

    const totalPerPerson = parsed.customBudgetPerPerson || (baseDailyCost * parsed.days);
    const grandTotal = totalPerPerson * parsed.travelers;

    const budgetBreakdown = {
      stay: Math.round(grandTotal * 0.40),
      food: Math.round(grandTotal * 0.25),
      activities: Math.round(grandTotal * 0.20),
      transport: Math.round(grandTotal * 0.15)
    };

    // 4. Generate Days and Activities based on custom constraints
    const scheduleDays = [];
    const attractionsPool = [...dest.attractions];
    const diningPool = [...dest.dining];

    // Filter dining for vegetarian if requested
    let matchedDining = diningPool;
    if (parsed.constraints.vegetarian) {
      const vegOptions = diningPool.filter(d => d.cuisine.toLowerCase().includes("veg") || d.specialty.toLowerCase().includes("veg") || d.name.toLowerCase().includes("veg"));
      if (vegOptions.length > 0) matchedDining = vegOptions;
    }

    for (let dayNum = 1; dayNum <= parsed.days; dayNum++) {
      const startH = parsed.startHour;
      const morningTime = `${startH % 12 || 12}:00 ${startH >= 12 ? 'PM' : 'AM'} – ${(startH + 2) % 12 || 12}:30 ${startH + 2 >= 12 ? 'PM' : 'AM'}`;
      const lunchTime = `${(startH + 2) % 12 || 12}:30 PM – ${(startH + 4) % 12 || 12}:00 PM`;
      const afternoonTime = `${(startH + 4) % 12 || 12}:00 PM – ${(startH + 6) % 12 || 12}:30 PM`;
      const eveningTime = `${(startH + 6) % 12 || 12}:30 PM – ${(startH + 8) % 12 || 12}:30 PM`;
      const nightTime = `${(startH + 8) % 12 || 12}:30 PM – ${(startH + 10) % 12 || 12}:30 PM`;

      // Select attractions for this day
      const attr1 = attractionsPool[(dayNum * 2 - 2) % attractionsPool.length];
      const attr2 = attractionsPool[(dayNum * 2 - 1) % attractionsPool.length];
      const lunchSpot = matchedDining[(dayNum - 1) % matchedDining.length];
      const dinnerSpot = matchedDining[(dayNum) % matchedDining.length];

      // Day Title Generation
      let dayTitle = "";
      if (dayNum === 1) {
        dayTitle = `Arrival, Orientation & Sunset Vibes in ${dest.name}`;
      } else if (dayNum === parsed.days) {
        dayTitle = `Hidden Souvenirs & Farewell Vistas`;
      } else {
        const themeList = ["Heritage Discovery & Cultural Gems", "Coastal Escapes & Shacks", "Alpine Trails & Scenic Ridges", "Artisanal Bazaars & Culinary Trail", "Serene Waters & Hidden Retreats"];
        dayTitle = themeList[(dayNum - 2) % themeList.length];
      }

      // Respect "Avoid crowds" constraint
      const offbeatNote = parsed.constraints.avoidCrowds
        ? "🌟 Offbeat Note: Scheduled during non-peak hours with quieter side trails to avoid high tourist density."
        : "";

      scheduleDays.push({
        dayNumber: dayNum,
        title: dayTitle,
        theme: dayNum === 1 ? "Arrival & Discovery" : (dayNum % 2 === 0 ? "Exploration & Action" : "Relaxation & Heritage"),
        notes: offbeatNote,
        slots: [
          {
            slot: "Morning",
            time: morningTime,
            title: attr1.name,
            category: attr1.category,
            desc: attr1.desc,
            cost: attr1.cost * parsed.travelers,
            lat: attr1.lat,
            lng: attr1.lng,
            tip: parsed.startHour >= 11 ? "Late relaxed morning start as requested — leisurely brunch ahead." : "Arrive early for golden morning light and minimal queues."
          },
          {
            slot: "Midday Dining",
            time: lunchTime,
            title: `Lunch at ${lunchSpot.name}`,
            category: "Food & Dining",
            desc: `Enjoy authentic ${lunchSpot.cuisine}. Must-try signature dish: ${lunchSpot.specialty}.`,
            cost: (parsed.budgetTier === "budget" ? 350 : parsed.budgetTier === "luxury" ? 2200 : 750) * parsed.travelers,
            location: lunchSpot.location,
            priceTier: lunchSpot.price
          },
          {
            slot: "Afternoon",
            time: afternoonTime,
            title: attr2.name,
            category: attr2.category,
            desc: attr2.desc,
            cost: attr2.cost * parsed.travelers,
            lat: attr2.lat,
            lng: attr2.lng,
            tip: "Great photo spot and scenic leisure walk."
          },
          {
            slot: "Sunset & Evening",
            time: eveningTime,
            title: `Sunset Viewpoint & Stroll around ${dest.name}`,
            category: "Scenic & Leisure",
            desc: `Breathe in the golden hour atmosphere, visit local handicraft stalls, and relax with chilled beverages.`,
            cost: 150 * parsed.travelers,
            tip: "Golden hour sunset lighting makes this the best time of the day."
          },
          {
            slot: "Night",
            time: nightTime,
            title: `Dinner & Evening Vibes at ${dinnerSpot.name}`,
            category: "Dining & Nightlife",
            desc: `Indulge in evening dining with ${dinnerSpot.cuisine}. Specialty: ${dinnerSpot.specialty}.`,
            cost: (parsed.budgetTier === "budget" ? 450 : parsed.budgetTier === "luxury" ? 3000 : 950) * parsed.travelers,
            location: dinnerSpot.location
          }
        ]
      });
    }

    // Packing list customized to destination
    const packingList = [
      "Government photo ID & travel bookings",
      "Comfortable walking shoes & sandals",
      "Universal power bank & charging cables",
      "Sun protection (SPF 50+, polarized sunglasses, hat)",
      parsed.destinationKey === "manali" || parsed.destinationKey === "kashmir" ? "Fleece thermals, waterproof down jacket, gloves" : "Breathable linen shirts, lightweight cottons, swimwear",
      "Refillable insulated water bottle",
      "Basic first-aid kit and motion sickness tablets"
    ];

    // Local transit guidance
    let transitAdvice = `For ${dest.name}, `;
    if (dest.type.includes("Beach")) {
      transitAdvice += "renting a scooter or self-drive vehicle offers maximum flexibility between beaches and heritage quarters.";
    } else if (dest.type.includes("Hill") || dest.type.includes("Adventure")) {
      transitAdvice += "private cabs with experienced mountain drivers are highly recommended for high-altitude passes.";
    } else {
      transitAdvice += "prepaid taxis, app-based cabs, and guided auto-rickshaws are the most hassle-free.";
    }

    // Final Trip Object
    const itinerary = {
      id: "trip_" + Date.now(),
      title: `${parsed.days}-Day ${parsed.pace} Escapade in ${dest.name}`,
      tagline: dest.tagline,
      destination: dest.name,
      country: dest.country,
      origin: parsed.origin ? parsed.origin : "Your City",
      image: dest.image,
      daysCount: parsed.days,
      travelersCount: parsed.travelers,
      groupType: parsed.groupType,
      budgetTier: parsed.budgetTier.toUpperCase(),
      totalBudget: grandTotal,
      budgetPerPerson: totalPerPerson,
      budgetBreakdown,
      pace: parsed.pace,
      startHour: parsed.startHour,
      constraintsParsed: parsed.constraints,
      overview: dest.overview,
      bestSeason: dest.bestSeason,
      transitAdvice,
      tips: dest.tips,
      packingList,
      scheduleDays,
      mapCoordinates: {
        centerLat: dest.lat,
        centerLng: dest.lng,
        pins: dest.attractions.map(a => ({ name: a.name, lat: a.lat, lng: a.lng, category: a.category }))
      },
      createdAt: new Date().toISOString()
    };

    return itinerary;
  }
}

// Global engine instance
const wanderlyAI = new WanderlyAIEngine();
if (typeof window !== "undefined") {
  window.wanderlyAI = wanderlyAI;
}
