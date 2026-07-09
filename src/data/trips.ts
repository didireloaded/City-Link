export type Amenity =
  | "AC"
  | "WiFi"
  | "USB"
  | "Reclining"
  | "Snacks"
  | "Toilet"
  | "Dinner Service"
  | "Pillow & Blanket"
  | "Dental Kit";

export interface Bus {
  id: string;
  name: string;
  model: string;
  amenities: Amenity[];
  seatLayout: { rows: number; cols: number; aisleAfter: number };
  capacity: number;
  rating: number;
  comfortRating: number;
  safetyNote: string;
  wifiInfo: string;
  chargingInfo: string;
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  bus: Bus;
  bookedSeats: string[];
  stops: string[];
  pickup: string;
  dropoff: string;
  badge?: string;
  operatingDays?: string[];
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
  name: "City-Link",
  tagline: "Your Shortcut to Comfortable Travel",
  founded: 2026,
  founder: {
    name: "Haikali Ndatulumukwa",
    title: "Founder & Managing Director",
  },
  mission: "To connect people to the places they need to be, on time and in comfort.",
  pillars: ["Safety", "Reliability", "Customer Care"],
  onTimeRatePercent: 99,
  contact: {
    phone: "0818767676",
    email: "info@citylink.com.na",
    hours: "Sun-Fri, 09:00-20:00",
  },
  operatingNote: "Does not operate Saturdays. Operates on public holidays. Boarding 30 minutes before departure.",
  discounts: [
    { type: "student", label: "Student Discount", percent: 5, code: "STUDENT5" },
    { type: "senior", label: "Senior Citizen", percent: 8, code: "SENIOR8" },
    { type: "return_ticket", label: "Return Ticket Saving", percent: 6, code: "RETURN6" },
  ],
  offices: [
    { city: "Oshakati", address: "Ekuku Mall, Unit 10, Okatana Road" },
    { city: "Ondangwa", address: "Sun Square Complex, Unit 5, Rooftech Building" },
    { city: "Windhoek", address: "Erf 7 Bahnhof Street, opposite Palm Trees Park" },
  ],
};

export const ROUTES = [
  "Windhoek",
  "Oshakati",
  "Ongwediva",
  "Ondangwa",
  "Omuthiya",
  "Otjiwarongo",
  "Walvis Bay",
  "Swakopmund",
];

export const PICKUP_POINTS: Record<string, string[]> = {
  Windhoek: ["Erf 7 Bahnhof Street (Opposite Palm Trees Park)", "Grove Mall Pickup Point", "Katutura Terminal"],
  Oshakati: ["Ekuku Mall, Unit 10, Okatana Road", "Oshakati Open Market"],
  Ongwediva: ["Ongwediva Trade Fair Stop", "B1 Highway Transit Hub"],
  Ondangwa: ["Sun Square Complex, Unit 5, Rooftech Building", "Ondangwa Shell Stop"],
  Omuthiya: ["Omuthiya Town Centre Stop", "Total Service Station"],
  Otjiwarongo: ["Otjiwarongo Total Highway Hub", "Town Centre Stop"],
  "Walvis Bay": ["Walvis Bay Airport Road", "Central Station"],
  Swakopmund: ["Swakopmund Shell Stop", "Mole Pickup Point"],
};

