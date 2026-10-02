import { describe, expect, it } from "vitest";
import { bookingLink, inferService, serviceDefaults } from "./transfer-service";

describe("service booking flow", () => {
  it("keeps each service and selected vehicle in the booking link", () => {
    for (const [service, route] of Object.entries(serviceDefaults)) {
      const query = new URL(bookingLink(service, route.vehicles[0]), "https://example.test").searchParams;
      expect(query.get("service")).toBe(service);
      expect(query.get("from")).toBe(route.from);
      expect(query.get("to")).toBe(route.to);
      expect(query.get("vehicle")).toBe(route.vehicles[0]);
    }
  });
  it("does not default every destination to airport transfers", () => {
    expect(inferService("Windhoek", "Windhoek West")).toBe("City");
    expect(inferService("Windhoek", "Sossusvlei")).toBe("Lodge");
    expect(inferService("Windhoek", "Etosha National Park")).toBe("Safari");
    expect(inferService("Windhoek", "Hosea Kutako International Airport")).toBe("Airport");
  });
});
