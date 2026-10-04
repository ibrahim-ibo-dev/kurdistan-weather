import type { KLocation } from "./types";

/**
 * Supported locations across the Kurdistan Region and nearby
 * Kurdish-populated areas. Coordinates are fixed geographic
 * points — city name search is never sent to the API.
 *
 * Note: "بەرزان" and "بارزان" are the same village (Barzan);
 * it appears once here with both spellings searchable.
 */
export const LOCATIONS: KLocation[] = [
  { id: "erbil",        nameKu: "هەولێر",    nameEn: "Erbil",        lat: 36.1911, lon: 44.0092 },
  { id: "sulaymaniyah", nameKu: "سلێمانی",   nameEn: "Sulaymaniyah", lat: 35.5610, lon: 45.4309 },
  { id: "duhok",        nameKu: "دهۆک",      nameEn: "Duhok",        lat: 36.8671, lon: 42.9885 },
  { id: "zakho",        nameKu: "زاخۆ",      nameEn: "Zakho",        lat: 37.1432, lon: 42.6819 },
  { id: "shaqlawa",     nameKu: "شەقڵاوە",   nameEn: "Shaqlawa",     lat: 36.4042, lon: 44.3321 },
  { id: "rawanduz",     nameKu: "ڕەواندز",   nameEn: "Rawanduz",     lat: 36.6120, lon: 44.5236 },
  { id: "koya",         nameKu: "کۆیە",      nameEn: "Koya",         lat: 36.0827, lon: 44.6277 },
  { id: "choman",       nameKu: "چۆمان",     nameEn: "Choman",       lat: 36.6359, lon: 44.8889 },
  { id: "soran",        nameKu: "سۆران",     nameEn: "Soran",        lat: 36.6528, lon: 44.5414 },
  { id: "akre",         nameKu: "ئاکرێ",     nameEn: "Akre",         lat: 36.7414, lon: 43.8933 },
  { id: "ranya",        nameKu: "ڕانیە",     nameEn: "Ranya",        lat: 36.2558, lon: 44.8822 },
  { id: "penjwen",      nameKu: "پێنجوێن",   nameEn: "Penjwen",      lat: 35.6236, lon: 46.0214 },
  { id: "qaladize",     nameKu: "قەڵادزێ",   nameEn: "Qaladize",     lat: 36.1816, lon: 45.0079 },
  { id: "kalar",        nameKu: "کەڵار",     nameEn: "Kalar",        lat: 34.6292, lon: 45.3205 },
  { id: "kifri",        nameKu: "کفری",      nameEn: "Kifri",        lat: 34.6896, lon: 44.9606 },
  { id: "khanaqin",     nameKu: "خانەقین",   nameEn: "Khanaqin",     lat: 34.3485, lon: 45.3814 },
  { id: "halabja",      nameKu: "هەڵەبجە",   nameEn: "Halabja",      lat: 35.1778, lon: 45.9861 },
  { id: "dukan",        nameKu: "دوکان",     nameEn: "Dukan",        lat: 35.9543, lon: 44.9573 },
  { id: "chamchamal",   nameKu: "چەمچەماڵ",  nameEn: "Chamchamal",   lat: 35.5336, lon: 44.8344 },
  { id: "barzan",       nameKu: "بەرزان",    nameEn: "Barzan",       lat: 36.9028, lon: 44.2592 },
  { id: "mergasor",     nameKu: "مێرگەسۆر",  nameEn: "Mergasor",     lat: 36.6932, lon: 44.3228 },
  { id: "sidakan",      nameKu: "سیدەکان",   nameEn: "Sidakan",      lat: 36.7560, lon: 44.8470 },
  { id: "amedi",        nameKu: "ئامێدی",    nameEn: "Amedi",        lat: 37.0924, lon: 43.4869 },
  { id: "semel",        nameKu: "سێمێل",     nameEn: "Semel",        lat: 36.8581, lon: 43.3757 },
  { id: "bardarash",    nameKu: "بەردەرەش",  nameEn: "Bardarash",    lat: 36.4910, lon: 43.5789 },
];

/** Alternate spellings / aliases that resolve to a canonical id. */
const ALIASES: Record<string, string> = {
  "بارزان": "barzan",
  "hewler": "erbil",
  "slemany": "sulaymaniyah",
  "slemani": "sulaymaniyah",
  "amediye": "amedi",
  "akre": "akre",
  "aqre": "akre",
  "semel": "semel",
  "simele": "semel",
  "dukan": "dukan",
  "kaladze": "qaladize",
  "qaladza": "qaladize",
};

export const DEFAULT_LOCATION_ID = "erbil";

export function getLocation(id: string): KLocation | undefined {
  return LOCATIONS.find((l) => l.id === id);
}

/** Search locations by Kurdish or English name (substring, case-insensitive). */
export function searchLocations(query: string): KLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) return LOCATIONS;
  return LOCATIONS.filter((l) => {
    if (l.nameKu.includes(query.trim())) return true;
    if (l.nameEn.toLowerCase().includes(q)) return true;
    const aliasHit = Object.entries(ALIASES).some(
      ([alias, id]) => id === l.id && (alias.includes(q) || q.includes(alias))
    );
    return aliasHit;
  });
}

/** Haversine distance in kilometres between two coordinates. */
export function distanceKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number
): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Nearest supported location to the given coordinates. */
export function nearestLocation(lat: number, lon: number): KLocation {
  let best = LOCATIONS[0];
  let bestDist = Infinity;
  for (const loc of LOCATIONS) {
    const d = distanceKm(lat, lon, loc.lat, loc.lon);
    if (d < bestDist) {
      bestDist = d;
      best = loc;
    }
  }
  return best;
}