export const INTERACTIVE_ROUTES: CityLinkRoute[] = [
  {
    id: "oshakati-windhoek",
    origin: "Oshakati",
    destination: "Windhoek",
    durationDisplay: "8h 55min",
    priceNAD: 360,
    departureTime: "06:30",
    arrivalTime: "15:25",
    pickupAddress: "Ekuku Mall, Unit 10, Okatana Road",
    dropoffAddress: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    stops: ["Ongwediva", "Ondangwa", "Omuthiya", "Otjiwarongo", "Okahandja"],
    pathCoords: [
      { x: 42, y: 12, name: "Oshakati", isStop: true },
      { x: 45, y: 16, name: "Ongwediva", isStop: true },
      { x: 48, y: 22, name: "Ondangwa", isStop: true },
      { x: 53, y: 32, name: "Omuthiya", isStop: true },
      { x: 55, y: 44, name: "Tsumeb", isStop: false },
      { x: 52, y: 58, name: "Otjiwarongo", isStop: true },
      { x: 50, y: 76, name: "Okahandja", isStop: false },
      { x: 50, y: 88, name: "Windhoek", isStop: true },
    ],
  },
  {
    id: "ongwediva-windhoek",
    origin: "Ongwediva",
    destination: "Windhoek",
    durationDisplay: "7h 55min",
    priceNAD: 360,
    departureTime: "06:30",
    arrivalTime: "14:25",
    pickupAddress: "Ongwediva Trade Fair Stop (B1 Highway)",
    dropoffAddress: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    stops: ["Ondangwa", "Omuthiya", "Otjiwarongo", "Okahandja"],
    pathCoords: [
      { x: 45, y: 16, name: "Ongwediva", isStop: true },
      { x: 48, y: 22, name: "Ondangwa", isStop: true },
      { x: 53, y: 32, name: "Omuthiya", isStop: true },
      { x: 55, y: 44, name: "Tsumeb", isStop: false },
      { x: 52, y: 58, name: "Otjiwarongo", isStop: true },
      { x: 50, y: 76, name: "Okahandja", isStop: false },
      { x: 50, y: 88, name: "Windhoek", isStop: true },
    ],
  },
  {
    id: "ondangwa-windhoek",
    origin: "Ondangwa",
    destination: "Windhoek",
    durationDisplay: "7h 00min",
    priceNAD: 360,
    departureTime: "06:30",
    arrivalTime: "13:30",
    pickupAddress: "Sun Square Complex, Unit 5, Rooftech Building",
    dropoffAddress: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    stops: ["Omuthiya", "Otjiwarongo", "Okahandja"],
    pathCoords: [
      { x: 48, y: 22, name: "Ondangwa", isStop: true },
      { x: 53, y: 32, name: "Omuthiya", isStop: true },
      { x: 55, y: 44, name: "Tsumeb", isStop: false },
      { x: 52, y: 58, name: "Otjiwarongo", isStop: true },
      { x: 50, y: 76, name: "Okahandja", isStop: false },
      { x: 50, y: 88, name: "Windhoek", isStop: true },
    ],
  },
  {
    id: "omuthiya-windhoek",
    origin: "Omuthiya",
    destination: "Windhoek",
    durationDisplay: "7h 00min",
    priceNAD: 360,
    departureTime: "06:30",
    arrivalTime: "13:30",
    pickupAddress: "Omuthiya Town Centre Stop",
    dropoffAddress: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    stops: ["Otjiwarongo", "Okahandja"],
    pathCoords: [
      { x: 53, y: 32, name: "Omuthiya", isStop: true },
      { x: 55, y: 44, name: "Tsumeb", isStop: false },
      { x: 52, y: 58, name: "Otjiwarongo", isStop: true },
      { x: 50, y: 76, name: "Okahandja", isStop: false },
      { x: 50, y: 88, name: "Windhoek", isStop: true },
    ],
  },
  {
    id: "oshakati-otjiwarongo",
    origin: "Oshakati",
    destination: "Otjiwarongo",
    durationDisplay: "6h 20min",
    priceNAD: 320,
    departureTime: "06:30",
    arrivalTime: "12:50",
    pickupAddress: "Ekuku Mall, Unit 10, Okatana Road",
    dropoffAddress: "Otjiwarongo Total Highway Hub",
    stops: ["Ongwediva", "Ondangwa", "Omuthiya", "Tsumeb"],
    pathCoords: [
      { x: 42, y: 12, name: "Oshakati", isStop: true },
      { x: 45, y: 16, name: "Ongwediva", isStop: true },
      { x: 48, y: 22, name: "Ondangwa", isStop: true },
      { x: 53, y: 32, name: "Omuthiya", isStop: true },
      { x: 55, y: 44, name: "Tsumeb", isStop: true },
      { x: 52, y: 58, name: "Otjiwarongo", isStop: true },
    ],
  },
];

export const POPULAR_ROUTES = [
  { from: "Oshakati", to: "Windhoek", price: 360, duration: "8h 55m" },
  { from: "Ongwediva", to: "Windhoek", price: 360, duration: "7h 55m" },
  { from: "Ondangwa", to: "Windhoek", price: 360, duration: "7h 00m" },
  { from: "Omuthiya", to: "Windhoek", price: 360, duration: "7h 00m" },
  { from: "Oshakati", to: "Otjiwarongo", price: 320, duration: "6h 20m" },
];

const luxuryFleet: Bus[] = [
  {
    id: "cl-sleeper-01",
    name: "City-Link Luxury Sleeper #1",
    model: "Scania K410 Luxury Sleeper Bus",
    amenities: [
      "AC",
      "WiFi",
      "USB",
      "Reclining",
      "Toilet",
      "Dinner Service",
      "Pillow & Blanket",
      "Dental Kit",
    ],
    seatLayout: { rows: 12, cols: 4, aisleAfter: 2 },
    capacity: 49,
    rating: 4.9,
    comfortRating: 5.0,
    safetyNote: "Inspected daily; strict 99% on-time departure standard.",
    wifiInfo: "High-speed onboard Wi-Fi across the entire B1 highway route.",
    chargingInfo: "USB and cable phone charging ports at every individual sleeper seat.",
  },
  {
    id: "cl-sleeper-02",
    name: "City-Link Executive #2",
    model: "Irizar i6S Premium Coach",
    amenities: [
      "AC",
      "WiFi",
      "USB",
      "Reclining",
      "Snacks",
      "Toilet",
      "Pillow & Blanket",
    ],
    seatLayout: { rows: 12, cols: 4, aisleAfter: 2 },
    capacity: 49,
    rating: 4.9,
    comfortRating: 4.9,
    safetyNote: "Two professional drivers assigned on overnight trips.",
    wifiInfo: "Complimentary Wi-Fi with unlimited instant messaging.",
    chargingInfo: "Fast-charging cable ports at every seat pair.",
  },
];

