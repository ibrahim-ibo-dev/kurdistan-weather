"use client";

import type { CitySummary } from "@/lib/weather/types";
import { conditionLabel } from "@/lib/weather/codes";
import { kuDigits, kuTemp } from "@/lib/weather/utils";
import WeatherIcon from "./WeatherIcon";
import { DropIcon } from "./Glyphs";

export default function CitiesGrid({
  summaries,
  selectedId,
  onSelect,
}: {
  summaries: CitySummary[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-labelledby="cities-heading" className="mt-12">
      <h2 id="cities-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
        شار و شارۆچکەکانی کوردستان
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {summaries.map((s) => {
          const active = s.location.id === selectedId;
          return (
            <li key={s.location.id}>
              <button
                type="button"
                onClick={() => onSelect(s.location.id)}
                aria-current={active ? "true" : undefined}
                className={`flex w-full flex-col gap-1.5 rounded-xl border p-3.5 text-start transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  active
                    ? "border-accent/60 bg-surface/70 shadow-sm"
                    : "border-hairline/15 bg-surface/35"
                }`}
              >
                <span className="flex w-full items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink">
                      {s.location.nameKu}
                    </span>
                    <span className="block truncate text-[0.65rem] text-ink-faint" dir="ltr">
                      {s.location.nameEn}
                    </span>
                  </span>
                  <WeatherIcon code={s.weatherCode} isDay={s.isDay} size={30} />
                </span>
                <span className="font-display text-2xl font-bold text-ink">
                  {kuTemp(s.temp)}
                </span>
                <span className="truncate text-[0.7rem] text-ink-soft">
                  {conditionLabel(s.weatherCode)}
                </span>
                <span className="flex items-center justify-between text-[0.7rem] text-ink-faint">
                  <span dir="ltr">
                    {Math.round(s.tempMin)}° / {Math.round(s.tempMax)}°
                  </span>
                  {s.precipProbMax >= 20 && (
                    <span className="inline-flex items-center gap-0.5 text-accent">
                      <DropIcon size={10} />
                      ٪{kuDigits(Math.round(s.precipProbMax))}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
