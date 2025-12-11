import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { TripPreferences, TripItinerary } from "@/types/trip";
import { buildItineraryPrompt } from "./createPrompt";
import { parseItinerary } from "./parseItinerary";
import { useTripStore } from "@/store/trip";

export const useItinerary = () => {
  const setItinerary = useTripStore((state) => state.setItinerary);
  const setIsGenerating = useTripStore((state) => state.setIsGenerating);
  const setError = useTripStore((state) => state.setError);

  return useMutation<TripItinerary, Error, TripPreferences>({
    mutationFn: async (prefs) => {
      const prompt = buildItineraryPrompt(prefs);

      try {
        console.log("Starting AI generation with Ollama...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gemma2:2b", // Faster model
            prompt: prompt,
            stream: false,
            format: "json",
            options: {
              temperature: 0.7,
              num_ctx: 2048 // Smaller context for speed
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Ollama response received:", data);

        if (!data.response) {
          throw new Error("Ollama returned an empty response");
        }

        return parseItinerary(data.response);
      } catch (err) {
        console.error("AI Generation failed:", err);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error("Request timed out. Local AI is taking too long.");
        }
        throw new Error(
          err instanceof Error
            ? err.message
            : "Failed to connect to Ollama. Is it running on port 11434?"
        );
      }
    },
    onMutate: () => {
      setIsGenerating(true);
      setError(null);
    },
    onSuccess: (data) => {
      setItinerary(data);
      toast.success("Itinerary generated");
    },
    onError: (error) => {
      setItinerary(null);
      setError(error.message);
      toast.error(error.message);
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });
};

