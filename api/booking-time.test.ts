import { expect, it } from "vitest";
import { validateSchedule, windhoekTime } from "../contracts/booking-time";

const now = Date.parse("2026-10-02T10:00:00Z");
it("uses Windhoek time independently of browser timezone", () => {
  expect(windhoekTime(now)).toEqual({ date: "2026-10-02", time: "12:00" });
  expect(windhoekTime(Date.parse("2026-10-02T23:00:00Z")).date).toBe("2026-10-03");
});
it("accepts future pickups through the 30-day boundary", () => {
  expect(validateSchedule("2026-10-02", "12:01", now)).toBeNull();
  expect(validateSchedule("2026-11-01", "12:00", now)).toBeNull();
});
it("rejects past pickups, invalid dates and times beyond the limit", () => {
  expect(validateSchedule("2026-10-02", "12:00", now)).not.toBeNull();
  expect(validateSchedule("2026-11-01", "12:01", now)).not.toBeNull();
  expect(validateSchedule("2026-02-30", "12:00", now)).not.toBeNull();
  expect(validateSchedule("2026-10-03", "25:00", now)).not.toBeNull();
});
