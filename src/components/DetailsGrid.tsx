"use client";

import type { LocationWeather } from "@/lib/weather/types";
import { kuCompass, kuDigits, kuTemp, kuTime, uvLabel } from "@/lib/weather/utils";
import {
  ArrowIcon,
  CloudIcon,
  DropIcon,
  EyeIcon,
  GaugeIcon,
  SunriseIcon,
  SunsetIcon,
  ThermoIcon,
  UvIcon,
  WindIcon,
} from "./Glyphs";

interface Cell {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

export default function DetailsGrid({ weather }: { weather: LocationWeather }) {
  const { current, daily } = weather;
  const today = daily[0];

  const cells: Cell[] = [
    {
      icon: <ThermoIcon size={20} />,
      label: "هەست پێدەکرێت وەک",
      value: kuTemp(current.feelsLike),
    },
    {
      icon: <DropIcon size={20} />,
      label: "شێ",
      value: `٪${kuDigits(Math.round(current.humidity))}`,
    },
    {
      icon: <WindIcon size={20} />,
      label: "با",
      value: `${kuDigits(Math.round(current.windSpeed))} کم/ک`,
      sub: `${kuCompass(current.windDirection)} — تێزبا ${kuDigits(Math.round(current.windGusts))} کم/ک`,
    },
    {
      icon: (
        <span className="inline-flex" aria-hidden="true">
          <ArrowIcon size={20} deg={current.windDirection + 180} />
        </span>
      ),
      label: "ئاڕاستەی با",
      value: kuCompass(current.windDirection),
      sub: `${kuDigits(Math.round(current.windDirection))}°`,
    },
    {
      icon: <GaugeIcon size={20} />,
      label: "پەستانی هەوا",
      value: `${kuDigits(Math.round(current.pressure))} hPa`,
    },
    {
      icon: <EyeIcon size={20} />,
      label: "مەودای بینین",
      value:
        current.visibility >= 1000
          ? `${kuDigits(Math.round(current.visibility / 100) / 10)} کم`
          : `${kuDigits(Math.round(current.visibility))} م`,
    },
    {
      icon: <UvIcon size={20} />,
      label: "تیشکی UV",
      value: kuDigits(Math.round(current.uvIndex)),
      sub: uvLabel(current.uvIndex),
    },
    {
      icon: <CloudIcon size={20} />,
      label: "داپۆشینی هەور",
      value: `٪${kuDigits(Math.round(current.cloudCover))}`,
    },
    {
      icon: <DropIcon size={20} />,
      label: "ئەگەری باران",
      value: `٪${kuDigits(Math.round(current.precipProb))}`,
      sub: current.precipitation > 0 ? `بڕ: ${kuDigits(current.precipitation)} مم` : undefined,
    },
    {
      icon: <SunriseIcon size={20} />,
      label: "هەڵهاتنی خۆر",
      value: kuTime(today.sunrise),
    },
    {
      icon: <SunsetIcon size={20} />,
      label: "ئاوابوونی خۆر",
      value: kuTime(today.sunset),
    },
  ];

  return (
    <section aria-labelledby="details-heading" className="mt-10">
      <h2 id="details-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
        وردەکاریی ئێستا
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-0 sm:grid-cols-3 lg:grid-cols-4">
        {cells.map((c) => (
          <div
            key={c.label}
            className="border-t border-hairline/15 py-4"
          >
            <dt className="flex items-center gap-2 text-xs text-ink-faint">
              <span className="text-ink-soft">{c.icon}</span>
              {c.label}
            </dt>
            <dd className="mt-1.5 font-display text-xl font-semibold text-ink" dir="ltr">
              {c.value}
            </dd>
            {c.sub && <dd className="mt-0.5 text-xs text-ink-faint">{c.sub}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
