// Wanderly Destination Knowledge Base
// High-fidelity curated data for Indian & International destinations

const WANDERLY_DESTINATIONS = {
  "goa": {
    name: "Goa",
    country: "India",
    tagline: "Sun, Sand, Seafood & Portuguese Heritage",
    type: "Beach & Leisure",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Nov - Feb",
    idealDuration: "3 - 5 Days",
    avgCostPerDay: { budget: 2000, moderate: 4500, luxury: 12000 },
    lat: 15.2993,
    lng: 74.1240,
    tags: ["Beaches", "Nightlife", "Seafood", "Heritage", "Water Sports"],
    overview: "From the golden shores of Anjuna and Palolem to the serene spice plantations and Latin Quarter of Fontainhas, Goa offers a vibrant blend of tropical beauty and bohemian heritage.",
    attractions: [
      { id: "g1", name: "Baga & Calangute Beach", category: "Beach", lat: 15.5553, lng: 73.7517, cost: 0, duration: "3 hrs", desc: "Golden sands, water sports (parasailing, jet-ski), vibrant beach shacks." },
      { id: "g2", name: "Aguada Fort & Lighthouse", category: "Heritage", lat: 15.4920, lng: 73.7737, cost: 50, duration: "2 hrs", desc: "17th-century Portuguese fortress commanding panoramic views over the Arabian Sea." },
      { id: "g3", name: "Fontainhas Latin Quarter", category: "Culture", lat: 15.4989, lng: 73.8311, cost: 0, duration: "2 hrs", desc: "Pastel-hued colonial mansions, vintage cafes, and vibrant street art in Old Panjim." },
      { id: "g4", name: "Anjuna Flea Market & Curlies Shack", category: "Leisure", lat: 15.5733, lng: 73.7412, cost: 200, duration: "3 hrs", desc: "Sunset cocktails, bohemian crafts, live music, and sea breezes." },
      { id: "g5", name: "Dudhsagar Waterfalls", category: "Adventure", lat: 15.3144, lng: 74.3143, cost: 500, duration: "5 hrs", desc: "Four-tiered milky waterfall in Bhagwan Mahaveer Sanctuary reachable by jungle jeep." },
      { id: "g6", name: "Palolem Beach & Butterfly Island", category: "Beach", lat: 15.0100, lng: 74.0232, cost: 300, duration: "4 hrs", desc: "Crescent-shaped serene beach with calm waters, dolphin spotting, and kayaking." },
      { id: "g7", name: "Sahakari Spice Farm", category: "Experience", lat: 15.4167, lng: 74.0167, cost: 400, duration: "2.5 hrs", desc: "Organic spice trail tour with authentic Goan buffet served on betel nut plates." }
    ],
    dining: [
      { name: "Fisherman's Wharf", cuisine: "Goan Seafood", specialty: "Goan Fish Curry & Butter Garlic Crab", price: "₹₹₹", location: "Cavelossim / Panjim" },
      { name: "Gunpowder", cuisine: "South Indian Coastal", specialty: "Kerala Beef Fry / Malabar Parotta & Veg Stew", price: "₹₹", location: "Assagao" },
      { name: "Vinayak Family Restaurant", cuisine: "Authentic Local Goan", specialty: "Fresh Fish Thali & Prawn Masala", price: "₹", location: "Assagao" },
      { name: "Café Bodega", cuisine: "Café & Bakery", specialty: "Goan Chorizo Tart & Artisan Coffee", price: "₹₹", location: "Altinho, Panjim" },
      { name: "Mum's Kitchen", cuisine: "Heritage Goan", specialty: "Xacuti, Prawn Balchão & Bebinca", price: "₹₹₹", location: "Miramar" }
    ],
    tips: "Rent a scooter or self-drive car at Dabolim/Mopa airport. South Goa is tranquil and pristine, while North Goa is upbeat with night markets and beach clubs."
  },

  "manali": {
    name: "Manali",
    country: "India",
    tagline: "Snow Peaks, Alpine Meadows & High-Altitude Adventure",
    type: "Hill Station & Adventure",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Oct - Jun",
    idealDuration: "4 - 6 Days",
    avgCostPerDay: { budget: 1800, moderate: 4000, luxury: 10000 },
    lat: 32.2396,
    lng: 77.1887,
    tags: ["Mountains", "Snow", "Adventure", "Family", "Trekking"],
    overview: "Nestled in the Beas River Valley of Himachal Pradesh, Manali is India's favorite gateway to snow-clad peaks, roaring rapids, apple orchards, and pine forests.",
    attractions: [
      { id: "m1", name: "Solang Valley Adventure Arena", category: "Adventure", lat: 32.3160, lng: 77.1575, cost: 800, duration: "4 hrs", desc: "Paragliding, zorbing, ATV quad biking, and skiing in winter." },
      { id: "m2", name: "Hadimba Devi Wooden Temple", category: "Heritage", lat: 32.2483, lng: 77.1702, cost: 20, duration: "1.5 hrs", desc: "16th-century pagoda-style timber shrine surrounded by towering cedar and deodar woods." },
      { id: "m3", name: "Old Manali Village & Cafes", category: "Culture", lat: 32.2530, lng: 77.1750, cost: 0, duration: "3 hrs", desc: "Rustic stone houses, apple orchards, live acoustic music, and handmade crafts." },
      { id: "m4", name: "Jogini Waterfall Trek", category: "Nature", lat: 32.2680, lng: 77.1950, cost: 0, duration: "3 hrs", desc: "Scenic 3km nature walk through pine woods leading to cascading mountain waters." },
      { id: "m5", name: "Atal Tunnel & Sissu (Lahaul)", category: "Scenic", lat: 32.4820, lng: 77.1260, cost: 0, duration: "5 hrs", desc: "Engineering marvel tunnel opening into the breathtaking Trans-Himalayan desert landscapes." },
      { id: "m6", name: "Vashisht Hot Sulphur Springs", category: "Wellness", lat: 32.2612, lng: 77.1885, cost: 0, duration: "1.5 hrs", desc: "Natural therapeutic mineral springs with ancient stone temples." }
    ],
    dining: [
      { name: "The Lazy Dog Lounge", cuisine: "Continental & Himachali", specialty: "Pan-fried Himalayan Trout & Cocktails", price: "₹₹₹", location: "Old Manali" },
      { name: "Chopsticks", cuisine: "Tibetan & Asian", specialty: "Steamed Momos, Thukpa & Honey Chilli Potato", price: "₹₹", location: "Mall Road" },
      { name: "Drifters' Inn & Cafe", cuisine: "Cafe & Comfort", specialty: "Woodfired Pizzas & Fresh Apple Crumble", price: "₹₹", location: "Old Manali" },
      { name: "Himachali Rasoi", cuisine: "Traditional Pahadi", specialty: "Himachali Dham (Kangri Madra, Babru & Siddu)", price: "₹₹", location: "Mall Road" }
    ],
    tips: "Book Atal Tunnel & Rohtang Pass permits in advance. Carry warm layers even in summer evenings. For white water rafting, head to Kullu Valley on the way up."
  },

  "jaipur": {
    name: "Jaipur",
    country: "India",
    tagline: "The Pink City: Royal Forts, Palaces & Rajasthani Splendor",
    type: "Heritage & Royal",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Oct - Mar",
    idealDuration: "2 - 4 Days",
    avgCostPerDay: { budget: 1800, moderate: 4200, luxury: 14000 },
    lat: 26.9124,
    lng: 75.7873,
    tags: ["Palaces", "Forts", "Culture", "Royal", "Shopping", "Food"],
    overview: "Rajasthan's regal capital mesmerizes with terra-cotta pink sandstone walls, grand hilltop citadels, intricate latticework windows, and vibrant bazaars full of gems and textiles.",
    attractions: [
      { id: "j1", name: "Amber Fort & Palace", category: "Heritage", lat: 26.9855, lng: 75.8513, cost: 100, duration: "3.5 hrs", desc: "Hilltop citadel famous for Sheesh Mahal (Mirror Palace) and Maota Lake views." },
      { id: "j2", name: "Hawa Mahal (Palace of Winds)", category: "Architecture", lat: 26.9239, lng: 75.8267, cost: 50, duration: "1 hr", desc: "953 honeycomb windows crafted for royal women to observe street processions." },
      { id: "j3", name: "City Palace & Chandra Mahal", category: "Royal", lat: 26.9258, lng: 75.8236, cost: 300, duration: "2.5 hrs", desc: "Grand royal residence blending Rajput, Mughal, and European architecture." },
      { id: "j4", name: "Nahargarh Fort Sunset Viewpoint", category: "Scenic", lat: 26.9372, lng: 75.8155, cost: 50, duration: "2 hrs", desc: "Perched high on the Aravalli hills overlooking the illuminated Pink City at twilight." },
      { id: "j5", name: "Jantar Mantar Royal Observatory", category: "Heritage", lat: 26.9248, lng: 75.8246, cost: 50, duration: "1.5 hrs", desc: "UNESCO World Heritage Site with the world's largest stone sundial." },
      { id: "j6", name: "Johari & Bapu Bazaar Walk", category: "Shopping", lat: 26.9200, lng: 75.8200, cost: 0, duration: "2.5 hrs", desc: "Vibrant alleys for Jaipuri quilts, Bandhani sarees, block prints, and Kundan jewelry." }
    ],
    dining: [
      { name: "Laxmi Misthan Bhandar (LMB)", cuisine: "Pure Veg Rajasthani", specialty: "Royal Rajasthani Thali, Pyaaz Kachori & Ghewar", price: "₹₹", location: "Johari Bazaar" },
      { name: "1135 AD", cuisine: "Royal Rajputana", specialty: "Lal Maas & Shahi Murgh in Silver Thalis", price: "₹₹₹₹", location: "Amber Fort" },
      { name: "Rawat Mishthan Bhandar", cuisine: "Snacks & Sweets", specialty: "Legendary Pyaaz Ki Kachori & Mawa Kachori", price: "₹", location: "Station Road" },
      { name: "Bar Palladio", cuisine: "Italian & Cocktail Lounge", specialty: "Artisan Cocktails inside stunning Indigo Tent", price: "₹₹₹", location: "Narain Niwas Palace" }
    ],
    tips: "Buy the Composite Entry Ticket (Amber, Hawa Mahal, Jantar Mantar, Albert Hall) to save money and skip long queues. Start your day early to beat fort crowds."
  },

  "kerala": {
    name: "Kerala (Munnar & Alleppey)",
    country: "India",
    tagline: "God's Own Country: Emerald Tea Estates & Serene Backwaters",
    type: "Nature & Backwaters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Sep - Mar",
    idealDuration: "5 - 8 Days",
    avgCostPerDay: { budget: 2200, moderate: 5000, luxury: 15000 },
    lat: 9.9312,
    lng: 76.2673,
    tags: ["Backwaters", "Houseboat", "Tea Gardens", "Ayurveda", "Beaches"],
    overview: "From the mist-swathed tea plantations of Munnar to the languid palm-fringed canals of Alleppey and spice-scented lanes of Kochi, Kerala is pure rejuvenation.",
    attractions: [
      { id: "k1", name: "Alleppey Houseboat Backwater Cruise", category: "Experience", lat: 9.4981, lng: 76.3388, cost: 4500, duration: "Full Day / Overnight", desc: "Glide along emerald canals and paddy fields on a traditional kettuvallam boat." },
      { id: "k2", name: "Munnar Tea Plantations & Eravikulam", category: "Nature", lat: 10.0889, lng: 77.0595, cost: 200, duration: "4 hrs", desc: "Rolling emerald carpet hills, endangered Nilgiri Tahr mountain goats, tea tasting." },
      { id: "k3", name: "Fort Kochi & Chinese Fishing Nets", category: "Heritage", lat: 9.9658, lng: 76.2421, cost: 0, duration: "3 hrs", desc: "Centuries-old cantilevered fishing nets, Santa Cruz Basilica, and spice warehouses." },
      { id: "k4", name: "Periyar Wildlife Sanctuary (Thekkady)", category: "Wildlife", lat: 9.4679, lng: 77.1428, cost: 450, duration: "3 hrs", desc: "Lake boat safari spotting wild elephants, bison, and exotic bird species." },
      { id: "k5", name: "Kathakali & Kalaripayattu Martial Arts", category: "Culture", lat: 9.9680, lng: 76.2450, cost: 400, duration: "2 hrs", desc: "Mesmerizing traditional classical dance drama and ancient warrior martial arts." }
    ],
    dining: [
      { name: "Paragon Restaurant", cuisine: "Malabar Coastal", specialty: "Famous Malabar Biryani & Alleppey Fish Curry", price: "₹₹", location: "Kochi / Calicut" },
      { name: "Kashi Art Café", cuisine: "Artisan Café", specialty: "Homemade Chocolate Cake & Organic Breakfast", price: "₹₹", location: "Fort Kochi" },
      { name: "Rapsy Restaurant", cuisine: "Local Kerala", specialty: "Kerala Parotta with Chicken Roast & Spanish Omelet", price: "₹", location: "Munnar Main Town" },
      { name: "Grand Pavilion", cuisine: "Traditional Kerala", specialty: "Authentic Kerala Sadya on Plantain Leaf", price: "₹₹", location: "Ernakulam" }
    ],
    tips: "Book your Alleppey houseboat with verified operators providing AC and local cook. Sample fresh toddy and Karimeen Pollichathu (pearl spot fish wrapped in banana leaf)."
  },

  "coorg": {
    name: "Coorg (Kodagu)",
    country: "India",
    tagline: "The Scotland of India: Coffee Aromas, Mist & Gentle Streams",
    type: "Hill Station & Nature",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Oct - Apr",
    idealDuration: "2 - 4 Days",
    avgCostPerDay: { budget: 2000, moderate: 4200, luxury: 11000 },
    lat: 12.3375,
    lng: 75.8069,
    tags: ["Coffee", "Waterfalls", "Relaxed", "Nature", "Offbeat"],
    overview: "Draped along the Western Ghats, Coorg is a haven of lush coffee plantations, spice gardens, cascading waterfalls, and the unique martial culture of the Kodava people.",
    attractions: [
      { id: "c1", name: "Abbey Falls & Coffee Estate Trail", category: "Nature", lat: 12.4542, lng: 75.7196, cost: 50, duration: "2 hrs", desc: "Roaring waterfall nestled amidst private coffee and pepper plantations." },
      { id: "c2", name: "Raja's Seat Sunset Garden", category: "Scenic", lat: 12.4216, lng: 75.7369, cost: 30, duration: "1.5 hrs", desc: "Historic garden where the Kings of Kodagu watched sunsets across misty valleys." },
      { id: "c3", name: "Dubare Elephant Camp & River Cauvery", category: "Wildlife", lat: 12.3688, lng: 75.9037, cost: 200, duration: "3 hrs", desc: "Interact with, feed, and watch gentle elephants bathe along the riverbanks." },
      { id: "c4", name: "Namdroling Golden Temple (Bylakuppe)", category: "Spiritual", lat: 12.4300, lng: 75.9678, cost: 0, duration: "2 hrs", desc: "Breathtaking Tibetan Buddhist monastery with 40-foot gilded statues." },
      { id: "c5", name: "Talacauvery & Brahmagiri Hills", category: "Heritage & Trek", lat: 12.3870, lng: 75.4950, cost: 0, duration: "3 hrs", desc: "Sacred origin of the holy River Cauvery with panoramic ridge views." }
    ],
    dining: [
      { name: "Raintree Restaurant", cuisine: "Kodava & Multi-cuisine", specialty: "Authentic Pandi Curry, Akki Rotti & Bamboo Shoot Curry", price: "₹₹", location: "Madikeri" },
      { name: "Coorg Cuisine", cuisine: "Kodava Traditional", specialty: "Pandi Curry with Kadambuttu (Rice Balls)", price: "₹", location: "Opposite Bus Stand, Madikeri" },
      { name: "Big Cup Cafe", cuisine: "Specialty Coffee Bar", specialty: "Single-origin Coorg Robusta/Arabica & Pastries", price: "₹₹", location: "Mysore-Madikeri Road" }
    ],
    tips: "Perfect for relaxed starts (around 11 AM) avoiding commercial rush. Stay at an authentic coffee plantation homestay for plantation walks and homemade Kodava hospitality."
  },

  "kashmir": {
    name: "Kashmir (Srinagar & Gulmarg)",
    country: "India",
    tagline: "Paradise on Earth: Alpine Lakes, Snow Meadows & Shikaras",
    type: "Scenic & Snow",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "All Year (Snow Dec-Feb, Blooms Apr-Oct)",
    idealDuration: "5 - 7 Days",
    avgCostPerDay: { budget: 2500, moderate: 5500, luxury: 16000 },
    lat: 34.0837,
    lng: 74.7973,
    tags: ["Snow", "Lakes", "Romantic", "Culture", "Mountains"],
    overview: "Glacial rivers, snow-frosted pine slopes of Gulmarg, tranquil Dal Lake shikaras, and timeless Mughal garden architecture define Kashmir's unmatched charm.",
    attractions: [
      { id: "ks1", name: "Dal Lake Shikara Ride & Houseboats", category: "Experience", lat: 34.0900, lng: 74.8300, cost: 800, duration: "2.5 hrs", desc: "Wooden gondola ride gliding through lotus blooms, floating vegetable markets." },
      { id: "ks2", name: "Gulmarg Gondola (Phase 1 & 2)", category: "Snow & Adventure", lat: 34.0484, lng: 74.3805, cost: 1800, duration: "4.5 hrs", desc: "One of the world's highest cable cars soaring to 13,780 ft snow slopes." },
      { id: "ks3", name: "Mughal Gardens (Nishat & Shalimar)", category: "Heritage", lat: 34.1200, lng: 74.8800, cost: 50, duration: "2 hrs", desc: "Terraced water channels, fountains, and centuries-old chinar trees." },
      { id: "ks4", name: "Betaab & Aru Valleys (Pahalgam)", category: "Scenic", lat: 34.0150, lng: 75.3200, cost: 200, duration: "5 hrs", desc: "Pristine Lidder river meadows framed by snow-covered deodar ridges." }
    ],
    dining: [
      { name: "Ahdoos Restaurant", cuisine: "Authentic Kashmiri Wazwan", specialty: "Rogan Josh, Rista, Gushtaba & Kashmiri Pulao", price: "₹₹₹", location: "Residency Road, Srinagar" },
      { name: "Mughal Darbar", cuisine: "Wazwan", specialty: "Kashmiri Tabak Maaz & Seekh Kababs", price: "₹₹", location: "Srinagar" },
      { name: "Chai Jaai Tea Room", cuisine: "Kashmiri Artisanal Tea", specialty: "Noon Chai & Kehwa with Lavasa bread", price: "₹₹", location: "The Bund, Srinagar" }
    ],
    tips: "Book Gulmarg Gondola tickets online 2-3 weeks in advance. Sip hot Kehwa garnished with saffron and almonds on crisp mountain evenings."
  },

  "varanasi": {
    name: "Varanasi (Kashi)",
    country: "India",
    tagline: "The Eternal City: Sacred Ghats, Dawn Chants & Mysticism",
    type: "Spiritual & Heritage",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Oct - Mar",
    idealDuration: "2 - 3 Days",
    avgCostPerDay: { budget: 1500, moderate: 3500, luxury: 9000 },
    lat: 25.3176,
    lng: 82.9739,
    tags: ["Spiritual", "Ghats", "Heritage", "Street Food", "Culture"],
    overview: "One of the world's oldest living cities, where life, death, and devotion dance along the sacred steps of the River Ganges.",
    attractions: [
      { id: "v1", name: "Dashashwamedh Ghat Evening Ganga Aarti", category: "Spiritual", lat: 25.3075, lng: 83.0104, cost: 0, duration: "2 hrs", desc: "Mesmerizing multi-tiered brass lamp ritual with bells, conch shells, and chants." },
      { id: "v2", name: "Sunrise Boat Ride on the Ganges", category: "Experience", lat: 25.3000, lng: 83.0000, cost: 300, duration: "2 hrs", desc: "Watch dawn break over 84 ghats as pilgrims perform morning prayers." },
      { id: "v3", name: "Kashi Vishwanath Corridor & Temple", category: "Heritage", lat: 25.3109, lng: 83.0107, cost: 0, duration: "2 hrs", desc: "Golden-spired shrine dedicated to Lord Shiva connected to the Ganges." },
      { id: "v4", name: "Sarnath Deer Park & Dhamek Stupa", category: "History", lat: 25.3811, lng: 83.0225, cost: 50, duration: "3 hrs", desc: "Sacred site where Buddha delivered his first sermon after enlightenment." }
    ],
    dining: [
      { name: "Kashi Chaat Bhandar", cuisine: "Banarasi Street Food", specialty: "Tamatar Chaat, Palak Chaat & Golgappe", price: "₹", location: "Godowlia" },
      { name: "Blue Lassi Shop", cuisine: "Banarasi Lassi", specialty: "Clay-pot Pomegranate & Mango Malai Lassi", price: "₹", location: "Near Manikarnika Ghat" },
      { name: "Shree Cafe Vegetarian", cuisine: "Indian & Israeli", specialty: "Thali & Banarasi Kachori Sabzi", price: "₹", location: "Assi Ghat" }
    ],
    tips: "Walk through the narrow galis (alleys) on foot. Assi Ghat is peaceful for morning meditation and Subah-e-Banaras cultural performances."
  },

  "dubai": {
    name: "Dubai",
    country: "UAE",
    tagline: "Futuristic Skyscrapers, Desert Dunes & Ultra-Luxury",
    type: "International & Luxury",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Nov - Mar",
    idealDuration: "4 - 6 Days",
    avgCostPerDay: { budget: 5000, moderate: 12000, luxury: 35000 },
    lat: 25.2048,
    lng: 55.2708,
    tags: ["Skyscrapers", "Shopping", "Desert Safari", "Luxury", "International"],
    overview: "A dazzling oasis where futuristic ambition meets Bedouin traditions, featuring world-record architecture, mega-malls, and golden desert dunes.",
    attractions: [
      { id: "d1", name: "Burj Khalifa Observation Deck", category: "Skyline", lat: 25.1972, lng: 55.2744, cost: 3500, duration: "2 hrs", desc: "Stand atop the world's tallest building with 360-degree views of the Arabian Gulf." },
      { id: "d2", name: "Red Dunes Desert Safari & BBQ Camp", category: "Adventure", lat: 24.8500, lng: 55.7000, cost: 2500, duration: "6 hrs", desc: "4x4 dune bashing, sandboarding, camel rides, and Tanoura dance under the stars." },
      { id: "d3", name: "Dubai Marina & Dhow Dinner Cruise", category: "Leisure", lat: 25.0800, lng: 55.1400, cost: 2000, duration: "2.5 hrs", desc: "Sail past illuminated skyscrapers while enjoying a lavish international buffet." },
      { id: "d4", name: "Museum of the Future", category: "Architecture", lat: 25.2255, lng: 55.2818, cost: 3300, duration: "2.5 hrs", desc: "Architectural masterpiece exploring human innovation and future technology." }
    ],
    dining: [
      { name: "Al Ustad Special Kabab", cuisine: "Persian & Middle Eastern", specialty: "Kebab Khas & Mutton Koobideh", price: "₹₹", location: "Al Fahidi, Bur Dubai" },
      { name: "Arabian Tea House", cuisine: "Traditional Emirati", specialty: "Emirati Breakfast Tray & Machboos Laham", price: "₹₹", location: "Al Bastakiya" },
      { name: "Pierchic", cuisine: "Mediterranean Seafood", specialty: "Over-water romantic dining facing Burj Al Arab", price: "₹₹₹₹", location: "Jumeirah" }
    ],
    tips: "Purchase Burj Khalifa and Museum of the Future tickets 2 weeks prior. Use the spotless Dubai Metro for convenient travel along Sheikh Zayed Road."
  },

  "bali": {
    name: "Bali",
    country: "Indonesia",
    tagline: "Island of the Gods: Emerald Terraces, Temples & Surf",
    type: "Tropical & Cultural",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Apr - Oct",
    idealDuration: "5 - 8 Days",
    avgCostPerDay: { budget: 2500, moderate: 6000, luxury: 18000 },
    lat: -8.4095,
    lng: 115.1889,
    tags: ["Beaches", "Temples", "Yoga", "Rice Terraces", "International"],
    overview: "A spiritual sanctuary renowned for cascading rice paddies of Tegallalang, sacred volcanic temples, cliffside Kecak fire dances, and world-class surf breaks.",
    attractions: [
      { id: "b1", name: "Tegallalang Rice Terraces & Jungle Swing", category: "Nature", lat: -8.4312, lng: 115.2796, cost: 500, duration: "3 hrs", desc: "Iconic emerald green valley terraces with famous giant swings." },
      { id: "b2", name: "Uluwatu Clifftop Temple & Kecak Fire Dance", category: "Culture", lat: -8.8290, lng: 115.0849, cost: 700, duration: "3 hrs", desc: "Ancient temple perched 70m above crashing waves with dramatic sunset choir dance." },
      { id: "b3", name: "Sacred Monkey Forest Sanctuary (Ubud)", category: "Wildlife", lat: -8.5188, lng: 115.2587, cost: 400, duration: "2 hrs", desc: "Ancient jungle temple complex home to over 1,000 playful Balinese macaques." },
      { id: "b4", name: "Tanah Lot Sea Temple", category: "Scenic", lat: -8.6212, lng: 115.0868, cost: 350, duration: "2 hrs", desc: "Dramatic offshore rock formation temple surrounded by crashing ocean tides." }
    ],
    dining: [
      { name: "Bebek Bengil (Dirty Duck Diner)", cuisine: "Authentic Balinese", specialty: "Crispy Duck with Sambal Matah & Nasi Goreng", price: "₹₹", location: "Ubud" },
      { name: "Warung Babi Guling Ibu Oka", cuisine: "Balinese Specialty", specialty: "Traditional Roast Pork with Spiced Rice", price: "₹", location: "Ubud" },
      { name: "La Brisa Beach Club", cuisine: "Coastal Eco-Lounge", specialty: "Seafood Ceviche & Cocktails", price: "₹₹₹", location: "Echo Beach, Canggu" }
    ],
    tips: "Divide your stay between Ubud (cultural heart, waterfalls, wellness) and Seminyak/Canggu (beaches, beach clubs, trendy cafes)."
  }
};

