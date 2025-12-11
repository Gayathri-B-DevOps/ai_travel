import type { TripPreferences } from "@/types/trip";

export const buildItineraryPrompt = (prefs: TripPreferences) => {
  const destinations = prefs.destinations
    .map((dest, index) => `${index + 1}. ${dest.label}, ${dest.country ?? ""}`)
    .join("\n");

  return `
You are a travel assistant API.
Generate a JSON itinerary for:
Destinations: ${destinations}
Dates: ${prefs.startDate} to ${prefs.endDate}
Travelers: ${prefs.travelers}
Budget: ${prefs.budget}
Vibe: ${prefs.style}
Interests: ${prefs.interests.join(", ")}

Return ONLY valid JSON matching this schema exactly. Do not wrap in markdown blocks.
{
  "overview": "Brief trip summary",
  "days": [
    {
      "day": 1,
      "title": "Day Title",
      "summary": "Day summary",
      "highlights": ["Place 1", "Place 2"],
      "dining": ["Restaurant 1"],
      "stay": "Hotel Name"
    }
  ],
  "essentials": ["Item 1"],
  "packing": ["Item 1"]
}
`.trim();
};


