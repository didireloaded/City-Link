export type Amenity =
  | "AC"
  | "Meet & Greet"
  | "Luggage Help"
  | "Child Seat"
  | "Bottled Water"
  | "Smoke Free"
  | "Private"
  | "4x4"
  | "Chauffeur";

export interface VehicleCategory {
  id: string;
  name: string;
  model: string;
  amenities: Amenity[];
  seatLayout: { rows: number; cols: number; aisleAfter: number };
  capacity: number;
  luggageCapacity: number;
  rating: number;
  comfortRating: number;
  safetyNote: string;
  wifiInfo: string;
  chargingInfo: string;
  airportWindhoekRate?: number;
  imageUrl: string;
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  bus: VehicleCategory;
  bookedSeats: string[];
  stops: string[];
  pickup: string;
  dropoff: string;
  badge?: string;
  operatingDays?: string[];
  quoteOnly?: boolean;
  serviceType: string;
}

export interface CityLinkRoute {
  id: string;
  origin: string;
  destination: string;
  durationDisplay: string;
  priceNAD: number;
  departureTime: string;
  arrivalTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  stops: string[];
  pathCoords: { x: number; y: number; name: string; isStop: boolean }[];
}

export const CITY_LINK_INFO = {
  name: "Windhoek City Cab",
  tagline: "Private Transfers Across Namibia",
  founded: 2014,
  founder: {
    name: "JS City Cab cc T/A City Cab Transfers",
    title: "Private transfer and chauffeur service",
  },
  mission: "Reliable, safe and affordable private transfers in Windhoek and across Namibia.",
  pillars: ["Private Transfers", "Professional Drivers", "24/7 Availability"],
  onTimeRatePercent: 99,
  contact: {
    phone: "+264 81 257 2188",
    whatsapp: "264812572188",
    email: "info@whk-citycab.com",
    hours: "24 hours a day, 7 days a week",
    address: "17 Hahnemann Street, Windhoek West, Namibia",
  },
  operatingNote: "Airport, city, lodge, safari, executive and staff transport available by private booking.",
  discounts: [],
  offices: [{ city: "Windhoek", address: "17 Hahnemann Street, Windhoek West, Namibia" }],
};

export const ROUTES = [
  "Current Location",
  "Hosea Kutako International Airport",
  "Windhoek",
  "Windhoek West",
  "Swakopmund",
  "Sossusvlei",
  "Etosha National Park",
  "Fish River Canyon",
];

export const PICKUP_POINTS: Record<string, string[]> = {
  "Current Location": ["Use current location", "Saved Home", "Saved Work", "Saved Hotel"],
  "Hosea Kutako International Airport": ["Arrivals Hall Meet & Greet", "Airport Drop-off Zone"],
  Windhoek: ["Hotel pickup", "Home address", "Office pickup", "17 Hahnemann Street, Windhoek West"],
  "Windhoek West": ["17 Hahnemann Street", "Hotel pickup", "Home address"],
  Swakopmund: ["Hotel pickup", "Guesthouse pickup", "Central Swakopmund"],
  Sossusvlei: ["Lodge pickup", "Camp pickup", "Airstrip pickup"],
  "Etosha National Park": ["Lodge pickup", "Gate pickup", "Camp pickup"],
  "Fish River Canyon": ["Lodge pickup", "Viewpoint pickup", "Camp pickup"],
};

export const SERVICES = [
  {
    title: "Airport Transfers",
    desc: "Private airport pickup and drop-off with luggage assistance and meet-and-greet service.",
    serviceType: "Airport Transfer",
  },
  {
    title: "City Transfers",
    desc: "Book a private point-to-point ride in Windhoek or nearby areas.",
    serviceType: "City Transfer",
  },
  {
    title: "Lodge Transfers",
    desc: "Private transfers from airports, cities or pickup points to lodges across Namibia.",
    serviceType: "Lodge Transfer",
  },
  {
    title: "Safari Transfers",
    desc: "Comfortable 4x4 transfers for safari routes, gravel roads and remote destinations.",
    serviceType: "Safari Transfer",
  },
  {
    title: "Executive Transfers",
    desc: "Private chauffeur service for corporate travel, meetings, errands and airport transfers.",
    serviceType: "Executive Transfer",
  },
  {
    title: "Staff Transportation",
    desc: "Reliable company and employee transport for businesses and organizations.",
    serviceType: "Staff Transportation",
  },
];

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: "sedan",
    name: "Sedan",
    model: "Toyota Corolla Quest",
    amenities: ["AC", "Smoke Free", "Luggage Help", "Private"],
    seatLayout: { rows: 1, cols: 4, aisleAfter: 2 },
    capacity: 3,
    luggageCapacity: 3,
    rating: 4.8,
    comfortRating: 4.7,
    safetyNote: "Professional City Cab driver assigned after confirmation.",
    wifiInfo: "Air-conditioned private transfer.",
    chargingInfo: "Driver support available 24/7 by phone or WhatsApp.",
    airportWindhoekRate: 450,
    imageUrl: "https://media.dealeralchemist.com/jellies/Toyota/Corolla/C442320_040_Side.png?auto=compress%2Cformat",
  },
  {
    id: "compact-suv",
    name: "Compact SUV",
    model: "Toyota Corolla Cross",
    amenities: ["AC", "Smoke Free", "Luggage Help", "Private"],
    seatLayout: { rows: 1, cols: 4, aisleAfter: 2 },
    capacity: 3,
    luggageCapacity: 4,
    rating: 4.8,
    comfortRating: 4.8,
    safetyNote: "Comfortable option for airport and city transfers.",
    wifiInfo: "Air-conditioned cabin with flexible pickup.",
    chargingInfo: "WhatsApp support remains available throughout the transfer.",
    airportWindhoekRate: 700,
    imageUrl: "https://assets.cdntoyota.co.za/toyotacms23/attachments/cm5nv0u1xqfyracakek8qpa66-cross-gr-s-side-ret.desktop.png",
  },
  {
    id: "suv",
    name: "SUV",
    model: "Toyota Fortuner SUV",
    amenities: ["AC", "Smoke Free", "Luggage Help", "Private", "4x4"],
    seatLayout: { rows: 2, cols: 3, aisleAfter: 2 },
    capacity: 4,
    luggageCapacity: 6,
    rating: 4.9,
    comfortRating: 4.9,
    safetyNote: "Experienced local driver for city, lodge and safari routes.",
    wifiInfo: "Air-conditioned 4x4 suitable for longer transfers.",
    chargingInfo: "Good ground clearance for gravel-road destinations.",
    airportWindhoekRate: 900,
    imageUrl: "https://content.toyota.com.ph/uploads/prices/913/002_913_1733805355275_000.png",
  },
  {
    id: "mini-bus",
    name: "Mini Bus",
    model: "Toyota Quantum",
    amenities: ["AC", "Smoke Free", "Luggage Help", "Private", "Bottled Water"],
    seatLayout: { rows: 3, cols: 4, aisleAfter: 2 },
    capacity: 12,
    luggageCapacity: 15,
    rating: 4.8,
    comfortRating: 4.8,
    safetyNote: "Private group transfer with professional driver.",
    wifiInfo: "Air-conditioned group transport.",
    chargingInfo: "Suitable for families, staff transport and lodge transfers.",
    airportWindhoekRate: 1200,
    imageUrl: "https://assets.cdntoyota.co.za/toyotacms23/attachments/clp5ad2ds01ic31akrygc5pf0-quantum-panel-design-hero-1920x1080.desktop.jpg",
  },
];