// Generic synthesizer for any requested place worldwide
function generateGenericDestination(locationName) {
  const cleanName = locationName.charAt(0).toUpperCase() + locationName.slice(1);
  return {
    name: cleanName,
    country: "Global Destination",
    tagline: `Experience the Wonders of ${cleanName}`,
    type: "Bespoke Discovery",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
    bestSeason: "Year Round",
    idealDuration: "3 - 7 Days",
    avgCostPerDay: { budget: 2500, moderate: 5500, luxury: 15000 },
    lat: 20.5937,
    lng: 78.9629,
    tags: ["Exploration", "Sightseeing", "Local Food", "Culture"],
    overview: `A captivating journey to ${cleanName}, offering authentic cultural experiences, scenic vistas, and culinary delights tailored to your travel preferences.`,
    attractions: [
      { id: "gen1", name: `${cleanName} Historic Old Town & Heritage Walk`, category: "Heritage", lat: 20.59, lng: 78.96, cost: 100, duration: "2.5 hrs", desc: `Stroll through historic streets, iconic monuments, and local craft bazaars.` },
      { id: "gen2", name: `${cleanName} Central Cultural Landmark & Museum`, category: "Culture", lat: 20.60, lng: 78.97, cost: 250, duration: "2 hrs", desc: `Explore famous local exhibits, fine art collections, and heritage archives.` },
      { id: "gen3", name: `${cleanName} Panoramic Scenic Ridge & Sunset View`, category: "Scenic", lat: 20.61, lng: 78.95, cost: 50, duration: "2 hrs", desc: `Capture breathtaking golden-hour vistas overlooking ${cleanName} landscapes.` },
      { id: "gen4", name: `${cleanName} Artisan Street & Local Night Market`, category: "Dining & Shopping", lat: 20.58, lng: 78.98, cost: 300, duration: "3 hrs", desc: `Taste authentic regional street snacks, local desserts, and handmade crafts.` },
      { id: "gen5", name: `${cleanName} Countryside Nature Sanctuary`, category: "Nature", lat: 20.62, lng: 78.94, cost: 200, duration: "3.5 hrs", desc: `Breathe fresh air among peaceful trails, botanical gardens, and gentle waters.` }
    ],
    dining: [
      { name: `${cleanName} Heritage Kitchen`, cuisine: "Regional Traditional", specialty: "Authentic local specialty platter", price: "₹₹", location: "Central District" },
      { name: `The Local Flavor Café`, cuisine: "Café & Bakery", specialty: "Artisan coffee and freshly baked delicacies", price: "₹", location: "Market Square" },
      { name: `Grand Vista Lounge`, cuisine: "Fine Dining", specialty: "Chef's Tasting Menu with Panoramic Views", price: "₹₹₹", location: "High Street" }
    ],
    tips: `Check local weather in ${cleanName} ahead of departure and keep some local currency on hand for street markets and artisanal crafts.`
  };
}

// Attach to window
if (typeof window !== "undefined") {
  window.WANDERLY_DESTINATIONS = WANDERLY_DESTINATIONS;
  window.generateGenericDestination = generateGenericDestination;
}
