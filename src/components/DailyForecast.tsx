"use client";

import { useMemo, useState } from "react";
import type { DailyPoint } from "@/lib/weather/types";
import { conditionLabel } from "@/lib/weather/codes";
import { kuCompass, kuDate, kuDigits, kuTemp, kuTime, uvLabel } from "@/lib/weather/utils";
import WeatherIcon from "./WeatherIcon";
import { ChevronIcon, DropIcon, SunriseIcon, SunsetIcon, WindIcon } from "./Glyphs";

function dayLabel(index: number): string {
  if (index === 0) return "ئەمڕۆ";
  if (index === 1) return "سبەینێ";
  return "";
}

/* ---------- minimal SVG temperature chart ---------- */

function TempChart({ day }: { day: DailyPoint }) {
  const { points, min, max } = useMemo(() => {
    const hs = day.hours;
    if (hs.length < 2) return { points: "", min: 0, max: 0 };
    const temps = hs.map((h) => h.temp);
    const lo = Math.min(...temps);
    const hi = Math.max(...temps);
    const span = Math.max(1, hi - lo);
    const W = 560;
    const H = 72;
    const pts = hs
      .map((h, i) => {
        const x = (i / (hs.length - 1)) * W;
        const y = H - 10 - ((h.temp - lo) / span) * (H - 26);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
    return { points: pts, min: lo, max: hi };
  }, [day]);

  if (!points) return null;

  return (
    <div dir="ltr">
      <svg
        viewBox="0 0 560 84"
        className="h-24 w-full"
        role="img"
        aria-label={`هێڵی پلەی گەرما — بەرزترین ${kuTemp(max)} نزمترین ${kuTemp(min)}`}
      >
        <polyline
          points={points}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth={2.4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {day.hours.map((h, i) => {
          if (i % 3 !== 0) return null;
          const x = (i / (day.hours.length - 1)) * 560;
          const temps = day.hours.map((hh) => hh.temp);
          const lo = Math.min(...temps);
          const hi = Math.max(...temps);
          const span = Math.max(1, hi - lo);
          const y = 72 - 10 - ((h.temp - lo) / span) * (72 - 26);
          return (
            <g key={h.time}>
              <circle cx={x} cy={y} r={2.6} fill="rgb(var(--accent))" />
              <text
                x={x}
                y={y - 7}
                textAnchor="middle"
                className="fill-ink-soft"
                fontSize={10}
              >
                {Math.round(h.temp)}°
              </text>
              <text
                x={x}
                y={82}
                textAnchor="middle"
                className="fill-ink-faint"
                fontSize={9}
              >
                {h.time.slice(11, 16)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- expanded day detail ---------- */

function DayDetail({ day }: { day: DailyPoint }) {
  const hs = day.hours;
  const avg = (f: (h: (typeof hs)[number]) => number) =>
    hs.length ? Math.round(hs.reduce((s, h) => s + f(h), 0) / hs.length) : 0;
  const precipProbNow = hs.length ? Math.max(...hs.map((h) => h.precipProb)) : day.precipProbMax;

  const stats: [string, string][] = [
    ["بەرزترین ئەگەری باران", `٪${kuDigits(Math.round(precipProbNow))}`],
    ["بڕی باران", `${kuDigits(Math.round(day.precipSum * 10) / 10)} مم`],
    ["خێرایی با", `${kuDigits(Math.round(day.windSpeedMax))} کم/ک`],
    ["ئاڕاستەی با", kuCompass(day.windDirection)],
    ["تێکڕای شێ", `٪${kuDigits(avg((h) => h.humidity))}`],
    ["تێکڕای هەور", `٪${kuDigits(avg((h) => h.cloudCover))}`],
    ["بەرزترین UV", `${kuDigits(Math.round(day.uvIndexMax))} — ${uvLabel(day.uvIndexMax)}`],
    ["هەڵهاتنی خۆر", kuTime(day.sunrise)],
    ["ئاوابوونی خۆر", kuTime(day.sunset)],
  ];

  return (
    <div className="border-t border-hairline/15 px-4 py-5 sm:px-6">
      {hs.length >= 2 && (
        <div className="mb-5">
          <h4 className="mb-2 text-xs font-semibold text-ink-faint">هێڵی پلەی گەرما</h4>
          <TempChart day={day} />
        </div>
      )}

      {hs.length > 0 && (
        <ol className="scroll-x mb-5 flex gap-1 overflow-x-auto pb-2" aria-label="کاتەکانی ئەو ڕۆژە">
          {hs.filter((_, i) => i % 2 === 0).map((h) => (
            <li
              key={h.time}
              className="flex w-14 shrink-0 flex-col items-center gap-1 rounded-lg py-1.5"
            >
              <span className="text-[0.65rem] text-ink-faint">{kuTime(h.time)}</span>
              <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={22} animated={false} />
              <span className="text-xs font-semibold text-ink">{kuTemp(h.temp)}</span>
              <span className="text-[0.6rem] text-ink-faint">
                ٪{kuDigits(Math.round(h.precipProb))}
              </span>
            </li>
          ))}
        </ol>
      )}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="border-t border-hairline/10 pt-2">
            <dt className="text-[0.7rem] text-ink-faint">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink" dir="ltr">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- the 7-day list ---------- */

export default function DailyForecast({ days }: { days: DailyPoint[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const weekMin = Math.min(...days.map((d) => d.tempMin));
  const weekMax = Math.max(...days.map((d) => d.tempMax));
  const span = Math.max(1, weekMax - weekMin);

  return (
    <section aria-labelledby="daily-heading" className="mt-10">
      <h2 id="daily-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
        پێشبینی ٧ ڕۆژ
      </h2>
      <ol className="mt-4 overflow-hidden rounded-2xl border border-hairline/15 bg-surface/45 backdrop-blur-sm">
        {days.map((d, i) => {
          const { weekday, label } = kuDate(d.date);
          const open = openIdx === i;
          const rangeStart = ((d.tempMin - weekMin) / span) * 100;
          const rangeW = Math.max(6, ((d.tempMax - d.tempMin) / span) * 100);

          return (
            <li key={d.date} className="border-b border-hairline/10 last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                aria-controls={`day-detail-${i}`}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-hairline/5 sm:gap-5 sm:px-6"
              >
                <span className="w-20 shrink-0 sm:w-28">
                  <span className="block text-sm font-semibold text-ink">
                    {dayLabel(i) || weekday}
                  </span>
                  <span className="block text-[0.7rem] text-ink-faint">{label}</span>
                </span>

                <WeatherIcon code={d.weatherCode} isDay size={30} className="shrink-0" />

                <span className="hidden min-w-0 flex-1 truncate text-sm text-ink-soft md:block">
                  {conditionLabel(d.weatherCode)}
                </span>

                <span
                  className={`flex w-14 shrink-0 items-center justify-end gap-1 text-xs ${
                    d.precipProbMax >= 20 ? "font-medium text-accent" : "text-ink-faint"
                  }`}
                >
                  <DropIcon size={11} />
                  ٪{kuDigits(Math.round(d.precipProbMax))}
                </span>

                <span className="flex w-28 shrink-0 items-center gap-2 sm:w-36" dir="ltr">
                  <span className="w-7 text-right text-xs text-ink-faint">
                    {Math.round(d.tempMin)}°
                  </span>
                  <span className="relative h-1.5 flex-1 rounded-full bg-hairline/10">
                    <span
                      className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                      style={{ left: `${rangeStart}%`, width: `${rangeW}%` }}
                    />
                  </span>
                  <span className="w-7 text-left text-xs font-semibold text-ink">
                    {Math.round(d.tempMax)}°
                  </span>
                </span>

                <ChevronIcon
                  size={14}
                  className={`shrink-0 text-ink-faint transition-transform duration-300 ${
                    open ? "-rotate-90" : "rotate-90"
                  }`}
                />
              </button>
              {open && (
                <div id={`day-detail-${i}`}>
                  <DayDetail day={d} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
