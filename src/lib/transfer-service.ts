export function inferService(from: string, to: string) {
  const route = `${from} ${to}`;
  if (/airport/i.test(route)) return "Airport";
  if (/Etosha/i.test(route)) return "Safari";
  if (/Sossusvlei|lodge|camp/i.test(route)) return "Lodge";
  return "City";
}

export function serviceSearch(service: string) {
  const from = service === "Airport" ? "Hosea Kutako International Airport" : "Windhoek";
  const to = service === "Airport" ? "Windhoek" : service === "Safari" ? "Etosha National Park" : service === "Lodge" ? "Sossusvlei" : "Windhoek West";
  return new URLSearchParams({ service, from, to }).toString();
}
