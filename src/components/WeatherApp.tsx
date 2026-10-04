"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CitySummary, LocationWeather, SkyPhase } from "@/lib/weather/types";
import { nearestLocation } from "@/lib/weather/locations";
import { skyCategory, skyPhase } from "@/lib/weather/codes";
import { kuRelativeTime } from "@/lib/weather/utils";
import SkyBackground from "./SkyBackground";
import Hero from "./Hero";
import DetailsGrid from "./DetailsGrid";
import HourlyStrip from "./HourlyStrip";
import DailyForecast from "./DailyForecast";
import CitiesGrid from "./CitiesGrid";
import LocationSearch from "./LocationSearch";
import { PinIcon, RefreshIcon } from "./Glyphs";
import {
  CitiesSkeleton,
  DailySkeleton,
  DetailsSkeleton,
  HeroSkeleton,
  HourlySkeleton,
} from "./Skeletons";

const REFRESH_MS = 10 * 60 * 1000;

export default function WeatherApp({
  initialSlug,
  initialWeather,
  initialSummaries,
}: {
  initialSlug: string;
  initialWeather: LocationWeather | null;
  initialSummaries: CitySummary[];
}) {
  const [slug, setSlug] = useState(initialSlug);
  const [weather, setWeather] = useState<LocationWeather | null>(initialWeather);
  const [summaries, setSummaries] = useState<CitySummary[]>(initialSummaries);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    initialWeather ? "ready" : "loading"
  );
  const [isUserLocation, setIsUserLocation] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const slugRef = useRef(slug);
  const manualRef = useRef(false);
  slugRef.current = slug;

  const load = useCallback(async (id: string, scroll = false) => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/weather/${id}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as LocationWeather;
      setWeather(data);
      setSlug(id);
      slugRef.current = id;
      setStatus("ready");
      window.history.replaceState(null, "", `/weather/${id}`);
      if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }, []);

  const selectLocation = useCallback(
    (id: string, fromGeo = false) => {
      if (!fromGeo) {
        manualRef.current = true;
        setIsUserLocation(false);
      }
      if (id === slugRef.current) {
        if (!fromGeo) window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      load(id, !fromGeo);
    },
    [load]
  );

  /* browser geolocation — once, opt-in only */
  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const n = nearestLocation(pos.coords.latitude, pos.coords.longitude);
        setIsUserLocation(true);
        if (n.id !== slugRef.current && !manualRef.current) {
          selectLocation(n.id, true);
        }
      },
      () => {},
      { timeout: 6000, maximumAge: 10 * 60 * 1000 }
    );
  }, [selectLocation]);

  const geoTried = useRef(false);
  useEffect(() => {
    if (geoTried.current) return;
    geoTried.current = true;
    locate();
  }, [locate]);

  /* initial fetch when server-provided data is missing */
  const didInitialFetch = useRef(false);
  useEffect(() => {
    if (didInitialFetch.current) return;
    didInitialFetch.current = true;
    if (!initialWeather) load(initialSlug);
    if (initialSummaries.length === 0) {
      fetch("/api/summary")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => setSummaries(d as CitySummary[]))
        .catch(() => {});
    }
  }, [initialSlug, initialWeather, initialSummaries.length, load]);

  /* clock tick for "updated X ago" + periodic quiet refresh */
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    const refresh = setInterval(() => {
      fetch(`/api/weather/${slugRef.current}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => setWeather(d as LocationWeather))
        .catch(() => {});
    }, REFRESH_MS);
    return () => {
      clearInterval(tick);
      clearInterval(refresh);
    };
  }, []);

  /* theme phase from live data */
  let phase: SkyPhase = "day";
  let category: ReturnType<typeof skyCategory> = "clear";
  if (weather) {
    category = skyCategory(weather.current.weatherCode);
    phase = skyPhase(
      weather.current.isDay,
      weather.current.time,
      weather.daily[0].sunrise,
      weather.daily[0].sunset
    );
  }

  return (
    <div className={`ph-${phase} min-h-screen text-ink`}>
      <SkyBackground category={category} phase={phase} />

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline/15 py-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" width={30} height={30} aria-hidden="true" className="rounded-md">
              <rect width="32" height="32" rx="6" fill="#0A0A0F" />
              <rect x="1" y="1" width="30" height="30" rx="5" fill="none" stroke="#D4A574" strokeOpacity="0.25" strokeWidth="1.5" />
              <g stroke="#D4A574" strokeWidth="1.9" strokeLinecap="round">
                <line x1="10.5" y1="4.6" x2="10.5" y2="2.4" />
                <line x1="14.67" y1="6.33" x2="16.22" y2="4.78" />
                <line x1="6.33" y1="6.33" x2="4.78" y2="4.78" />
                <line x1="4.6" y1="10.5" x2="2.4" y2="10.5" />
                <line x1="6.33" y1="14.67" x2="4.78" y2="16.22" />
              </g>
              <circle cx="10.5" cy="10.5" r="4.2" fill="#D4A574" />
              <g fill="#D4A574">
                <rect x="10.2" y="18.5" width="17.2" height="5.8" rx="2.9" />
                <circle cx="14.2" cy="18.8" r="4" />
                <circle cx="19.6" cy="15.6" r="5.2" />
                <circle cx="24.2" cy="18.8" r="3.6" />
              </g>
            </svg>
            <div>
              <p className="font-display text-lg font-bold leading-tight">
                کەش و هەوای کوردستان
              </p>
              {weather && status === "ready" && (
                <p className="text-[0.7rem] text-ink-faint" aria-live="polite">
                  {kuRelativeTime(weather.fetchedAt, now)}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
            <LocationSearch onSelect={(id) => selectLocation(id)} />
            <button
              type="button"
              onClick={() => {
                manualRef.current = false;
                locate();
              }}
              aria-label="شوێنی من دیاری بکە"
              title="شوێنی من"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline/20 bg-surface/50 text-ink-soft backdrop-blur-sm transition-colors hover:bg-hairline/10 hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <PinIcon size={18} />
            </button>
          </div>
        </header>

        <main>
          {status === "error" && (
            <div
              role="alert"
              className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-hairline/20 bg-surface/50 px-6 py-12 text-center backdrop-blur-sm"
            >
              <p className="text-lg font-semibold">
                نەتوانرا زانیاری کەش و هەوا وەربگیرێت
              </p>
              <p className="text-sm text-ink-faint">
                تکایە پەیوەندی ئینتەرنێت بپشکنە و دووبارە هەوڵبدەرەوە
              </p>
              <button
                type="button"
                onClick={() => load(slugRef.current)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <RefreshIcon size={15} />
                دووبارە هەوڵبدەرەوە
              </button>
            </div>
          )}

          {status === "loading" && (
            <>
              <HeroSkeleton />
              <DetailsSkeleton />
              <HourlySkeleton />
              <DailySkeleton />
            </>
          )}

          {status === "ready" && weather && (
            <>
              <Hero weather={weather} isUserLocation={isUserLocation} />
              <DetailsGrid weather={weather} />
              <HourlyStrip hours={weather.hourly} />
              <DailyForecast days={weather.daily} />
            </>
          )}

          {summaries.length > 0 ? (
            <CitiesGrid
              summaries={summaries}
              selectedId={slug}
              onSelect={(id) => selectLocation(id)}
            />
          ) : (
            <CitiesSkeleton />
          )}
        </main>

        <footer className="mt-14 border-t border-hairline/15 pt-5 text-center text-xs text-ink-faint">
          <p className="flex items-center justify-center gap-2">
            <span
              dir="ltr"
              className="inline-flex items-center rounded-md bg-[#0A0A0F] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[#D4A574] ring-1 ring-[#D4A574]/25"
            >
              IH
            </span>
            <span>دیزاین و پەرەپێدان لەلایەن ئیبراهیم حوسێنەوە</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
