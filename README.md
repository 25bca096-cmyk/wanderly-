# Wanderly — AI-Powered Travel Planning & Booking Platform
> *"Your Journey, Your Way."*

A full-stack, responsive travel booking and generative itinerary planning platform inspired by **MakeMyTrip's** navigation and booking panels, elevated with the **Wanderly** brand identity and a genuinely functional AI Trip Planner.

---

## 🌟 Key Features

### 1. Brand Identity & Official Logo
- Incorporates the exact official **Wanderly circular travel badge logo** (`public/images/wanderly-logo.png` and `public/favicon.png`).
- Preserves original artwork, aspect ratio, and retro badge charm across the navbar, hero banner, search bar, booking vouchers, and footer.
- Palette: Deep Trust Navy Blue (`#0A1E3F`), Aegean Sky (`#0284C7`), and Sunset Amber (`#F59E0B`).

### 2. MakeMyTrip-Inspired Booking Experience
- **Tabbed Search Panel**:
  - ✈️ **Flights**: One-way / Round-trip / Multi-city, cabin class selection, live fare comparison, and external search links.
  - 🏨 **Hotels**: Destination search, star rating filter, amenity tags, room reservations.
  - 🚆 **Trains**: Route search with IRCTC classes (1A, 2A, 3A, SL) and **Interactive PNR Status Checker**.
  - 🚌 **Buses**: Volvo / Bharat Benz sleepers, seat selection simulator.
  - 🚖 **Cabs**: Outstation & Airport transfers with fare estimates (Sedan, SUV, Hatchback).
  - 🌴 **Holiday Packages**: All-inclusive curated packages with day-wise inclusions.
- **Realistic Checkout & Vouchers**: Promo codes (`WANDERFIRST`, `FLYAI`, `STAYLUXE`), printable booking vouchers with confirmation codes.

### 3. The Core: Real AI Trip Planner Studio
- **Natural Language Comprehension**: Understands freeform prompts, extracting destination, duration, travelers, budget tier, and custom requests.
- **Custom Constraints Engine**:
  - *Custom Start Timings*: e.g. "Start activities at 11 AM" shifts morning schedules appropriately.
  - *Budget Calibration*: Calculates accurate daily allocations (Stay, Food, Activities, Transit) based on exact figures (e.g. ₹30,000/person).
  - *Dietary Guidance*: Tailors lunch/dinner recommendations for vegetarian, local seafood, or regional cuisines.
  - *Offbeat & Crowd Avoidance*: Suggests tranquil trails and non-peak visits.
- **Interactive Itinerary & Map**:
  - Day-by-Day schedule breakdown.
  - OpenStreetMap & Leaflet.js interactive route map with pins.
  - Packing checklist tailored to climate and destination.
  - **Export PDF / Printable View** with custom print stylesheet.
  - **Save to My Trips** persistent storage (`localStorage`).

---

## 🚀 How to Run Locally

### Using Built-in PowerShell Server (Zero Dependencies)
Run the following in PowerShell from the project folder:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open your browser at:
`http://localhost:3000/` (or `http://localhost:8080/`)

### Deploying to Production
Wanderly is 100% standalone and can be deployed directly to:
- **Vercel** / **Netlify** (drag and drop or git push)
- **Firebase Hosting**
- **GitHub Pages**
