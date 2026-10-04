"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LOCATIONS, searchLocations } from "@/lib/weather/locations";
import type { KLocation } from "@/lib/weather/types";
import { SearchIcon } from "./Glyphs";

export default function LocationSearch({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const results: KLocation[] = searchLocations(query);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const choose = (loc: KLocation) => {
    onSelect(loc.id);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open ? `${listId}-${active}` : undefined}
          aria-label="گەڕان بۆ شار"
          value={query}
          placeholder="گەڕان بۆ شار... (هەولێر / Erbil)"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && open && results[active]) {
              e.preventDefault();
              choose(results[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="w-full rounded-full border border-hairline/20 bg-surface/50 py-2.5 pe-4 ps-10 text-sm text-ink placeholder:text-ink-faint backdrop-blur-sm outline-none transition-shadow focus:border-accent/50 focus:ring-2 focus:ring-accent/25"
        />
        <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
          <SearchIcon size={16} />
        </span>
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="شارەکان"
          className="absolute z-40 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-hairline/20 bg-surface/95 p-1.5 shadow-xl backdrop-blur-md scroll-x"
        >
          {results.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-ink-faint">هیچ شارێک نەدۆزرایەوە</li>
          )}
          {results.map((loc, i) => (
            <li key={loc.id}>
              <button
                id={`${listId}-${i}`}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(loc)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  i === active ? "bg-accent/15 text-ink" : "text-ink-soft"
                }`}
              >
                <span className="font-semibold">{loc.nameKu}</span>
                <span className="text-xs text-ink-faint" dir="ltr">{loc.nameEn}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
