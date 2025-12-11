import type { Destination } from "@/types/trip";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export async function geocodeDestinations(
  locations: string[]
): Promise<Destination[]> {
  const resolved: Destination[] = [];

  for (const location of locations) {
    const trimmed = location.trim();
    if (!trimmed) continue;

    const url = `${NOMINATIM}?q=${encodeURIComponent(trimmed)}&format=json&limit=1&addressdetails=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Tripzy-Travel-Planner/1.0 (demo)" }
    });

    if (!res.ok) continue;
    const data = (await res.json()) as Array<Record<string, any>>;
    const hit = data[0];
    if (!hit) continue;

    resolved.push({
      id: hit.place_id?.toString() ?? trimmed,
      label: hit.display_name ?? trimmed,
      coordinates: [parseFloat(hit.lon), parseFloat(hit.lat)],
      country:
        hit.address?.country ??
        (hit.address?.country_code
          ? hit.address.country_code.toUpperCase()
          : undefined)
    });

    // Respect Nominatim rate limit (1 req/sec)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return resolved;
}


