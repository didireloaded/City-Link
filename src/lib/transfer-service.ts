export const serviceDefaults: Record<string, { from: string; to: string; vehicles: string[] }> = {
  Airport: { from: "Hosea Kutako International Airport", to: "Windhoek", vehicles: ["sedan", "compact-suv", "suv", "mini-bus"] },
  City: { from: "Windhoek", to: "Windhoek West", vehicles: ["sedan", "compact-suv", "mini-bus"] },
  Lodge: { from: "Windhoek", to: "Sossusvlei", vehicles: ["suv", "compact-suv", "mini-bus"] },
  Safari: { from: "Windhoek", to: "Etosha National Park", vehicles: ["suv", "mini-bus"] },
  Executive: { from: "Windhoek", to: "Windhoek West", vehicles: ["suv", "compact-suv"] },
  Staff: { from: "Windhoek", to: "Windhoek West", vehicles: ["mini-bus"] },
};
export function inferService(from: string, to: string) {
  if (/airport/i.test(`${from} ${to}`)) return "Airport";
  if (/Etosha|Fish River/i.test(to)) return "Safari";
  if (/Sossusvlei|Swakopmund/i.test(to)) return "Lodge";
  return "City";
}
export function bookingLink(service: string, vehicle?: string) {
  const route = serviceDefaults[service];
  const query = new URLSearchParams(route ? { service, from: route.from, to: route.to } : {});
  if (vehicle) query.set("vehicle", vehicle);
  return `/book?${query}`;
}
