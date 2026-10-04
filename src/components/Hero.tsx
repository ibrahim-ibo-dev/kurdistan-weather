"use client";

import type { LocationWeather } from "@/lib/weather/types";
import { conditionLabel } from "@/lib/weather/codes";
import { kuDigits, kuTemp } from "@/lib/weather/utils";
import WeatherIcon from "./WeatherIcon";
import { PinIcon, SunriseIcon, SunsetIcon } from "./Glyphs";
import { kuTime } from "@/lib/weather/utils";

export default function Hero({
  weather,
  isUserLocation,
}: {
  weather: LocationWeather;
  isUserLocation: boolean;
}) {
  const { location, current, daily } = weather;
  const today = daily[0];

  return (
    <section aria-labelledby="hero-location" className="pt-6 pb-2 sm:pt-10">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {isUserLocation && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline/20 bg-surface/40 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur-sm">
            <PinIcon size={13} />
            شوێنی تۆ
          </span>
        )}
        <h1 id="hero-location" className="font-display text-4xl font-bold text-ink sm:text-5xl">
          {location.nameKu}
        </h1>
        <span className="text-lg text-ink-faint" dir="ltr">{location.nameEn}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-6 sm:mt-6">
        <div>
          <div className="flex items-start">
            <span
              className="font-display text-[6.5rem] font-extrabold leading-none tracking-tight text-ink sm:text-[9rem]"
              aria-label={`${kuDigits(Math.round(current.temp))} پلەی سێرزی`}
            >
              {kuDigits(Math.round(current.temp))}
            </span>
            <span className="mt-4 text-4xl font-light text-ink-soft sm:mt-7 sm:text-5xl">°</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-ink sm:text-2xl">
            {conditionLabel(current.weatherCode)}
          </p>
          <p className="mt-2 text-sm text-ink-soft sm:text-base">
            هەست پێدەکرێت وەک {kuTemp(current.feelsLike)}
            <span className="mx-2 text-ink-faint">•</span>
            بەرزترین {kuTemp(today.tempMax)}
            <span className="mx-1 text-ink-faint">/</span>
            نزمترین {kuTemp(today.tempMin)}
          </p>
          <p className="mt-2 flex items-center gap-4 text-xs text-ink-faint sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <SunriseIcon size={15} /> هەڵهاتنی خۆر {kuTime(today.sunrise)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <SunsetIcon size={15} /> ئاوابوونی خۆر {kuTime(today.sunset)}
            </span>
          </p>
        </div>

        <div className="shrink-0 ps-2" aria-hidden="false">
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            size={168}
            className="h-32 w-32 sm:h-44 sm:w-44 drop-shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
