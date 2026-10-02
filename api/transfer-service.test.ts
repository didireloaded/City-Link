import { describe, expect, it } from "vitest";
import { bookingLink, resolveService } from "../src/lib/transfer-service";

describe("service-scoped ride flow", () => {
  it("preserves an explicitly selected service", () => {
    expect(resolveService("Safari", "Windhoek", "Windhoek West")).toBe("Safari");
  });
  it("infers airport service without a valid explicit choice", () => {
    expect(resolveService("unknown", "Windhoek", "Hosea Kutako International Airport")).toBe("Airport");
  });
  it("carries service and vehicle into booking", () => {
    const url = new URL(bookingLink("Lodge", "suv"), "http://localhost");
    expect(url.searchParams.get("service")).toBe("Lodge");
    expect(url.searchParams.get("vehicle")).toBe("suv");
    expect(url.searchParams.get("to")).toBe("Sossusvlei");
  });
});
