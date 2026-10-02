import { describe, expect, it } from "vitest";
import { recentDestinations, savedPlaceSchema, savedPlacesSchema } from "../contracts/places";

describe("saved places", () => {
  const place = { id: "71bdbdaf-e420-4b21-bb42-87c3d2a1e6f5", label: "Home", locality: "Windhoek", address: "10 Main Street" };
  it("accepts addresses without inventing coordinates", () => {
    expect(savedPlaceSchema.parse(place).coordinates).toBeUndefined();
  });
  it("rejects invalid coordinates and duplicate identifiers", () => {
    expect(savedPlaceSchema.safeParse({ ...place, coordinates: { latitude: 91, longitude: 17 } }).success).toBe(false);
    expect(savedPlacesSchema.safeParse([place, place]).success).toBe(false);
  });
  it("rejects empty labels", () => {
    expect(savedPlaceSchema.safeParse({ ...place, label: " " }).success).toBe(false);
  });
});

describe("recent destinations", () => {
  it("keeps newest unique destinations and caps at ten", () => {
    const rows = [{ toLocation: "Windhoek", dropoff: "Hotel" }, { toLocation: " windhoek ", dropoff: "hotel" }, ...Array.from({ length: 12 }, (_, i) => ({ toLocation: String(i), dropoff: null }))];
    const result = recentDestinations(rows);
    expect(result).toHaveLength(10);
    expect(result[0]).toBe(rows[0]);
    expect(result[1].toLocation).toBe("0");
  });
});
