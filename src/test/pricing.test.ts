import { describe, it, expect } from "vitest";
import { events } from "@/pages/Index";
import { winePrice } from "@/components/ReserveDialog";

describe("dinner pricing", () => {
  it("21 november is bookable at €75 per person", () => {
    const nov = events.find((e) => e.slug === "november-21");
    expect(nov).toBeDefined();
    expect(nov!.past).toBe(false);
    expect(nov!.price).toBe(75);
  });

  it("other dinners stay at €70 and wine pairing stays €20", () => {
    expect(events.find((e) => e.slug === "september-12")!.price).toBe(70);
    expect(winePrice).toBe(20);
  });
});
