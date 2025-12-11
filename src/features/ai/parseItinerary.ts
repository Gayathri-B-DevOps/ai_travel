import { z } from "zod";
import type { TripItinerary } from "@/types/trip";

const itinerarySchema = z.object({
  overview: z.string(),
  days: z
    .array(
      z.object({
        day: z.number(),
        title: z.string(),
        summary: z.string(),
        highlights: z.array(z.string()).default([]),
        dining: z.array(z.string()).default([]),
        stay: z.string().optional()
      })
    )
    .min(1),
  essentials: z.array(z.string()).default([]),
  packing: z.array(z.string()).default([])
});

export const parseItinerary = (raw: string): TripItinerary => {
  const trimmed = raw.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Invalid itinerary payload: No JSON found");
  }

  const payload = trimmed.slice(jsonStart, jsonEnd + 1);
  let parsed: any;
  try {
    parsed = JSON.parse(payload);
  } catch (e) {
    throw new Error("Invalid JSON format from AI");
  }

  // Attempt to find the correct root object if the model wrapped it
  if (!parsed.overview || !parsed.days) {
    // Check common wrapper keys or just look for a value that looks like an itinerary
    const potentialRoot = Object.values(parsed).find(
      (val: any) => val && typeof val === "object" && "overview" in val && "days" in val
    );
    if (potentialRoot) {
      parsed = potentialRoot;
    }
  }

  return itinerarySchema.parse(parsed);
};


