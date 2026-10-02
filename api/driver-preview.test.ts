import { expect, it } from "vitest";
import { samples, transition } from "../driver-app/src/rides";

it("requires the arrival step and correct PIN before starting", () => {
  const accepted = transition(samples[0], "accepted");
  expect(() => transition(accepted, "driving", "4821")).toThrow();
  const arrived = transition(accepted, "arrived");
  expect(() => transition(arrived, "driving", "0000")).toThrow();
  const driving = transition(arrived, "driving", "4821");
  expect(transition(driving, "completed").status).toBe("completed");
});
it("does not revive completed or declined rides", () => {
  const declined = transition(samples[0], "declined");
  expect(() => transition(declined, "accepted")).toThrow();
  expect(samples[0].status).toBe("offered");
});