const seats = (...ids: string[]) => ids;

export const TRIPS: Trip[] = [
  {
    id: "t1",
    from: "Oshakati",
    to: "Windhoek",
    departure: "06:30",
    arrival: "15:25",
    duration: "8h 55m",
    price: 360,
    bus: luxuryFleet[0],
    bookedSeats: seats("1A", "1B", "2A", "3C", "4D", "5A", "6B", "7C", "8D", "9A", "10B"),
    stops: ["Ongwediva", "Ondangwa", "Omuthiya", "Otjiwarongo", "Okahandja"],
    pickup: "Ekuku Mall, Unit 10, Okatana Road",
    dropoff: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    badge: "99% On-Time",
    operatingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "t2",
    from: "Ongwediva",
    to: "Windhoek",
    departure: "06:30",
    arrival: "14:25",
    duration: "7h 55m",
    price: 360,
    bus: luxuryFleet[0],
    bookedSeats: seats("1C", "2D", "3A", "5C", "6D", "8A", "9B"),
    stops: ["Ondangwa", "Omuthiya", "Otjiwarongo", "Okahandja"],
    pickup: "Ongwediva Trade Fair Stop",
    dropoff: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    badge: "Sleeper Coach",
    operatingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "t3",
    from: "Ondangwa",
    to: "Windhoek",
    departure: "06:30",
    arrival: "13:30",
    duration: "7h 00m",
    price: 360,
    bus: luxuryFleet[1],
    bookedSeats: seats("1A", "2C", "3B", "4D", "6C", "8B", "9A"),
    stops: ["Omuthiya", "Otjiwarongo", "Okahandja"],
    pickup: "Sun Square Complex, Unit 5, Rooftech Building",
    dropoff: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    badge: "Sleeper Coach",
    operatingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "t4",
    from: "Omuthiya",
    to: "Windhoek",
    departure: "06:30",
    arrival: "13:30",
    duration: "7h 00m",
    price: 360,
    bus: luxuryFleet[1],
    bookedSeats: seats("2A", "4B", "5C", "7D"),
    stops: ["Otjiwarongo", "Okahandja"],
    pickup: "Omuthiya Town Centre Stop",
    dropoff: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    operatingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "t5",
    from: "Oshakati",
    to: "Otjiwarongo",
    departure: "06:30",
    arrival: "12:50",
    duration: "6h 20m",
    price: 320,
    bus: luxuryFleet[0],
    bookedSeats: seats("1A", "1B", "3C", "5D"),
    stops: ["Ongwediva", "Ondangwa", "Omuthiya", "Tsumeb"],
    pickup: "Ekuku Mall, Unit 10, Okatana Road",
    dropoff: "Otjiwarongo Total Highway Hub",
    badge: "Direct North",
    operatingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "t6",
    from: "Windhoek",
    to: "Oshakati",
    departure: "06:30",
    arrival: "15:25",
    duration: "8h 55m",
    price: 360,
    bus: luxuryFleet[0],
    bookedSeats: seats("1A", "2A", "2B", "3C", "4D", "6A", "7C"),
    stops: ["Okahandja", "Otjiwarongo", "Omuthiya", "Ondangwa", "Ongwediva"],
    pickup: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    dropoff: "Ekuku Mall, Unit 10, Okatana Road",
    badge: "Return Route",
    operatingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "t7",
    from: "Windhoek",
    to: "Ondangwa",
    departure: "06:30",
    arrival: "13:30",
    duration: "7h 00m",
    price: 360,
    bus: luxuryFleet[1],
    bookedSeats: seats("1C", "3A", "5B", "7D", "9A"),
    stops: ["Okahandja", "Otjiwarongo", "Omuthiya"],
    pickup: "Erf 7 Bahnhof Street, opposite Palm Trees Park",
    dropoff: "Sun Square Complex, Unit 5, Rooftech Building",
    operatingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
];

export const LUGGAGE = [
  { id: "small", label: "Small bag", desc: "Up to 5 kg", price: 0 },
  { id: "medium", label: "Medium bag", desc: "5-15 kg", price: 30 },
  { id: "large", label: "Large bag", desc: "15-25 kg", price: 60 },
  { id: "box", label: "Box or parcel", desc: "Standard box", price: 80 },
  { id: "bulk", label: "Bulk item", desc: "25 kg+", price: 150 },
];
