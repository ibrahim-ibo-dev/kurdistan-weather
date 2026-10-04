"use client";

import type { HourlyPoint } from "@/lib/weather/types";
import { kuDigits, kuTemp, kuTime } from "@/lib/weather/utils";
import WeatherIcon from "./WeatherIcon";
import { DropIcon } from "./Glyphs";

export default function HourlyStrip({ hours }: { hours: HourlyPoint[] }) {
  return (
    <section aria-labelledby="hourly-heading" className="mt-10">
      <h2 id="hourly-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
        کاتژمێر بە کاتژمێر — ٢٤ کاتژمێری داهاتوو
      </h2>
      <ol
        className="scroll-x mt-4 flex gap-1 overflow-x-auto pb-3"
        aria-label="پێشبینی کاتژمێری"
      >
        {hours.map((h, i) => (
          <li key={h.time} className="shrink-0">
            <div
              className={`flex w-[4.5rem] flex-col items-center gap-1.5 rounded-xl border px-2 py-3 ${
                i === 0
                  ? "border-accent/50 bg-surface/60 shadow-sm"
                  : "border-transparent"
              }`}
            >
              <span className={`text-xs ${i === 0 ? "font-bold text-accent" : "text-ink-faint"}`}>
                {i === 0 ? "ئێستا" : kuTime(h.time)}
              </span>
              <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={30} />
              <span className="font-display text-base font-semibold text-ink">
                {kuTemp(h.temp)}
              </span>
              <span
                className={`flex items-center gap-0.5 text-[0.65rem] ${
                  h.precipProb >= 20 ? "text-accent font-medium" : "text-ink-faint"
                }`}
                aria-label={`ئەگەری باران ٪${kuDigits(h.precipProb)}`}
              >
                <DropIcon size={10} />
                ٪{kuDigits(Math.round(h.precipProb))}
              </span>
              <span
                className="h-1 w-8 overflow-hidden rounded-full bg-hairline/10"
                aria-hidden="true"
              >
                <span
                  className="block h-full rounded-full bg-accent/70"
                  style={{ width: `${Math.min(100, h.precipProb)}%` }}
                />
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
