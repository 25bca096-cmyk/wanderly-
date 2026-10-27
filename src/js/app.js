// Wanderly Main Application Controller
// Orchestrates UI views, MakeMyTrip search tabs, AI planner studio, Leaflet maps, and user modals

let activeLeafletMap = null;
let currentItinerary = null;
let currentBookingSelection = null;

document.addEventListener("DOMContentLoaded", () => {
  // Show onboarding screen if user hasn't registered yet
  if (!window.wanderlyStore.hasOnboarded()) {
    showOnboardingScreen();
    return; // Don't init the rest until they submit
  }

  initApp();
});

function initApp() {
  initNavbarAndTheme();
  initBookingSearchTabs();
  initAITripPlanner();
  initExploreCatalog();
  initOffersAndCopy();
  initMyTripsView();
  initAuthAndProfile();
  initCurrencySelector();
  
  // Check if URL has hash route e.g. #ai-planner, #my-trips, #flights
  handleHashNavigation();
  window.addEventListener("hashchange", handleHashNavigation);
}

// --- Hash Navigation Handler ---
function handleHashNavigation() {
  const hash = window.location.hash.replace("#", "") || "home";
  if (hash === "ai-planner" || hash === "planner") {
    scrollToSection("ai-planner-section");
  } else if (hash === "my-trips") {
    openMyTripsModal();
  } else if (hash === "explore") {
    scrollToSection("explore-section");
  } else if (["flights", "hotels", "trains", "buses", "cabs", "packages"].includes(hash)) {
    switchBookingTab(hash);
    scrollToSection("hero-search-section");
  }
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// --- Navbar, Theme & Mobile Menu ---
function initNavbarAndTheme() {
  const mobileBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Update User button label
  const user = window.wanderlyStore.getUser();
  const userNameEl = document.getElementById("nav-user-name");
  const userInitialEl = document.getElementById("nav-user-initial");
  if (userNameEl && user && user.name) {
    userNameEl.textContent = user.name;
  }
  if (userInitialEl && user && user.name) {
    userInitialEl.textContent = user.name.charAt(0).toUpperCase();
  }
}

// --- Currency Selector ---
function initCurrencySelector() {
  const select = document.getElementById("currency-select");
  if (!select) return;

  select.value = window.wanderlyStore.getCurrency();
  select.addEventListener("change", (e) => {
    window.wanderlyStore.setCurrency(e.target.value);
    // Refresh currently rendered prices
    if (currentItinerary) {
      renderItineraryView(currentItinerary);
    }
    // Re-render search results if any
    const activeTab = document.querySelector(".booking-tab-btn.active")?.dataset.tab || "flights";
    triggerActiveSearch(activeTab);
  });
}

// --- Booking Search Tabs (MakeMyTrip Inspired) ---
function initBookingSearchTabs() {
  const tabButtons = document.querySelectorAll(".booking-tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active", "text-sky-600"));
      btn.classList.add("active", "text-sky-600");
      const tabName = btn.dataset.tab;
      switchBookingTab(tabName);
    });
  });

  // Setup Search Button
  const searchBtn = document.getElementById("main-search-submit-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const activeTab = document.querySelector(".booking-tab-btn.active")?.dataset.tab || "flights";
      triggerActiveSearch(activeTab);
    });
  }

  // Setup PNR status trigger
  const pnrBtn = document.getElementById("check-pnr-btn");
  if (pnrBtn) {
    pnrBtn.addEventListener("click", handleCheckPNR);
  }
}

