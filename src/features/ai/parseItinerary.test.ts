import { describe, expect, it } from "vitest";
import { parseItinerary } from "./parseItinerary";

describe("parseItinerary", () => {
  it("parses valid JSON payloads", () => {
    const payload = `
    {
      "overview": "Sample overview",
      "days": [
        {
          "day": 1,
          "title": "Day One",
          "summary": "Do things",
          "highlights": ["Museum"],
          "dining": ["Cafe"],
          "stay": "Hotel"
        }
      ],
      "essentials": ["Passport"],
      "packing": ["Sneakers"]
    }
    `;

    const result = parseItinerary(payload);
    expect(result.days).toHaveLength(1);
    expect(result.essentials[0]).toBe("Passport");
  });

  it("throws on invalid payloads", () => {
    expect(() => parseItinerary("not json")).toThrow();
  });
});


