// Wanderly Trip & User State Store
// Manages local persistence for Itineraries, Bookings, Bucket List, and User Profile

const WANDERLY_STORAGE_KEYS = {
  SAVED_TRIPS: "wanderly_saved_itineraries_v1",
  BOOKINGS: "wanderly_bookings_v1",
  WISHLIST: "wanderly_wishlist_v1",
  USER: "wanderly_active_user_v1",
  CURRENCY: "wanderly_preferred_currency_v1",
  THEME: "wanderly_theme_mode_v1",
  ONBOARDED: "wanderly_onboarded_v1"
};

// Default User Profile (used only after onboarding)
const DEFAULT_USER = {
  isLoggedIn: false,
  name: "",
  email: "",
  age: "",
  phone: "",
  avatar: "",
  homeCity: "",
  dietaryPreference: "Any / Flexible",
  travelStyle: "Explorer & Food Lover",
  tier: "Wanderly Member",
  rewardPoints: 0
};

class TripsStore {
  constructor() {
    this.init();
  }

  init() {
    // Don't auto-set a default user — onboarding handles first-time setup
    if (!localStorage.getItem(WANDERLY_STORAGE_KEYS.CURRENCY)) {
      localStorage.setItem(WANDERLY_STORAGE_KEYS.CURRENCY, "INR");
    }
    if (!localStorage.getItem(WANDERLY_STORAGE_KEYS.THEME)) {
      localStorage.setItem(WANDERLY_STORAGE_KEYS.THEME, "light");
    }
    if (!localStorage.getItem(WANDERLY_STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(WANDERLY_STORAGE_KEYS.WISHLIST, JSON.stringify(["goa", "kashmir", "bali"]));
    }
  }

  // --- Onboarding check ---
  hasOnboarded() {
    return !!localStorage.getItem(WANDERLY_STORAGE_KEYS.ONBOARDED);
  }

  markOnboarded() {
    localStorage.setItem(WANDERLY_STORAGE_KEYS.ONBOARDED, "1");
  }

  // --- User Profile ---
  getUser() {
    try {
      const data = localStorage.getItem(WANDERLY_STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  }

  setUser(userData) {
    localStorage.setItem(WANDERLY_STORAGE_KEYS.USER, JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent("wanderly:user-changed", { detail: userData }));
  }

  // --- Currency & Rates ---
  getCurrency() {
    return localStorage.getItem(WANDERLY_STORAGE_KEYS.CURRENCY) || "INR";
  }

  setCurrency(curr) {
    localStorage.setItem(WANDERLY_STORAGE_KEYS.CURRENCY, curr);
    window.dispatchEvent(new CustomEvent("wanderly:currency-changed", { detail: curr }));
  }

  formatPrice(inrAmount) {
    const curr = this.getCurrency();
    const rates = {
      INR: { symbol: "₹", rate: 1, locale: "en-IN" },
      USD: { symbol: "$", rate: 0.012, locale: "en-US" },
      EUR: { symbol: "€", rate: 0.011, locale: "de-DE" },
      GBP: { symbol: "£", rate: 0.0095, locale: "en-GB" }
    };
    const c = rates[curr] || rates.INR;
    const converted = Math.round(inrAmount * c.rate);
    return `${c.symbol}${converted.toLocaleString(c.locale)}`;
  }

  // --- Saved Itineraries ---
  getSavedTrips() {
    try {
      const raw = localStorage.getItem(WANDERLY_STORAGE_KEYS.SAVED_TRIPS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  saveTrip(trip) {
    const trips = this.getSavedTrips();
    const existingIndex = trips.findIndex(t => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = { ...trips[existingIndex], ...trip, updatedAt: new Date().toISOString() };
    } else {
      trip.id = trip.id || "trip_" + Date.now();
      trip.createdAt = new Date().toISOString();
      trips.unshift(trip);
    }
    localStorage.setItem(WANDERLY_STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(trips));
    window.dispatchEvent(new CustomEvent("wanderly:trips-updated", { detail: trips }));
    return trip;
  }

  deleteTrip(tripId) {
    let trips = this.getSavedTrips();
    trips = trips.filter(t => t.id !== tripId);
    localStorage.setItem(WANDERLY_STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(trips));
    window.dispatchEvent(new CustomEvent("wanderly:trips-updated", { detail: trips }));
  }

  getTripById(tripId) {
    return this.getSavedTrips().find(t => t.id === tripId);
  }

  // --- Bookings & Tickets ---
  getBookings() {
    try {
      const raw = localStorage.getItem(WANDERLY_STORAGE_KEYS.BOOKINGS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  addBooking(booking) {
    const bookings = this.getBookings();
    booking.id = booking.id || "WND-" + Math.floor(100000 + Math.random() * 900000);
    booking.bookingDate = new Date().toISOString();
    booking.status = "Confirmed";
    bookings.unshift(booking);
    localStorage.setItem(WANDERLY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent("wanderly:bookings-updated", { detail: bookings }));
    return booking;
  }

  // --- Wishlist ---
  getWishlist() {
    try {
      const raw = localStorage.getItem(WANDERLY_STORAGE_KEYS.WISHLIST);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  toggleWishlist(destKey) {
    let list = this.getWishlist();
    if (list.includes(destKey)) {
      list = list.filter(k => k !== destKey);
    } else {
      list.push(destKey);
    }
    localStorage.setItem(WANDERLY_STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("wanderly:wishlist-updated", { detail: list }));
    return list.includes(destKey);
  }
}

// Global instance
const wanderlyStore = new TripsStore();
if (typeof window !== "undefined") {
  window.wanderlyStore = wanderlyStore;
}