const airportRoute = (from: string, to: string) =>
  [from, to].includes("Hosea Kutako International Airport") && [from, to].includes("Windhoek");

export const createTransferOptions = (from: string, to: string, pickupTime = "14:30"): Trip[] =>
  VEHICLE_CATEGORIES.map((vehicle) => {
    const priced = airportRoute(from, to);
    return {
      id: vehicle.id,
      from,
      to,
      departure: pickupTime,
      arrival: "Tracked",
      duration: from === to ? "Local" : priced ? "45-55 min" : "Quote route",
      price: priced ? vehicle.airportWindhoekRate || 0 : 0,
      quoteOnly: !priced,
      bus: vehicle,
      bookedSeats: [],
      stops: priced ? ["Meet & Greet available", "Luggage assistance"] : ["Private route", "Driver assigned after confirmation"],
      pickup: PICKUP_POINTS[from]?.[0] || from,
      dropoff: PICKUP_POINTS[to]?.[0] || to,
      badge: priced ? "Airport-Windhoek Rate" : "Request Quote",
      operatingDays: ["Every day"],
      serviceType: [from, to].includes("Hosea Kutako International Airport") ? "Airport Transfer" : "Private Transfer",
    };
  });

export const TRIPS: Trip[] = createTransferOptions("Hosea Kutako International Airport", "Windhoek");

export const INTERACTIVE_ROUTES: CityLinkRoute[] = [
  {
    id: "airport-windhoek",
    origin: "Hosea Kutako International Airport",
    destination: "Windhoek",
    durationDisplay: "45-55 min",
    priceNAD: 450,
    departureTime: "On demand",
    arrivalTime: "Tracked",
    pickupAddress: "Arrivals Hall Meet & Greet",
    dropoffAddress: "Windhoek address or hotel",
    stops: ["Airport arrivals", "Windhoek"],
    pathCoords: [
      { x: 70, y: 22, name: "HKIA", isStop: true },
      { x: 54, y: 42, name: "Airport Road", isStop: false },
      { x: 42, y: 66, name: "Windhoek", isStop: true },
    ],
  },
  {
    id: "windhoek-swakopmund",
    origin: "Windhoek",
    destination: "Swakopmund",
    durationDisplay: "Request Quote",
    priceNAD: 0,
    departureTime: "Scheduled",
    arrivalTime: "Tracked",
    pickupAddress: "Windhoek address",
    dropoffAddress: "Swakopmund hotel or address",
    stops: ["Private route"],
    pathCoords: [
      { x: 52, y: 72, name: "Windhoek", isStop: true },
      { x: 42, y: 58, name: "Usakos", isStop: false },
      { x: 25, y: 47, name: "Swakopmund", isStop: true },
    ],
  },
];

export const POPULAR_ROUTES = [
  { from: "Hosea Kutako International Airport", to: "Windhoek", price: 450, duration: "45-55 min" },
  { from: "Windhoek", to: "Swakopmund", price: 0, duration: "Request Quote" },
  { from: "Windhoek", to: "Sossusvlei", price: 0, duration: "Request Quote" },
  { from: "Windhoek", to: "Etosha National Park", price: 0, duration: "Request Quote" },
  { from: "Windhoek", to: "Fish River Canyon", price: 0, duration: "Request Quote" },
];

export const LUGGAGE = [
  { id: "none", label: "No luggage", desc: "Small personal item", price: 0 },
  { id: "carry", label: "Carry-on", desc: "1-2 small bags", price: 0 },
  { id: "checked", label: "Checked luggage", desc: "2-4 bags", price: 0 },
  { id: "group", label: "Group luggage", desc: "5+ bags or equipment", price: 0 },
];
