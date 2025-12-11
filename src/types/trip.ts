export type TripStyle = "relax" | "adventure" | "culture" | "romance" | "family";
export type TripBudget = "value" | "balanced" | "premium";

export interface Destination {
  id: string;
  label: string;
  coordinates: [number, number];
  country?: string;
}

export interface TripPreferences {
  destinations: Destination[];
  startDate: string;
  endDate: string;
  travelers: number;
  budget: TripBudget;
  style: TripStyle;
  interests: string[];
  notes?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  summary: string;
  highlights: string[];
  dining?: string[];
  stay?: string;
}

export interface TripItinerary {
  overview: string;
  days: ItineraryDay[];
  essentials: string[];
  packing: string[];
}


