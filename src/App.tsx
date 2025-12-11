import { AuthGate } from "@/features/auth/AuthGate";
import { TripPlannerForm } from "@/features/trip-form/TripPlannerForm";
import { PlannerMap } from "@/features/map/PlannerMap";
import { ItineraryResults } from "@/features/results/ItineraryResults";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/session";
import { useTripStore } from "@/store/trip";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";

const BrandHeader = () => {
  const user = useSessionStore((state) => state.user);
  const signOut = useSessionStore((state) => state.signOut);
  const resetTrip = useTripStore((state) => state.reset);

  const handleSignOut = () => {
    resetTrip();
    signOut();
  };

  return (
    <header className="flex flex-col gap-6 border-b border-white/5 pb-6 md:flex-row md:items-center md:justify-between">
      <div className="text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-300">
            Tripzy
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Travel Intelligence Studio
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Bespoke itineraries, generated in seconds with AI + map intelligence.
          </p>
        </motion.div>
      </div>
      {user && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-md"
        >
          <span>{user.fullName ?? user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-white/10">
            Sign out
          </Button>
        </motion.div>
      )}
    </header>
  );
};

function App() {
  const user = useSessionStore((state) => state.user);

  return (
    <div className="relative min-h-screen text-white selection:bg-brand-500/30">
      <AnimatedBackground />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <BrandHeader />
        <main className="mt-8 md:mt-12">
          {!user ? (
            <AuthGate />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)]"
            >
              <div>
                <TripPlannerForm />
              </div>
              <div className="space-y-6">
                <PlannerMap />
                <ItineraryResults />
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;