function switchBookingTab(tabName) {
  const formPanels = document.querySelectorAll(".booking-form-panel");
  formPanels.forEach(p => p.classList.add("hidden"));

  const targetPanel = document.getElementById(`form-${tabName}`);
  if (targetPanel) {
    targetPanel.classList.remove("hidden");
  }

  // Update search button text
  const searchBtn = document.getElementById("main-search-submit-btn");
  if (searchBtn) {
    const labels = {
      flights: "SEARCH FLIGHTS",
      hotels: "SEARCH HOTELS",
      trains: "SEARCH TRAINS",
      buses: "SEARCH BUSES",
      cabs: "SEARCH CABS",
      packages: "EXPLORE HOLIDAY PACKAGES"
    };
    searchBtn.innerHTML = `<span>${labels[tabName] || "SEARCH"}</span> <i data-lucide="arrow-right" class="w-5 h-5 ml-2"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }

  // Clear previous search results container
  const resultsBox = document.getElementById("booking-search-results");
  if (resultsBox) resultsBox.classList.add("hidden");
}

function triggerActiveSearch(tabName) {
  const resultsContainer = document.getElementById("booking-search-results");
  if (!resultsContainer) return;

  resultsContainer.classList.remove("hidden");
  resultsContainer.innerHTML = `
    <div class="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent mb-3"></div>
      <p class="text-slate-600 font-medium">Scanning best live fares and verified itineraries...</p>
    </div>
  `;

  setTimeout(() => {
    if (tabName === "flights") renderFlightResults();
    else if (tabName === "hotels") renderHotelResults();
    else if (tabName === "trains") renderTrainResults();
    else if (tabName === "buses") renderBusResults();
    else if (tabName === "cabs") renderCabResults();
    else if (tabName === "packages") renderPackageResults();
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 400);
}

// --- Render Flights ---
function renderFlightResults() {
  const from = document.getElementById("flight-from")?.value || "Bengaluru (BLR)";
  const to = document.getElementById("flight-to")?.value || "Goa (GOI)";
  const date = document.getElementById("flight-departure")?.value || new Date().toISOString().split("T")[0];
  const travelers = document.getElementById("flight-travelers")?.value || 1;
  const cabin = document.getElementById("flight-class")?.value || "Economy";

  const searchData = window.wanderlyBooking.searchFlights({ from, to, date, travelers, cabinClass: cabin });
  const container = document.getElementById("booking-search-results");

  let html = `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full">Flight Search Results</span>
            <span class="text-xs text-slate-500">• ${searchData.count} flights found</span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mt-1">${from} → ${to}</h3>
          <p class="text-sm text-slate-500">${date} | ${travelers} Traveler(s) | ${cabin}</p>
        </div>
        <div class="flex gap-2">
          <a href="${searchData.externalLinks.googleFlights}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
            Check Google Flights <i data-lucide="external-link" class="w-3.5 h-3.5 ml-1"></i>
          </a>
          <a href="${searchData.externalLinks.makeMyTrip}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center text-xs font-semibold px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
            Check MakeMyTrip <i data-lucide="external-link" class="w-3.5 h-3.5 ml-1"></i>
          </a>
        </div>
      </div>

      <div class="divide-y divide-slate-100 mt-4">
  `;

  searchData.results.forEach(fl => {
    const formattedPrice = window.wanderlyStore.formatPrice(fl.price * travelers);
    html += `
      <div class="py-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center font-bold text-sky-700 text-base">
              ${fl.airline.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="font-bold text-slate-900">${fl.airline}</h4>
                <span class="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">${fl.flightNo}</span>
                <span class="text-[11px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-medium">✈ ${fl.aircraft || 'Commercial Aircraft'}</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">${fl.cabinClass} • 🧳 ${fl.baggage || '15 kg Check-in + 7 kg Cabin'}</p>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-center">
              <span class="text-lg font-bold text-slate-900">${fl.departureTime}</span>
              <p class="text-xs text-slate-700 font-semibold">${from.split(" ")[0]}</p>
              <p class="text-[11px] text-slate-400 font-mono">${fl.fromTerminal || 'Terminal 1'}</p>
            </div>
            <div class="text-center px-2">
              <span class="text-xs text-slate-400 font-medium">${fl.duration}</span>
              <div class="w-20 h-0.5 bg-slate-300 relative my-1">
                <div class="w-2 h-2 rounded-full bg-sky-500 absolute -top-0.5 left-1/2 -translate-x-1/2"></div>
              </div>
              <span class="text-[11px] font-semibold text-emerald-600">${fl.stops}</span>
            </div>
            <div class="text-center">
              <span class="text-lg font-bold text-slate-900">${fl.arrivalTime}</span>
              <p class="text-xs text-slate-700 font-semibold">${to.split(" ")[0]}</p>
              <p class="text-[11px] text-slate-400 font-mono">${fl.toTerminal || 'Terminal 2'}</p>
            </div>
          </div>

          <div class="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
            <div class="text-right">
              <span class="text-2xl font-extrabold text-slate-900">${formattedPrice}</span>
              <p class="text-[11px] text-slate-400">${travelers > 1 ? `Total for ${travelers} pax` : "Per adult, taxes incl."}</p>
              <p class="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block mt-0.5">✓ ${fl.fareBasis || 'Real Published Carrier Tariff'}</p>
            </div>
            <button onclick="openBookingCheckoutModal('Flight', '${fl.airline} (${fl.flightNo})', '${from} → ${to}', ${fl.price * travelers})"
                    class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm text-sm transition-all transform active:scale-95">
              Book Now
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

// --- Render Hotels ---
function renderHotelResults() {
  const dest = document.getElementById("hotel-city")?.value || "Goa";
  const checkIn = document.getElementById("hotel-checkin")?.value || new Date().toISOString().split("T")[0];
  const guests = document.getElementById("hotel-guests")?.value || 2;
  const rooms = document.getElementById("hotel-rooms")?.value || 1;

  const searchData = window.wanderlyBooking.searchHotels({ destination: dest, checkIn, guests, rooms });
  const container = document.getElementById("booking-search-results");

  let html = `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">Hotel Search Results</span>
          <h3 class="text-xl font-bold text-slate-900 mt-1">Properties in ${dest}</h3>
          <p class="text-sm text-slate-500">Check-in: ${checkIn} | ${guests} Guests | ${rooms} Room(s)</p>
        </div>
        <div class="flex gap-2">
          <a href="${searchData.externalLinks.bookingCom}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            Check on Booking.com <i data-lucide="external-link" class="w-3.5 h-3.5 ml-1"></i>
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
  `;

  searchData.results.forEach(ht => {
    const formattedPrice = window.wanderlyStore.formatPrice(ht.pricePerNight * rooms);
    html += `
      <div class="wanderly-card rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col justify-between">
        <div class="relative h-44 overflow-hidden">
          <img src="${ht.image}" alt="${ht.name}" class="w-full h-full object-cover">
          <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-xs font-bold px-2 py-1 rounded-md text-slate-800">
            ★ ${ht.rating} (${ht.reviewsCount})
          </span>
          <span class="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-md text-xs font-bold text-white px-2 py-1 rounded-md">
            ${ht.category}
          </span>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-base">${ht.name}</h4>
            <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i> ${ht.location}
            </p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              ${ht.amenities.map(a => `<span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">${a}</span>`).join("")}
            </div>
            ${ht.cancellation ? `<p class="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1"><span>✓</span> ${ht.cancellation}</p>` : ''}
          </div>
          <div class="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
            <div>
              <span class="text-xl font-black text-slate-900">${formattedPrice}</span>
              <p class="text-[11px] text-slate-400">Per night + taxes</p>
              <p class="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-0.5">✓ Published Hotel Tariff</p>
            </div>
            <button onclick="openBookingCheckoutModal('Hotel', '${ht.name}', '${ht.location}', ${ht.pricePerNight * rooms})"
                    class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm">
              Reserve Room
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

// --- Render Trains ---
function renderTrainResults() {
  const from = document.getElementById("train-from")?.value || "New Delhi (NDLS)";
  const to = document.getElementById("train-to")?.value || "Varanasi (BSB)";
  const date = document.getElementById("train-date")?.value || new Date().toISOString().split("T")[0];

  const searchData = window.wanderlyBooking.searchTrains({ from, to, date });
  const container = document.getElementById("booking-search-results");

  let html = `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full">IRCTC Train Inventory</span>
          <h3 class="text-xl font-bold text-slate-900 mt-1">${from} → ${to}</h3>
          <p class="text-sm text-slate-500">${date} | General Quota | Real Telescopic Distance Tariffs</p>
        </div>
        <a href="${searchData.externalLinks.irctc}" target="_blank" rel="noopener noreferrer" 
           class="inline-flex items-center text-xs font-semibold px-3 py-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors">
          Open Official IRCTC Portal <i data-lucide="external-link" class="w-3.5 h-3.5 ml-1"></i>
        </a>
      </div>

      <div class="divide-y divide-slate-100 mt-4">
  `;

  searchData.results.forEach(tr => {
    html += `
      <div class="py-4 hover:bg-slate-50/50 p-3 rounded-xl transition-colors">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-slate-900 text-base">${tr.name}</h4>
              <span class="text-xs font-mono font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">#${tr.trainNo}</span>
            </div>
            <p class="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>📅 Runs: <strong class="text-slate-700">${tr.runsOn}</strong></span>
              ${tr.intermediateStops ? `<span>• 🛑 Intermediate Stops: <strong class="text-slate-700">${tr.intermediateStops}</strong></span>` : ''}
            </p>
            <p class="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block mt-1">✓ ${tr.fareBasis}</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-right">
              <span class="font-bold text-slate-900 text-base">${tr.departureTime}</span>
              <p class="text-xs font-semibold text-slate-700">${tr.from || from}</p>
            </div>
            <div class="text-center px-2 text-xs text-slate-400">
              ${tr.duration}
              <div class="w-16 h-0.5 bg-slate-300 my-1"></div>
              <span class="text-[11px] text-emerald-600 font-medium">Daily Scheduled</span>
            </div>
            <div>
              <span class="font-bold text-slate-900 text-base">${tr.arrivalTime}</span>
              <p class="text-xs font-semibold text-slate-700">${tr.to || to}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
          ${tr.classes.map(c => `
            <div class="p-3 rounded-xl border border-slate-200 bg-white hover:border-sky-500 hover:shadow-sm cursor-pointer transition-all"
                 onclick="openBookingCheckoutModal('Train', '${tr.name} (${c.name})', '${from} → ${to}', ${c.fare})">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-800">${c.name} (${c.code})</span>
                <span class="font-black text-sm text-slate-900">${window.wanderlyStore.formatPrice(c.fare)}</span>
              </div>
              <p class="text-[11px] font-bold ${c.status.includes('AVAILABLE') ? 'text-emerald-600' : 'text-amber-600'} mt-1">
                ● ${c.status}
              </p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

// --- Render Buses ---
function renderBusResults() {
  const from = document.getElementById("bus-from")?.value || "Bengaluru";
  const to = document.getElementById("bus-to")?.value || "Goa";
  const date = document.getElementById("bus-date")?.value || new Date().toISOString().split("T")[0];

  const searchData = window.wanderlyBooking.searchBuses({ from, to, date });
  const container = document.getElementById("booking-search-results");

  let html = `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full">Intercity Buses</span>
          <h3 class="text-xl font-bold text-slate-900 mt-1">${from} → ${to}</h3>
          <p class="text-xs text-slate-500 mt-0.5">${date} | Verified State & Premium Private Fleet</p>
        </div>
      </div>
      <div class="divide-y divide-slate-100 mt-4">
  `;

  searchData.results.forEach(b => {
    html += `
      <div class="py-4.5 hover:bg-slate-50/50 p-3 rounded-xl transition-colors">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-slate-900 text-base">${b.operator}</h4>
              <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">★ ${b.rating}</span>
              ${b.serviceNo ? `<span class="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">${b.serviceNo}</span>` : ''}
              <span class="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">${b.seatsAvailable || 12} seats left</span>
            </div>
            <p class="text-xs text-slate-600 font-medium">🚌 ${b.busType}</p>
            <div class="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <span><strong>🚏 Boarding:</strong> ${b.boardingPoint || from}</span>
              <span class="hidden sm:inline">•</span>
              <span><strong>🏁 Dropping:</strong> ${b.droppingPoint || to}</span>
            </div>
            ${b.amenities ? `
              <div class="flex flex-wrap gap-1.5 mt-2">
                ${b.amenities.map(a => `<span class="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">${a}</span>`).join("")}
              </div>
            ` : ''}
          </div>

          <div class="flex items-center gap-6 text-sm shrink-0">
            <div class="text-right">
              <span class="font-bold text-base text-slate-900">${b.departureTime}</span>
              <p class="text-[11px] text-slate-400">${from}</p>
            </div>
            <div class="text-xs text-slate-400 text-center px-1">
              ${b.duration}
              <div class="w-16 h-0.5 bg-slate-300 my-1"></div>
              <span class="text-[10px] text-emerald-600 font-semibold">GPS Verified</span>
            </div>
            <div>
              <span class="font-bold text-base text-slate-900">${b.arrivalTime}</span>
              <p class="text-[11px] text-slate-400">${to}</p>
            </div>
          </div>

          <div class="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 shrink-0">
            <div class="text-right">
              <span class="text-xl font-black text-slate-900">${window.wanderlyStore.formatPrice(b.fare)}</span>
              <p class="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-0.5">✓ ${b.fareBasis || 'Published Tariff'}</p>
            </div>
            <button onclick="openBookingCheckoutModal('Bus', '${b.operator} (${b.busType})', '${from} → ${to}', ${b.fare})"
                    class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm">
              Select Seats
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

// --- Render Cabs ---
function renderCabResults() {
  const pickup = document.getElementById("cab-pickup")?.value || "City Center";
  const drop = document.getElementById("cab-drop")?.value || "Outstation Resort";
  const date = document.getElementById("cab-date")?.value || new Date().toISOString().split("T")[0];

  const searchData = window.wanderlyBooking.searchCabs({ pickup, drop, date });
  const container = document.getElementById("booking-search-results");

  let html = `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="pb-4 border-b border-slate-100 mb-4">
        <span class="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Commercial Chauffeur Fleet</span>
        <h3 class="text-xl font-bold text-slate-900 mt-1">Available Cabs: ${pickup} → ${drop}</h3>
        <p class="text-xs text-slate-500 mt-0.5">Government commercial yellow/white plates • State highway permits & FastTag included</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  `;

  searchData.results.forEach(c => {
    html += `
      <div class="p-5 rounded-2xl border border-slate-200 bg-white hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-sky-600 uppercase tracking-wide bg-sky-50 px-2 py-0.5 rounded-full">${c.type}</span>
            <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">★ ${c.rating}</span>
          </div>

          <h4 class="font-bold text-slate-900 text-lg mt-2">${c.carName}</h4>
          
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 my-2.5">
            <p class="text-xs text-slate-700 font-semibold">🪪 Reg: <span class="font-mono text-slate-900">${c.commercialReg || 'Commercial Fleet'}</span></p>
            <p class="text-xs text-slate-600 mt-1">👨‍✈️ <strong>Chauffeur:</strong> ${c.chauffeurName || 'Certified Driver'}</p>
            <p class="text-[11px] text-slate-500 mt-0.5">${c.chauffeurBadge || 'Verified Commercial Highway License'}</p>
          </div>

          <div class="text-xs text-slate-600 space-y-1.5">
            <p class="flex items-center gap-1.5 font-medium"><span class="text-emerald-500 font-bold">✓</span> ${c.seats} Passenger Seats & ${c.bags} Large Bags</p>
            <p class="flex items-center gap-1.5 font-medium"><span class="text-emerald-500 font-bold">✓</span> All Highway FastTag Tolls & State Taxes Included</p>
            <p class="flex items-center gap-1.5 text-slate-600 font-medium"><span class="text-sky-500 font-bold">🛣️</span> ${c.routeSummary || 'Direct Highway Transfer'}</p>
            <p class="flex items-center gap-1.5 text-slate-500 text-[11px]"><span class="text-amber-500 font-bold">⏰</span> ${c.pickupReporting || 'Chauffeur reports 15 mins prior'}</p>
          </div>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-2xl font-black text-slate-900">${window.wanderlyStore.formatPrice(c.estimatedFare)}</span>
            <p class="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-0.5">✓ ${c.fareBasis || 'Taxi Union Tariff'}</p>
            <p class="text-[10px] text-slate-400 mt-0.5 font-mono">${c.ratePerKm}</p>
          </div>
          <button onclick="openBookingCheckoutModal('Cab', '${c.carName} (${c.type})', '${pickup} to ${drop}', ${c.estimatedFare})"
                  class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm">
            Book Cab
          </button>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

// --- Render Holiday Packages ---
function renderPackageResults() {
  const destination = document.getElementById("pkg-destination")?.value || "Goa";
  const searchData = window.wanderlyBooking.searchPackages({ destination });
  const container = document.getElementById("booking-search-results");

  let html = `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="pb-4 border-b border-slate-100 mb-4">
        <span class="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">All-Inclusive Holidays</span>
        <h3 class="text-xl font-bold text-slate-900 mt-1">Curated Holiday Packages in ${destination}</h3>
        <p class="text-xs text-slate-500 mt-0.5">Includes hotel stays, private AC cab sightseeing, airport transfers & guided tours</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
  `;

  searchData.results.forEach(pkg => {
    html += `
      <div class="wanderly-card rounded-2xl border border-slate-200 overflow-hidden bg-white flex flex-col justify-between">
        <div class="relative h-44">
          <img src="${pkg.image}" alt="${pkg.title}" class="w-full h-full object-cover">
          <span class="absolute top-3 left-3 bg-navy-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-md">
            ${pkg.duration}
          </span>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-base leading-snug">${pkg.title}</h4>
            <p class="text-xs text-sky-600 font-semibold mt-1">${pkg.hotelRating} • ${pkg.highlights}</p>
            <ul class="text-xs text-slate-600 mt-3 space-y-1">
              ${pkg.inclusions.map(inc => `<li class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">✓</span> ${inc}</li>`).join("")}
            </ul>
          </div>
          <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            <div>
              <span class="text-xl font-black text-slate-900">${window.wanderlyStore.formatPrice(pkg.pricePerPerson)}</span>
              <p class="text-[10px] text-slate-400">Per person twin sharing</p>
              <p class="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-0.5">✓ Published All-Inclusive</p>
            </div>
            <button onclick="openBookingCheckoutModal('Holiday Package', '${pkg.title}', '${destination}', ${pkg.pricePerPerson})"
                    class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm">
              View & Book
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

// --- PNR Checker Handler ---
function handleCheckPNR() {
  const input = document.getElementById("pnr-input");
  const pnrVal = input?.value?.trim();
  const statusBox = document.getElementById("pnr-status-modal");
  const res = window.wanderlyBooking.checkPNR(pnrVal);

  if (!res.success) {
    alert(res.message);
    return;
  }

  const p = res.passengerStatus[0];
  const modalContent = document.getElementById("pnr-status-content");
  if (modalContent) {
    modalContent.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span class="text-xs font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">PNR: ${res.pnr}</span>
            <h4 class="font-bold text-slate-900 text-lg mt-1">${res.trainName} (${res.trainNo})</h4>
          </div>
          <span class="text-xs font-bold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">${p.currentStatus}</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl text-center">
          <div><p class="text-xs text-slate-400">Coach</p><p class="font-black text-slate-900 text-lg">${p.coach}</p></div>
          <div><p class="text-xs text-slate-400">Berth</p><p class="font-black text-slate-900 text-lg">${p.berth}</p></div>
          <div><p class="text-xs text-slate-400">Berth Type</p><p class="font-bold text-slate-800 text-xs mt-1">${p.berthType}</p></div>
          <div><p class="text-xs text-slate-400">Quota</p><p class="font-bold text-slate-800 text-xs mt-1">${p.quota}</p></div>
        </div>
        <div class="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Route: ${res.from} → ${res.to}</span>
          <span>Date: ${res.journeyDate}</span>
        </div>
      </div>
    `;
  }
  statusBox.classList.remove("hidden");
}

// --- AI TRIP PLANNER STUDIO ---
function initAITripPlanner() {
  const promptInput = document.getElementById("ai-prompt-input");
  const generateBtn = document.getElementById("ai-generate-btn");
  const samplePills = document.querySelectorAll(".prompt-sample-pill");

  // Sample prompt pills click handler
  samplePills.forEach(pill => {
    pill.addEventListener("click", () => {
      const text = pill.dataset.prompt;
      if (promptInput) {
        promptInput.value = text;
        promptInput.focus();
      }
    });
  });

  // Generate Itinerary Click
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const promptText = promptInput?.value?.trim();
      if (!promptText) {
        alert("Please enter a travel request or choose one of the sample prompts below!");
        promptInput?.focus();
        return;
      }

      runAIPlanner(promptText);
    });
  }

  // Quick prompt bar on homepage hero
  const heroQuickPromptBtn = document.getElementById("hero-quick-prompt-btn");
  if (heroQuickPromptBtn) {
    heroQuickPromptBtn.addEventListener("click", () => {
      const heroVal = document.getElementById("hero-quick-prompt-input")?.value?.trim();
      if (heroVal) {
        if (promptInput) promptInput.value = heroVal;
        scrollToSection("ai-planner-section");
        runAIPlanner(heroVal);
      } else {
        scrollToSection("ai-planner-section");
      }
    });
  }
}

function runAIPlanner(promptText) {
  const loadingEl = document.getElementById("ai-loading-indicator");
  const resultsContainer = document.getElementById("itinerary-results-container");

  if (loadingEl) loadingEl.classList.remove("hidden");
  if (resultsContainer) resultsContainer.classList.add("hidden");

  // Simulated AI synthesis delay for realistic intelligence feel
  setTimeout(() => {
    try {
      const itinerary = window.wanderlyAI.generateItinerary(promptText);
      currentItinerary = itinerary;
      renderItineraryView(itinerary);

      if (loadingEl) loadingEl.classList.add("hidden");
      if (resultsContainer) {
        resultsContainer.classList.remove("hidden");
        resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("AI Planner error:", err);
      if (loadingEl) loadingEl.classList.add("hidden");
      alert("Encountered an issue generating itinerary. Please try again!");
    }
  }, 750);
}

// --- Render Generated Itinerary View ---
function renderItineraryView(itinerary) {
  const container = document.getElementById("itinerary-results-container");
  if (!container) return;

  const totalFormatted = window.wanderlyStore.formatPrice(itinerary.totalBudget);
  const perPersonFormatted = window.wanderlyStore.formatPrice(itinerary.budgetPerPerson);

  let html = `
    <!-- Branded Print Header (Shown only during PDF print) -->
    <div class="print-only-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="public/images/wanderly-logo.png" alt="Wanderly" class="w-14 h-14 object-contain">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Wanderly Travel Itinerary</h1>
            <p class="text-xs text-slate-500">"Your Journey, Your Way." • wanderly.ai</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-mono text-slate-500">ID: ${itinerary.id}</span>
          <p class="text-xs text-slate-500">Generated: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>

    <!-- Header Hero Card -->
    <div class="bg-gradient-to-r from-navy-950 via-slate-900 to-sky-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="max-w-2xl">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              AI Personalized
            </span>
            <span class="bg-white/10 backdrop-blur-md text-xs px-3 py-1 rounded-full border border-white/20">
              📍 ${itinerary.destination}, ${itinerary.country}
            </span>
            <span class="bg-white/10 backdrop-blur-md text-xs px-3 py-1 rounded-full border border-white/20">
              ⏱️ ${itinerary.daysCount} Days / ${itinerary.daysCount - 1} Nights
            </span>
            <span class="bg-white/10 backdrop-blur-md text-xs px-3 py-1 rounded-full border border-white/20">
              👥 ${itinerary.travelersCount} Traveler(s) (${itinerary.groupType})
            </span>
            ${itinerary.startHour >= 11 ? `<span class="bg-orange-500/80 text-xs font-bold px-3 py-1 rounded-full">⏰ Starts at ${itinerary.startHour}:00 AM</span>` : ""}
          </div>
          <h2 class="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            ${itinerary.title}
          </h2>
          <p class="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
            ${itinerary.overview}
          </p>
          <div class="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">
            <span>🌦️ Best Season: <strong class="text-white">${itinerary.bestSeason}</strong></span>
            <span>🚗 Local Transit: <strong class="text-white">${itinerary.transitAdvice}</strong></span>
          </div>
        </div>

        <!-- Budget Box & Action Buttons -->
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-center min-w-[240px] flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-300 font-bold">Estimated Cost</span>
            <div class="text-3xl font-black text-amber-400 my-1">${totalFormatted}</div>
            <p class="text-xs text-slate-300">${perPersonFormatted} per person (${itinerary.budgetTier} Tier)</p>
          </div>
          
          <div class="space-y-2 mt-4 no-print">
            <button onclick="saveCurrentItinerary()" 
                    class="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2">
              <i data-lucide="bookmark" class="w-4 h-4"></i> Save to My Trips
            </button>
            <button onclick="window.print()" 
                    class="w-full py-2 px-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2">
              <i data-lucide="printer" class="w-4 h-4"></i> Export PDF / Print
            </button>
            <button onclick="bookConnectedTravel('${itinerary.destination}')" 
                    class="w-full py-2 px-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2">
              <i data-lucide="plane-takeoff" class="w-4 h-4"></i> Book Flights & Hotels
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cost Breakdown & Map Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <!-- Cost Breakdown Visualizer -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h4 class="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
          <i data-lucide="pie-chart" class="w-4 h-4 text-sky-600"></i> Smart Budget Allocation
        </h4>
        <div class="space-y-3 text-xs">
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Accommodation (40%)</span>
              <span>${window.wanderlyStore.formatPrice(itinerary.budgetBreakdown.stay)}</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="bg-sky-600 h-2 rounded-full" style="width: 40%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Dining & Local Food (25%)</span>
              <span>${window.wanderlyStore.formatPrice(itinerary.budgetBreakdown.food)}</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="bg-amber-500 h-2 rounded-full" style="width: 25%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Activities & Sightseeing (20%)</span>
              <span>${window.wanderlyStore.formatPrice(itinerary.budgetBreakdown.activities)}</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="bg-emerald-500 h-2 rounded-full" style="width: 20%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Local Transit & Transfers (15%)</span>
              <span>${window.wanderlyStore.formatPrice(itinerary.budgetBreakdown.transport)}</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 15%"></div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
          <p class="text-xs text-amber-900 font-medium leading-relaxed">
            💡 <strong>Insider Tip:</strong> ${itinerary.tips}
          </p>
        </div>
      </div>

      <!-- Interactive Leaflet Map -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <i data-lucide="map" class="w-4 h-4 text-sky-600"></i> Interactive Route & Point of Interest Map
          </h4>
          <span class="text-xs text-slate-400">Click pins for details</span>
        </div>
        <div id="itinerary-map"></div>
      </div>
    </div>

    <!-- Day-by-Day Timeline View -->
    <div class="mt-8 space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-black text-slate-900">Day-by-Day Travel Plan</h3>
        <span class="text-xs text-slate-500">Customizable & Interactive</span>
      </div>

      <div class="space-y-4">
  `;

  itinerary.scheduleDays.forEach(day => {
    html += `
      <div class="wanderly-card bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-sky-600 text-white font-black text-sm flex items-center justify-center">
              D${day.dayNumber}
            </span>
            <div>
              <h4 class="font-bold text-slate-900 text-base">Day ${day.dayNumber}: ${day.title}</h4>
              <p class="text-xs text-slate-500">${day.theme}</p>
            </div>
          </div>
          ${day.notes ? `<span class="text-xs bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-full border border-emerald-200">${day.notes}</span>` : ""}
        </div>

        <div class="p-4 sm:p-6 divide-y divide-slate-100">
          ${day.slots.map((s, idx) => `
            <div class="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group">
              <div class="flex items-start gap-3">
                <div class="mt-1 w-2.5 h-2.5 rounded-full ${s.category.includes('Food') ? 'bg-amber-500' : 'bg-sky-500'}"></div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-slate-400 font-mono">${s.time}</span>
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-md ${s.category.includes('Food') ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}">
                      ${s.category}
                    </span>
                  </div>
                  <h5 class="font-bold text-slate-900 text-sm mt-0.5">${s.title}</h5>
                  <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">${s.desc}</p>
                  ${s.tip ? `<p class="text-[11px] text-sky-700 italic mt-1">✨ ${s.tip}</p>` : ""}
                </div>
              </div>
              <div class="flex items-center gap-3 self-end sm:self-center">
                <span class="text-xs font-bold text-slate-700">${s.cost > 0 ? window.wanderlyStore.formatPrice(s.cost) : "Free"}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>

    <!-- Packing Checklist -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
      <h4 class="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> Smart Packing Checklist for ${itinerary.destination}
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        ${itinerary.packingList.map(item => `
          <label class="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
            <input type="checkbox" class="rounded text-sky-600 focus:ring-sky-500">
            <span>${item}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  // Initialize or re-center Leaflet Map
  initLeafletMap(itinerary.mapCoordinates);
}

// --- Leaflet Map Initializer ---
function initLeafletMap(coords) {
  if (typeof L === "undefined") return;

  const mapContainer = document.getElementById("itinerary-map");
  if (!mapContainer) return;

  if (activeLeafletMap) {
    activeLeafletMap.remove();
    activeLeafletMap = null;
  }

  activeLeafletMap = L.map("itinerary-map").setView([coords.centerLat, coords.centerLng], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap contributors"
  }).addTo(activeLeafletMap);

  const latlngs = [];
  coords.pins.forEach(pin => {
    latlngs.push([pin.lat, pin.lng]);
    const marker = L.marker([pin.lat, pin.lng]).addTo(activeLeafletMap);
    marker.bindPopup(`<strong>${pin.name}</strong><br><span class="text-xs text-slate-500">${pin.category}</span>`);
  });

  // Draw connecting polyline
  if (latlngs.length > 1) {
    L.polyline(latlngs, { color: "#0284C7", weight: 3, dashArray: "5, 10" }).addTo(activeLeafletMap);
    activeLeafletMap.fitBounds(L.latLngBounds(latlngs), { padding: [30, 30] });
  }
}

// --- Action: Save Current Itinerary ---
function saveCurrentItinerary() {
  if (!currentItinerary) return;
  window.wanderlyStore.saveTrip(currentItinerary);
  alert("🎉 Itinerary successfully saved to your My Trips dashboard!");
}

// --- Action: Book Connected Travel ---
function bookConnectedTravel(destinationName) {
  switchBookingTab("flights");
  const toInput = document.getElementById("flight-to");
  if (toInput) toInput.value = destinationName;
  scrollToSection("hero-search-section");
  triggerActiveSearch("flights");
}

// --- Action: Checkout Modal & Confirmation Voucher ---
function openBookingCheckoutModal(service, title, route, price) {
  currentBookingSelection = { service, title, route, price };
  const modal = document.getElementById("booking-checkout-modal");
  const content = document.getElementById("booking-checkout-content");

  if (modal && content) {
    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span class="text-xs uppercase font-bold text-sky-600">${service} Booking</span>
            <h4 class="font-bold text-slate-900 text-lg">${title}</h4>
            <p class="text-xs text-slate-500">${route}</p>
          </div>
          <span class="text-xl font-black text-slate-900">${window.wanderlyStore.formatPrice(price)}</span>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Primary Traveler Name</label>
            <input type="text" id="checkout-traveler-name" value="${window.wanderlyStore.getUser().name}" 
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Email ID</label>
              <input type="email" id="checkout-traveler-email" value="${window.wanderlyStore.getUser().email}" 
                     class="w-full px-3 py-2 border border-slate-300 rounded-lg">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="tel" id="checkout-traveler-phone" value="+91 98765 43210" 
                     class="w-full px-3 py-2 border border-slate-300 rounded-lg">
            </div>
          </div>

          <!-- Coupon Code Box -->
          <div class="pt-2">
            <label class="block font-bold text-slate-700 mb-1">Have a Promo Code?</label>
            <div class="flex gap-2">
              <input type="text" id="checkout-coupon-input" placeholder="e.g. WANDERFIRST" uppercase
                     class="flex-1 px-3 py-2 border border-slate-300 rounded-lg uppercase font-mono font-bold text-xs">
              <button onclick="applyCheckoutCoupon()" 
                      class="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700">
                Apply
              </button>
            </div>
            <p id="checkout-coupon-msg" class="text-[11px] mt-1"></p>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-slate-500">Grand Total:</span>
            <div id="checkout-final-price" class="text-2xl font-black text-slate-900">${window.wanderlyStore.formatPrice(price)}</div>
          </div>
          <button onclick="confirmDemoBooking()" 
                  class="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-transform active:scale-95">
            Confirm & Generate Voucher
          </button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  }
}

function applyCheckoutCoupon() {
  if (!currentBookingSelection) return;
  const input = document.getElementById("checkout-coupon-input");
  const msg = document.getElementById("checkout-coupon-msg");
  const priceEl = document.getElementById("checkout-final-price");

  const res = window.wanderlyBooking.applyCoupon(input?.value, currentBookingSelection.price);
  if (res.success) {
    currentBookingSelection.discountedPrice = res.finalAmount;
    msg.className = "text-[11px] text-emerald-600 font-bold mt-1";
    msg.textContent = res.message;
    priceEl.textContent = window.wanderlyStore.formatPrice(res.finalAmount);
  } else {
    msg.className = "text-[11px] text-red-600 font-bold mt-1";
    msg.textContent = res.message;
  }
}

function confirmDemoBooking() {
  if (!currentBookingSelection) return;
  const travelerName = document.getElementById("checkout-traveler-name")?.value || window.wanderlyStore.getUser()?.name || "Traveller";
  const finalPrice = currentBookingSelection.discountedPrice || currentBookingSelection.price;

  const booking = window.wanderlyStore.addBooking({
    service: currentBookingSelection.service,
    title: currentBookingSelection.title,
    route: currentBookingSelection.route,
    price: finalPrice,
    travelerName: travelerName
  });

  // Close checkout modal
  document.getElementById("booking-checkout-modal").classList.add("hidden");

  // Show official voucher modal
  showVoucherModal(booking);
}

function showVoucherModal(booking) {
  const modal = document.getElementById("voucher-modal");
  const content = document.getElementById("voucher-modal-content");
  if (modal && content) {
    content.innerHTML = `
      <div class="p-6 text-center space-y-4">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="check" class="w-8 h-8"></i>
        </div>
        <h3 class="text-2xl font-black text-slate-900">Booking Confirmed!</h3>
        <p class="text-xs text-slate-500">Your Wanderly Travel Voucher has been issued and saved to My Trips.</p>

        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
          <div class="flex justify-between border-b pb-1">
            <span class="text-slate-400">BOOKING REF:</span>
            <span class="font-bold text-slate-900">${booking.id}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="text-slate-400">SERVICE:</span>
            <span class="font-bold text-slate-900">${booking.service}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="text-slate-400">DETAILS:</span>
            <span class="font-bold text-slate-900">${booking.title}</span>
          </div>
          <div class="flex justify-between border-b pb-1">
            <span class="text-slate-400">TRAVELER:</span>
            <span class="font-bold text-slate-900">${booking.travelerName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">PAID AMOUNT:</span>
            <span class="font-black text-emerald-600 text-sm">${window.wanderlyStore.formatPrice(booking.price)}</span>
          </div>
        </div>

        <div class="flex gap-2 justify-center pt-2">
          <button onclick="window.print()" class="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold">
            Print Voucher
          </button>
          <button onclick="document.getElementById('voucher-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold">
            Close
          </button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  }
}

// --- Explore Destinations Catalog ---
function initExploreCatalog() {
  const container = document.getElementById("explore-grid");
  if (!container) return;

  const dests = Object.values(window.WANDERLY_DESTINATIONS);
  let html = "";
  dests.forEach(d => {
    html += `
      <div class="wanderly-card bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between">
        <div class="relative h-48 overflow-hidden">
          <img src="${d.image}" alt="${d.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
          <div class="absolute inset-0 destination-card-gradient"></div>
          <div class="absolute bottom-3 left-4 right-4 text-white">
            <span class="text-[11px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white">${d.type}</span>
            <h4 class="text-xl font-bold leading-tight mt-1">${d.name}</h4>
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <p class="text-xs text-slate-500 leading-relaxed">${d.overview.substring(0, 110)}...</p>
          <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
            <div>
              <span class="text-xs text-slate-400">From</span>
              <p class="text-base font-extrabold text-slate-900">${window.wanderlyStore.formatPrice(d.avgCostPerDay.moderate)}/day</p>
            </div>
            <button onclick="planTripForDestination('${d.name}')" 
                    class="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
              Plan with AI <i data-lucide="sparkles" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

function planTripForDestination(destName) {
  const input = document.getElementById("ai-prompt-input");
  if (input) {
    input.value = `Plan a 4-day trip to ${destName} with local authentic food and top sights.`;
    scrollToSection("ai-planner-section");
    runAIPlanner(input.value);
  }
}

// --- Offers & Promo Code Copy ---
function initOffersAndCopy() {
  document.querySelectorAll(".copy-coupon-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code;
      navigator.clipboard.writeText(code).then(() => {
        const origText = btn.textContent;
        btn.textContent = "COPIED!";
        btn.classList.add("bg-emerald-600", "text-white");
        setTimeout(() => {
          btn.textContent = origText;
          btn.classList.remove("bg-emerald-600", "text-white");
        }, 2000);
      });
    });
  });
}

// --- My Trips Dashboard Modal ---
function initMyTripsView() {
  const myTripsBtn = document.getElementById("nav-my-trips-btn");
  if (myTripsBtn) {
    myTripsBtn.addEventListener("click", openMyTripsModal);
  }
}

function openMyTripsModal() {
  const modal = document.getElementById("my-trips-modal");
  const trips = window.wanderlyStore.getSavedTrips();
  const bookings = window.wanderlyStore.getBookings();
  const content = document.getElementById("my-trips-modal-content");

  if (!modal || !content) return;

  let html = `
    <div class="space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h3 class="text-2xl font-black text-slate-900">My Trips & Bookings</h3>
          <p class="text-xs text-slate-500">Manage all your AI itineraries and confirmed tickets</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-amber-500"></i> Saved AI Itineraries (${trips.length})
          </h4>
          ${trips.length === 0 ? `
            <div class="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
              No saved AI trips yet. Generate an itinerary and click "Save to My Trips"!
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${trips.map(t => `
                <div class="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-sky-500 transition-colors">
                  <div>
                    <h5 class="font-bold text-slate-900 text-sm">${t.title}</h5>
                    <p class="text-xs text-slate-500">${t.destination} • ${t.daysCount} Days • ${window.wanderlyStore.formatPrice(t.totalBudget)}</p>
                  </div>
                  <div class="flex gap-1.5">
                    <button onclick='loadSavedTrip("${t.id}")' class="px-2.5 py-1.5 bg-sky-100 text-sky-800 rounded-lg text-xs font-bold hover:bg-sky-200">
                      View
                    </button>
                    <button onclick='deleteSavedTrip("${t.id}")' class="px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100">
                      Delete
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>

        <div>
          <h4 class="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <i data-lucide="ticket" class="w-4 h-4 text-sky-600"></i> Confirmed Vouchers & Bookings (${bookings.length})
          </h4>
          ${bookings.length === 0 ? `
            <div class="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
              No booked travel vouchers yet. Search flights, hotels or cabs to generate mock bookings.
            </div>
          ` : `
            <div class="divide-y divide-slate-100 bg-slate-50 rounded-xl p-3 border border-slate-200">
              ${bookings.map(b => `
                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span class="font-mono font-bold text-sky-700">${b.id}</span>
                    <p class="font-bold text-slate-800">${b.service}: ${b.title}</p>
                    <span class="text-slate-400">${b.route}</span>
                  </div>
                  <div class="text-right">
                    <span class="font-black text-slate-900">${window.wanderlyStore.formatPrice(b.price)}</span>
                    <p class="text-[10px] text-emerald-600 font-bold uppercase">${b.status}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  content.innerHTML = html;
  modal.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
}

function loadSavedTrip(tripId) {
  const trip = window.wanderlyStore.getTripById(tripId);
  if (trip) {
    currentItinerary = trip;
    renderItineraryView(trip);
    document.getElementById("my-trips-modal").classList.add("hidden");
    document.getElementById("itinerary-results-container").classList.remove("hidden");
    scrollToSection("itinerary-results-container");
  }
}

function deleteSavedTrip(tripId) {
  window.wanderlyStore.deleteTrip(tripId);
  openMyTripsModal(); // re-render
}

// --- Auth & Profile ---
function initAuthAndProfile() {
  const signinBtn = document.getElementById("nav-signin-btn");
  const modal = document.getElementById("auth-modal");
  if (signinBtn && modal) {
    signinBtn.addEventListener("click", () => {
      renderProfileModal();
      modal.classList.remove("hidden");
    });
  }
}

function renderProfileModal() {
  const modal = document.getElementById("auth-modal");
  const user = window.wanderlyStore.getUser();
  const content = modal.querySelector(".auth-modal-body");
  if (!content) return;

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  content.innerHTML = `
    <div class="text-center mb-5">
      <div class="w-16 h-16 rounded-full bg-navy-900 text-white flex items-center justify-center text-2xl font-black mx-auto mb-2">${initials}</div>
      <h3 class="text-xl font-black text-slate-900">${user?.name || "Traveller"}</h3>
      ${user?.email ? `<p class="text-xs text-slate-500">${user.email}</p>` : ""}
      <span class="text-[11px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">✦ Wanderly Member</span>
    </div>

    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs mb-4">
      ${user?.phone ? `<div class="flex justify-between"><span class="text-slate-400">Phone</span><span class="font-bold text-slate-800">${user.phone}</span></div>` : ""}
      ${user?.age ? `<div class="flex justify-between"><span class="text-slate-400">Age</span><span class="font-bold text-slate-800">${user.age}</span></div>` : ""}
      ${user?.homeCity ? `<div class="flex justify-between"><span class="text-slate-400">Home City</span><span class="font-bold text-slate-800">${user.homeCity}</span></div>` : ""}
      <div class="flex justify-between"><span class="text-slate-400">Reward Points</span><span class="font-bold text-emerald-700">${(user?.rewardPoints || 0).toLocaleString("en-IN")} pts</span></div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <button onclick="openMyTripsModal()" 
              class="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors">
        📋 My Trips
      </button>
      <button onclick="signOutUser()"
              class="py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-colors">
        🚪 Sign Out
      </button>
    </div>
  `;
}

function signOutUser() {
  localStorage.removeItem("wanderly_active_user_v1");
  localStorage.removeItem("wanderly_onboarded_v1");
  document.getElementById("auth-modal")?.classList.add("hidden");
  // Reload to show onboarding again
  window.location.reload();
}

function quickLoginUser(name, email, city) {
  // Legacy function kept for compatibility – now unused
  const user = {
    isLoggedIn: true,
    name: name,
    email: email,
    avatar: "",
    homeCity: city,
    dietaryPreference: "Flexible",
    travelStyle: "Explorer",
    tier: "Wanderly Member",
    rewardPoints: 1200
  };
  window.wanderlyStore.setUser(user);
  window.wanderlyStore.markOnboarded();
  document.getElementById("auth-modal")?.classList.add("hidden");
  initNavbarAndTheme();
}

// --- Onboarding Screen ---
function showOnboardingScreen() {
  // Hide main content and show fullscreen onboarding overlay
  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.id = "wanderly-onboarding-overlay";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    font-family: 'Inter', sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background:#fff; border-radius:2rem; padding:2.5rem; max-width:480px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.4); position:relative; animation: slideUp 0.4s ease-out;">
      
      <!-- Logo & Brand -->
      <div style="text-align:center; margin-bottom:1.5rem;">
        <img src="public/images/wanderly-logo.png" alt="Wanderly" 
             style="width:72px; height:72px; border-radius:50%; object-fit:contain; border:3px solid #e2e8f0; margin:0 auto 0.75rem; display:block;">
        <h1 style="font-size:1.75rem; font-weight:900; color:#0f172a; margin:0 0 0.25rem;">Welcome to Wanderly</h1>
        <p style="font-size:0.8rem; color:#64748b; margin:0;">"Your Journey, Your Way." — Let's get you started!</p>
      </div>

      <!-- Progress dots -->
      <div style="display:flex; justify-content:center; gap:0.4rem; margin-bottom:1.5rem;">
        <div style="width:8px;height:8px;border-radius:50%;background:#0ea5e9;"></div>
        <div style="width:24px;height:8px;border-radius:4px;background:#e2e8f0;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:#e2e8f0;"></div>
      </div>

      <!-- Form -->
      <form id="onboarding-form" onsubmit="submitOnboarding(event)" novalidate>
        
        <!-- Name (MANDATORY) -->
        <div style="margin-bottom:1rem;">
          <label style="display:block; font-size:0.75rem; font-weight:700; color:#374151; margin-bottom:0.4rem;">
            Your Name <span style="color:#ef4444;">*</span> <span style="color:#94a3b8;font-weight:400;">(required)</span>
          </label>
          <input type="text" id="ob-name" placeholder="e.g. Rahul Sharma" required
                 style="width:100%; padding:0.65rem 0.9rem; border:2px solid #e2e8f0; border-radius:0.75rem; font-size:0.875rem; outline:none; box-sizing:border-box; transition:border 0.2s;"
                 onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          <p id="ob-name-err" style="color:#ef4444; font-size:0.7rem; margin-top:0.3rem; display:none;">Please enter your name to continue.</p>
        </div>

        <!-- Optional fields header -->
        <p style="font-size:0.7rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em; margin:0.75rem 0 0.6rem;">Optional Details</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
          <!-- Age -->
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:#374151; margin-bottom:0.4rem;">Age</label>
            <input type="number" id="ob-age" placeholder="e.g. 28" min="5" max="120"
                   style="width:100%; padding:0.6rem 0.75rem; border:2px solid #e2e8f0; border-radius:0.75rem; font-size:0.875rem; outline:none; box-sizing:border-box;"
                   onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
          <!-- Phone -->
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:600; color:#374151; margin-bottom:0.4rem;">Phone Number</label>
            <input type="tel" id="ob-phone" placeholder="+91 98765 43210"
                   style="width:100%; padding:0.6rem 0.75rem; border:2px solid #e2e8f0; border-radius:0.75rem; font-size:0.875rem; outline:none; box-sizing:border-box;"
                   onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
        </div>

        <!-- Email -->
        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.75rem; font-weight:600; color:#374151; margin-bottom:0.4rem;">Email Address</label>
          <input type="email" id="ob-email" placeholder="you@example.com"
                 style="width:100%; padding:0.65rem 0.9rem; border:2px solid #e2e8f0; border-radius:0.75rem; font-size:0.875rem; outline:none; box-sizing:border-box;"
                 onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
        </div>

        <!-- Submit -->
        <button type="submit"
                style="width:100%; padding:0.85rem; background:linear-gradient(135deg,#0ea5e9,#0369a1); color:white; font-weight:800; font-size:1rem; border:none; border-radius:1rem; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 15px rgba(14,165,233,0.4);"
                onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 8px 20px rgba(14,165,233,0.5)'"
                onmouseout="this.style.transform='none';this.style.boxShadow='0 4px 15px rgba(14,165,233,0.4)'">
          🚀 Start My Journey
        </button>

        <p style="text-align:center; font-size:0.7rem; color:#94a3b8; margin-top:0.75rem;">
          🔒 Your details are stored locally on your device only. We don't send anything to any server.
        </p>
      </form>
    </div>
    <style>
      @keyframes slideUp {
        from { opacity:0; transform:translateY(30px); }
        to   { opacity:1; transform:translateY(0); }
      }
    </style>
  `;

  document.body.appendChild(overlay);
}

function submitOnboarding(e) {
  e.preventDefault();
  const nameInput = document.getElementById("ob-name");
  const nameErr   = document.getElementById("ob-name-err");
  const name  = (nameInput?.value || "").trim();

  if (!name) {
    nameErr.style.display = "block";
    nameInput.style.borderColor = "#ef4444";
    nameInput.focus();
    return;
  }
  nameErr.style.display = "none";

  const age   = (document.getElementById("ob-age")?.value || "").trim();
  const phone = (document.getElementById("ob-phone")?.value || "").trim();
  const email = (document.getElementById("ob-email")?.value || "").trim();

  window.wanderlyStore.setUser({
    isLoggedIn: true,
    name,
    email,
    age,
    phone,
    avatar: "",
    homeCity: "",
    dietaryPreference: "Any / Flexible",
    travelStyle: "Explorer & Food Lover",
    tier: "Wanderly Member",
    rewardPoints: 500
  });
  window.wanderlyStore.markOnboarded();

  // Remove overlay with animation
  const overlay = document.getElementById("wanderly-onboarding-overlay");
  if (overlay) {
    overlay.style.transition = "opacity 0.4s";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      initApp();
    }, 400);
  }
}

// Make functions accessible from inline HTML onclick attributes
window.switchBookingTab = switchBookingTab;
window.triggerActiveSearch = triggerActiveSearch;
window.handleCheckPNR = handleCheckPNR;
window.openBookingCheckoutModal = openBookingCheckoutModal;
window.confirmDemoBooking = confirmDemoBooking;
window.applyCheckoutCoupon = applyCheckoutCoupon;
window.saveCurrentItinerary = saveCurrentItinerary;
window.bookConnectedTravel = bookConnectedTravel;
window.openMyTripsModal = openMyTripsModal;
window.loadSavedTrip = loadSavedTrip;
window.deleteSavedTrip = deleteSavedTrip;
window.planTripForDestination = planTripForDestination;
window.quickLoginUser = quickLoginUser;
window.scrollToSection = scrollToSection;
window.signOutUser = signOutUser;
window.submitOnboarding = submitOnboarding;
