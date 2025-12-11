import { motion } from "framer-motion";
import { Calendar, Map, Share2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripStore } from "@/store/trip";

export const ItineraryResults = () => {
  const itinerary = useTripStore((state) => state.itinerary);
  const preferences = useTripStore((state) => state.preferences);
  const isGenerating = useTripStore((state) => state.isGenerating);
  const error = useTripStore((state) => state.error);

  if (isGenerating) {
    return (
      <Card className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="space-y-3 text-center">
        <p className="text-lg font-semibold text-rose-300">We hit a snag</p>
        <p className="text-sm text-slate-400">{error}</p>
        <p className="text-sm text-slate-500">
          Adjust your inputs or retry in a moment.
        </p>
      </Card>
    );
  }

  if (!itinerary || !preferences) {
    return (
      <Card className="flex flex-col items-center justify-center space-y-4 text-center text-slate-400">
        <Map className="h-12 w-12 text-slate-600" />
        <p className="text-lg font-semibold text-white">
          Your itinerary will appear here
        </p>
        <p className="text-sm text-slate-400">
          Complete the planner to generate a personalized route with dining
          highlights, daily rhythm, and packing tips.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">
              Tailored route
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-white">
              {preferences.destinations.map((d) => d.label).join(" • ")}
            </h3>
            <p className="mt-2 text-sm text-slate-400">{itinerary.overview}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="default">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            {preferences.startDate} → {preferences.endDate}
          </Badge>
          <Badge variant="outline">{preferences.travelers} travelers</Badge>
          <Badge variant="outline">Vibe: {preferences.style}</Badge>
          <Badge variant="outline">Budget: {preferences.budget}</Badge>
        </div>
      </Card>

      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: day.day * 0.05 }}
          >
            <Card className="border-slate-800/50 bg-slate-950/60">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Day {day.day}
                  </p>
                  <h4 className="mt-1 text-xl font-semibold text-white">
                    {day.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-400">{day.summary}</p>
                </div>
                {day.stay && (
                  <Badge className="self-start md:self-center">
                    Stay: {day.stay}
                  </Badge>
                )}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Highlights
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {day.highlights.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Dining
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {day.dining?.map((item) => (
                      <li key={item}>• {item}</li>
                    )) ?? <li>Chef-curated picks coming soon</li>}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3 border-slate-800/60">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">
            Essentials
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            {itinerary.essentials.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-3 border-slate-800/60">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">
            Packing intel
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            {itinerary.packing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

