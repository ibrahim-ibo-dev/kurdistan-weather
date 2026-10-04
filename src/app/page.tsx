import WeatherApp from "@/components/WeatherApp";
import { DEFAULT_LOCATION_ID } from "@/lib/weather/locations";
import { getAllCitySummaries, getLocationWeather } from "@/lib/weather/service";
import type { CitySummary, LocationWeather } from "@/lib/weather/types";

export const revalidate = 600;

export default async function Home() {
  let weather: LocationWeather | null = null;
  let summaries: CitySummary[] = [];

  try {
    [weather, summaries] = await Promise.all([
      getLocationWeather(DEFAULT_LOCATION_ID),
      getAllCitySummaries(),
    ]);
  } catch {
    // Client will fetch through /api routes — page still renders.
  }

  return (
    <WeatherApp
      initialSlug={DEFAULT_LOCATION_ID}
      initialWeather={weather}
      initialSummaries={summaries}
    />
  );
}
