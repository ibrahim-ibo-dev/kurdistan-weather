"use client";

/** Elegant loading placeholders so the page never renders blank. */

export function HeroSkeleton() {
  return (
    <div className="pt-6 sm:pt-10" aria-hidden="true">
      <div className="wx-skeleton h-10 w-40" />
      <div className="mt-6 flex items-center justify-between gap-6">
        <div>
          <div className="wx-skeleton h-24 w-48 sm:h-36 sm:w-64" />
          <div className="wx-skeleton mt-3 h-6 w-32" />
          <div className="wx-skeleton mt-2 h-4 w-56" />
        </div>
        <div className="wx-skeleton h-32 w-32 rounded-full sm:h-40 sm:w-40" />
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="mt-10" aria-hidden="true">
      <div className="wx-skeleton h-4 w-28" />
      <div className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-t border-hairline/15 py-4">
            <div className="wx-skeleton h-3.5 w-20" />
            <div className="wx-skeleton mt-2 h-6 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HourlySkeleton() {
  return (
    <div className="mt-10" aria-hidden="true">
      <div className="wx-skeleton h-4 w-44" />
      <div className="mt-4 flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="wx-skeleton h-28 w-[4.5rem] shrink-0 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function DailySkeleton() {
  return (
    <div className="mt-10" aria-hidden="true">
      <div className="wx-skeleton h-4 w-32" />
      <div className="mt-4 space-y-px overflow-hidden rounded-2xl">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="wx-skeleton h-14 w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}

export function CitiesSkeleton() {
  return (
    <div className="mt-12" aria-hidden="true">
      <div className="wx-skeleton h-4 w-48" />
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="wx-skeleton h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
