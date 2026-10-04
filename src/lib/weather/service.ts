import { LOCATIONS, getLocation } from "./locations";
import type {
  CitySummary,
  DailyPoint,
  HourlyPoint,
  KLocation,
  LocationWeather,
} from "./types";

/**
 * All weather API communication lives in this module.
 * Provider: Open-Meteo (free, no API key required).
 * Swap this file to change providers — the UI never sees raw API shapes.
 */

const API_BASE = "https://api.open-meteo.com/v1/forecast";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const FETCH_TIMEOUT_MS = 9000;
const REVALIDATE_SECONDS = 600;

/* ---------- raw Open-Meteo response shapes ---------- */

interface OmCurrent {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

interface OmHourly {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  is_day: number[];
  precipitation_probability: number[];
  precipitation: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
  cloud_cover: number[];
  uv_index: number[];
  visibility: number[];
}

interface OmDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

interface OmResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OmCurrent;
  hourly: OmHourly;
  daily: OmDaily;
}

interface OmSummaryResponse {
  current: Pick<OmCurrent, "temperature_2m" | "weather_code" | "is_day">;
  daily: Pick<
    OmDaily,
    "temperature_2m_max" | "temperature_2m_min" | "precipitation_probability_max"
  >;
}

/* ---------- fetch with timeout + single retry ---------- */

async function fetchJson<T>(url: string, attempt = 0): Promise<T> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Weather API ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (attempt < 1) return fetchJson<T>(url, attempt + 1);
    throw err;
  }
}

/* ---------- small in-memory cache (dev mode + double safety) ---------- */

const memCache = new Map<string, { at: number; data: unknown }>();

function cached<T>(key: string, data: T): T {
  memCache.set(key, { at: Date.now(), data });
  return data;
}

function fromCache<T>(key: string): T | undefined {
  const hit = memCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data as T;
  return undefined;
}

/* ---------- mapping ---------- */

function mapHourly(h: OmHourly): HourlyPoint[] {
  return h.time.map((t, i) => ({
    time: t,
    temp: h.temperature_2m[i],
    weatherCode: h.weather_code[i],
    isDay: h.is_day[i] === 1,
    precipProb: h.precipitation_probability[i] ?? 0,
    precip: h.precipitation[i] ?? 0,
    windSpeed: h.wind_speed_10m[i],
    humidity: h.relative_humidity_2m[i],
    cloudCover: h.cloud_cover[i],
    uvIndex: h.uv_index[i] ?? 0,
    visibility: h.visibility[i] ?? 0,
  }));
}

function mapResponse(loc: KLocation, om: OmResponse): LocationWeather {
  const hours = mapHourly(om.hourly);
  const nowIso = om.current.time;
  const nowIdx = Math.max(
    0,
    hours.findIndex((h) => h.time >= nowIso)
  );

  const daily: DailyPoint[] = om.daily.time.map((date, i) => ({
    date,
    weatherCode: om.daily.weather_code[i],
    tempMax: om.daily.temperature_2m_max[i],
    tempMin: om.daily.temperature_2m_min[i],
    sunrise: om.daily.sunrise[i],
    sunset: om.daily.sunset[i],
    precipSum: om.daily.precipitation_sum[i] ?? 0,
    precipProbMax: om.daily.precipitation_probability_max[i] ?? 0,
    uvIndexMax: om.daily.uv_index_max[i] ?? 0,
    windSpeedMax: om.daily.wind_speed_10m_max[i],
    windDirection: om.daily.wind_direction_10m_dominant[i],
    hours: hours.filter((h) => h.time.startsWith(date)),
  }));

  const cur = hours[nowIdx];

  return {
    location: loc,
    timezone: om.timezone,
    current: {
      time: om.current.time,
      temp: om.current.temperature_2m,
      feelsLike: om.current.apparent_temperature,
      humidity: om.current.relative_humidity_2m,
      weatherCode: om.current.weather_code,
      isDay: om.current.is_day === 1,
      cloudCover: om.current.cloud_cover,
      precipitation: om.current.precipitation,
      pressure: om.current.pressure_msl,
      windSpeed: om.current.wind_speed_10m,
      windDirection: om.current.wind_direction_10m,
      windGusts: om.current.wind_gusts_10m,
      uvIndex: cur?.uvIndex ?? 0,
      visibility: cur?.visibility ?? 0,
      precipProb: cur?.precipProb ?? 0,
    },
    hourly: hours.slice(nowIdx, nowIdx + 25),
    daily,
    fetchedAt: Date.now(),
  };
}

/* ---------- public API ---------- */

export async function getLocationWeather(id: string): Promise<LocationWeather> {
  const loc = getLocation(id);
  if (!loc) throw new Error(`Unknown location: ${id}`);

  const key = `weather:${id}`;
  const hit = fromCache<LocationWeather>(key);
  if (hit) return hit;

  const params = new URLSearchParams({
    latitude: String(loc.lat),
    longitude: String(loc.lon),
    timezone: "auto",
    forecast_days: "7",
    wind_speed_unit: "kmh",
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "weather_code",
      "is_day",
      "precipitation_probability",
      "precipitation",
      "wind_speed_10m",
      "relative_humidity_2m",
      "cloud_cover",
      "uv_index",
      "visibility",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "precipitation_probability_max",
      "uv_index_max",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
    ].join(","),
  });

  const om = await fetchJson<OmResponse>(`${API_BASE}?${params}`);
  return cached(key, mapResponse(loc, om));
}

/**
 * One batched request for every supported city.
 * Open-Meteo accepts comma-separated coordinate lists and returns an array.
 */
export async function getAllCitySummaries(): Promise<CitySummary[]> {
  const key = "summaries:all";
  const hit = fromCache<CitySummary[]>(key);
  if (hit) return hit;

  const params = new URLSearchParams({
    latitude: LOCATIONS.map((l) => l.lat).join(","),
    longitude: LOCATIONS.map((l) => l.lon).join(","),
    timezone: "auto",
    forecast_days: "1",
    current: ["temperature_2m", "weather_code", "is_day"].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ].join(","),
  });

  const list = await fetchJson<OmSummaryResponse[] | OmSummaryResponse>(
    `${API_BASE}?${params}`
  );
  const arr = Array.isArray(list) ? list : [list];

  return cached(
    key,
    arr.map((om, i) => ({
      location: LOCATIONS[i],
      temp: om.current.temperature_2m,
      tempMax: om.daily.temperature_2m_max[0],
      tempMin: om.daily.temperature_2m_min[0],
      weatherCode: om.current.weather_code,
      isDay: om.current.is_day === 1,
      precipProbMax: om.daily.precipitation_probability_max[0] ?? 0,
    }))
  );
}
