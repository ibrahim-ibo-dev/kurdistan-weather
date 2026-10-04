import type { MetadataRoute } from "next";
import { LOCATIONS } from "@/lib/weather/locations";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: base, changeFrequency: "hourly", priority: 1 },
    ...LOCATIONS.map((l) => ({
      url: `${base}/weather/${l.id}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
