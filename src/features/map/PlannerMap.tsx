import { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { useTripStore } from "@/store/trip";

export const PlannerMap = () => {
  const preferences = useTripStore((state) => state.preferences);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    try {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        worldCopyJump: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(mapRef.current);
    } catch (err) {
      setError((err as Error).message);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!preferences?.destinations.length) return;

    const bounds = L.latLngBounds([]);

    preferences.destinations.forEach((destination) => {
      const marker = L.marker([destination.coordinates[1], destination.coordinates[0]], {
        title: destination.label
      })
        .addTo(mapRef.current!)
        .bindPopup(
          `<strong>${destination.label}</strong><br/>${destination.country ?? ""}`
        );

      markersRef.current.push(marker);
      bounds.extend([destination.coordinates[1], destination.coordinates[0]]);
    });

    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [preferences]);

  return (
    <Card className="h-[360px] overflow-hidden border-slate-800/60 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Visual route
          </p>
          <h3 className="text-xl font-semibold text-white">
            Where you&apos;re headed
          </h3>
        </div>
        <div className="text-right text-sm text-slate-400">
          {preferences?.destinations.length ?? 0} pins
        </div>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-rose-300">{error}</p>
      ) : (
        <motion.div
          ref={mapContainerRef}
          className="mt-4 h-[280px] overflow-hidden rounded-2xl border border-slate-800/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {!preferences?.destinations.length && !error && (
        <p className="mt-3 text-sm text-slate-400">
          Add destinations to see them on the map.
        </p>
      )}
    </Card>
  );
};

