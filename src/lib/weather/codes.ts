import type { ConditionId, ConditionInfo, SkyPhase } from "./types";

/**
 * Central weather-code mapping system.
 * WMO weather code (Open-Meteo) -> internal condition -> Kurdish label.
 * The visual layer consumes `ConditionId` + day/night, keeping every
 * icon, label, and background consistent across the app.
 */
const CONDITIONS: Record<ConditionId, ConditionInfo> = {
  clear:             { id: "clear",             labelKu: "ئاسمان ڕوون",       labelEn: "Clear sky" },
  partly_cloudy:     { id: "partly_cloudy",     labelKu: "هەوری کەم",         labelEn: "Partly cloudy" },
  cloudy:            { id: "cloudy",            labelKu: "هەور",             labelEn: "Cloudy" },
  overcast:          { id: "overcast",          labelKu: "هەوری تۆخ",        labelEn: "Overcast" },
  fog:               { id: "fog",               labelKu: "تەم",              labelEn: "Fog" },
  mist:              { id: "mist",              labelKu: "تەمی سووک",        labelEn: "Mist" },
  haze:              { id: "haze",              labelKu: "گژ",               labelEn: "Haze" },
  dust:              { id: "dust",              labelKu: "تۆز و خۆڵ",        labelEn: "Dust" },
  wind:              { id: "wind",              labelKu: "بای بەهێز",        labelEn: "Windy" },
  drizzle:           { id: "drizzle",           labelKu: "بەرزەباران",       labelEn: "Drizzle" },
  freezing_drizzle:  { id: "freezing_drizzle",  labelKu: "بەرزەبارانی بەستوو", labelEn: "Freezing drizzle" },
  rain_light:        { id: "rain_light",        labelKu: "بارانی سووک",      labelEn: "Light rain" },
  rain_moderate:     { id: "rain_moderate",     labelKu: "باران",            labelEn: "Rain" },
  rain_heavy:        { id: "rain_heavy",        labelKu: "بارانی بەهێز",     labelEn: "Heavy rain" },
  freezing_rain:     { id: "freezing_rain",     labelKu: "بارانی بەستوو",    labelEn: "Freezing rain" },
  sleet:             { id: "sleet",             labelKu: "بەفر و باران",     labelEn: "Sleet" },
  snow_light:        { id: "snow_light",        labelKu: "بەفری سووک",       labelEn: "Light snow" },
  snow:              { id: "snow",              labelKu: "بەفر",             labelEn: "Snow" },
  snow_heavy:        { id: "snow_heavy",        labelKu: "بەفری بەهێز",      labelEn: "Heavy snow" },
  thunderstorm:      { id: "thunderstorm",      labelKu: "هەورەتریشقە",      labelEn: "Thunderstorm" },
  thunderstorm_hail: { id: "thunderstorm_hail", labelKu: "هەورەتریشقە و تەڕۆگ", labelEn: "Thunderstorm with hail" },
};

/** WMO weather interpretation codes -> internal condition id. */
const WMO_MAP: Record<number, ConditionId> = {
  0: "clear",
  1: "clear",
  2: "partly_cloudy",
  3: "overcast",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "freezing_drizzle",
  57: "freezing_drizzle",
  61: "rain_light",
  63: "rain_moderate",
  65: "rain_heavy",
  66: "freezing_rain",
  67: "freezing_rain",
  71: "snow_light",
  73: "snow",
  75: "snow_heavy",
  77: "snow_light",
  80: "rain_light",
  81: "rain_moderate",
  82: "rain_heavy",
  85: "snow",
  86: "snow_heavy",
  95: "thunderstorm",
  96: "thunderstorm_hail",
  99: "thunderstorm_hail",
};

export function conditionFromCode(wmo: number): ConditionId {
  return WMO_MAP[wmo] ?? "cloudy";
}

export function conditionInfo(wmo: number): ConditionInfo {
  return CONDITIONS[conditionFromCode(wmo)];
}

export function conditionLabel(wmo: number): string {
  return conditionInfo(wmo).labelKu;
}

export function getCondition(id: ConditionId): ConditionInfo {
  return CONDITIONS[id];
}

/**
 * Sky phase for theming: uses the API is_day flag refined by
 * proximity to sunrise/sunset for warm dawn/dusk palettes.
 */
export function skyPhase(
  isDay: boolean,
  nowIso: string,
  sunriseIso: string,
  sunsetIso: string
): SkyPhase {
  const t = minutesOf(nowIso);
  const rise = minutesOf(sunriseIso);
  const set = minutesOf(sunsetIso);
  if (Number.isFinite(t) && Number.isFinite(rise) && Number.isFinite(set)) {
    if (isDay && t <= rise + 40) return "dawn";
    if (isDay && t >= set - 40) return "dusk";
  }
  return isDay ? "day" : "night";
}

function minutesOf(iso: string): number {
  const m = /T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Broad visual category used to pick the atmospheric background. */
export type SkyCategory =
  | "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog" | "dust";

export function skyCategory(wmo: number): SkyCategory {
  const c = conditionFromCode(wmo);
  if (c === "clear" || c === "partly_cloudy" || c === "haze" || c === "wind") return "clear";
  if (c === "dust") return "dust";
  if (c === "fog" || c === "mist") return "fog";
  if (c === "snow_light" || c === "snow" || c === "snow_heavy") return "snow";
  if (c === "thunderstorm" || c === "thunderstorm_hail") return "storm";
  if (
    c === "drizzle" || c === "freezing_drizzle" ||
    c === "rain_light" || c === "rain_moderate" || c === "rain_heavy" ||
    c === "freezing_rain" || c === "sleet"
  ) return "rain";
  return "cloudy";
}
