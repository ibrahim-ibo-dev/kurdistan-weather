import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WeatherApp from "@/components/WeatherApp";
import { LOCATIONS, getLocation } from "@/lib/weather/locations";
import { getAllCitySummaries, getLocationWeather } from "@/lib/weather/service";
import type { CitySummary, LocationWeather } from "@/lib/weather/types";

export const revalidate = 600;

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};
  return {
    title: `کەش و هەوای ${loc.nameKu}`,
    description: `کەش و هەوای ئێستا، پلەی گەرما، با، شێ و پێشبینی ٧ ڕۆژە بۆ ${loc.nameKu} (${loc.nameEn}) لە کوردستان.`,
    openGraph: {
      title: `کەش و هەوای ${loc.nameKu} — ${loc.nameEn}`,
      description: `پێشبینی تەواوی کەش و هەوا بۆ ${loc.nameKu}.`,
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getLocation(slug)) notFound();

  let weather: LocationWeather | null = null;
  let summaries: CitySummary[] = [];

  try {
    [weather, summaries] = await Promise.all([
      getLocationWeather(slug),
      getAllCitySummaries(),
    ]);
  } catch {
    // Client-side fallback handles fetching.
  }

  return (
    <WeatherApp
      initialSlug={slug}
      initialWeather={weather}
      initialSummaries={summaries}
    />
  );
}
