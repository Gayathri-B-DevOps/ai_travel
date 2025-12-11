import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { geocodeDestinations } from "@/lib/geocode";
import { useTripStore } from "@/store/trip";
import type { TripBudget, TripPreferences, TripStyle } from "@/types/trip";
import { useItinerary } from "@/features/ai/useItinerary";

const INTEREST_PRESETS = [
  "Food & wine",
  "Architecture",
  "Nightlife",
  "Nature",
  "Wellness",
  "Art & design",
  "History",
  "Kids friendly"
];

const tripSchema = z.object({
  destinations: z
    .string()
    .min(3, "Tell us at least one destination")
    .max(200),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  travelers: z.coerce.number().min(1).max(20),
  budget: z.enum(["value", "balanced", "premium"]),
  style: z.enum(["relax", "adventure", "culture", "romance", "family"]),
  interests: z.string().array().min(1, "Pick at least one interest"),
  notes: z.string().optional()
});

type TripFormFields = z.infer<typeof tripSchema>;

const STEPS = ["Trip basics", "Personalize"];

export const TripPlannerForm = () => {
  const [step, setStep] = useState(0);
  const setPreferences = useTripStore((state) => state.setPreferences);
  const itineraryMutation = useItinerary();

  const form = useForm<TripFormFields>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      destinations: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(Date.now() + 3 * 24 * 3600 * 1000), "yyyy-MM-dd"),
      travelers: 2,
      budget: "balanced",
      style: "culture",
      interests: ["Food & wine", "Art & design"],
      notes: ""
    }
  });

  const destinationsValue = form.watch("destinations");
  const interestsValue = form.watch("interests");
  const destinationsPreview = useMemo(
    () =>
      destinationsValue.length
        ? destinationsValue
            .split(/\n|,/)
            .map((city) => city.trim())
            .filter(Boolean)
        : [],
    [destinationsValue]
  );

  const toggleInterest = (interest: string) => {
    const existing = form.getValues("interests");
    if (existing.includes(interest)) {
      form.setValue(
        "interests",
        existing.filter((item) => item !== interest)
      );
    } else {
      form.setValue("interests", [...existing, interest]);
    }
  };

  const goNext = () => setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (values: TripFormFields) => {
    const destinationsList = values.destinations
      .split(/\n|,/)
      .map((city) => city.trim())
      .filter(Boolean);

    if (!destinationsList.length) {
      toast.error("Add at least one destination");
      return;
    }

    const geocoded = await geocodeDestinations(destinationsList);
    if (!geocoded.length) {
      toast.error("Mapbox couldn't find those destinations.");
      return;
    }

    const preferences: TripPreferences = {
      destinations: geocoded,
      startDate: values.startDate,
      endDate: values.endDate,
      travelers: values.travelers,
      budget: values.budget as TripBudget,
      style: values.style as TripStyle,
      interests: values.interests,
      notes: values.notes
    };

    setPreferences(preferences);
    await itineraryMutation.mutateAsync(preferences);
  };

  return (
    <Card className="border-slate-800/70 bg-slate-950/60 shadow-2xl shadow-blue-500/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-400">
            Planner
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Tell us about your trip
          </h2>
        </div>
        <div className="flex gap-2">
          {STEPS.map((label, index) => (
            <div key={label} className="text-center">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                  step === index
                    ? "border-brand-400 text-white"
                    : "border-slate-800 text-slate-500"
                }`}
              >
                {index + 1}
              </span>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-8 space-y-6"
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label>Dream destinations</Label>
                <Textarea
                  placeholder="Tokyo, Kyoto&#10;Paris&#10;Bali"
                  {...form.register("destinations")}
                />
                <p className="text-xs text-slate-400">
                  Separate multiple cities with commas or line breaks.
                </p>
                {form.formState.errors.destinations && (
                  <p className="text-sm text-rose-300">
                    {form.formState.errors.destinations.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Arrival</Label>
                  <Input type="date" {...form.register("startDate")} />
                </div>
                <div className="space-y-2">
                  <Label>Departure</Label>
                  <Input type="date" {...form.register("endDate")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Travelers</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  {...form.register("travelers", { valueAsNumber: true })}
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label>Trip vibe</Label>
                <Select {...form.register("style")}>
                  <option value="relax">Slow & restorative</option>
                  <option value="adventure">Adventure & outdoor</option>
                  <option value="culture">Culture & design</option>
                  <option value="romance">Romance</option>
                  <option value="family">Family friendly</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Investment level</Label>
                <Select {...form.register("budget")}>
                  <option value="value">Smart & value</option>
                  <option value="balanced">Balanced</option>
                  <option value="premium">Premium indulgence</option>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Key interests</Label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_PRESETS.map((interest) => {
                    const active = interestsValue.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition ${
                          active
                            ? "border-brand-400 bg-brand-500/20 text-white"
                            : "border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
                {form.formState.errors.interests && (
                  <p className="text-sm text-rose-300">
                    {form.formState.errors.interests.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Anything else we should weave in?</Label>
                <Textarea
                  placeholder="Allergy-friendly dining, remote work days, hidden speakeasies..."
                  {...form.register("notes")}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0}
            onClick={goBack}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={itineraryMutation.isPending}
              className="min-w-[170px]"
            >
              {itineraryMutation.isPending ? "Designing..." : "Design my trip"}
            </Button>
          )}
        </div>

        {destinationsPreview.length > 0 && (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Preview
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {destinationsPreview.map((city) => (
                <Badge key={city}>{city}</Badge>
              ))}
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

