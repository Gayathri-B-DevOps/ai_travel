import { create } from "zustand";
import type { TripPreferences, TripItinerary } from "@/types/trip";

interface TripState {
  preferences: TripPreferences | null;
  itinerary: TripItinerary | null;
  isGenerating: boolean;
  error: string | null;
  setPreferences: (prefs: TripPreferences) => void;
  setItinerary: (itinerary: TripItinerary | null) => void;
  setIsGenerating: (value: boolean) => void;
  setError: (message: string | null) => void;
  reset: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  preferences: null,
  itinerary: null,
  isGenerating: false,
  error: null,
  setPreferences: (prefs) => set({ preferences: prefs }),
  setItinerary: (itinerary) => set({ itinerary }),
  setIsGenerating: (value) => set({ isGenerating: value }),
  setError: (message) => set({ error: message }),
  reset: () => set({ preferences: null, itinerary: null, error: null, isGenerating: false })
}));

