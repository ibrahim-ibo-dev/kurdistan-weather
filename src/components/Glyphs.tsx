/** Minimal stroke-based UI glyphs (detail-grid icons, chevrons, etc.). */

interface P {
  size?: number;
  className?: string;
  label?: string;
}

function base(p: P, children: React.ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={p.size ?? 20}
      height={p.size ?? 20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={p.className}
      role={p.label ? "img" : "presentation"}
      aria-label={p.label}
      aria-hidden={p.label ? undefined : true}
    >
      {p.label ? <title>{p.label}</title> : null}
      {children}
    </svg>
  );
}

export const DropIcon = (p: P) =>
  base(p, <path d="M12 3.5c3.5 4 6 7.2 6 10.4a6 6 0 1 1-12 0C6 10.7 8.5 7.5 12 3.5Z" />);

export const ThermoIcon = (p: P) =>
  base(p, <path d="M10 13.6V5a2 2 0 1 1 4 0v8.6a4.5 4.5 0 1 1-4 0Z" />);

export const WindIcon = (p: P) =>
  base(p, <path d="M3.5 9h9a3 3 0 1 0-3-3M3.5 13h13a3 3 0 1 1-3 3M3.5 17h6" />);

export const GaugeIcon = (p: P) =>
  base(p, (
    <>
      <path d="M4.5 15a8 8 0 1 1 15 0" />
      <path d="M12 15l4-4.5" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </>
  ));

export const EyeIcon = (p: P) =>
  base(p, (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ));

export const UvIcon = (p: P) =>
  base(p, (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </>
  ));

export const CloudIcon = (p: P) =>
  base(p, <path d="M7 18a4.5 4.5 0 0 1-.4-9A5.5 5.5 0 0 1 17 10a4 4 0 0 1 .5 8H7Z" />);

export const SunriseIcon = (p: P) =>
  base(p, (
    <>
      <path d="M4.5 16.5a7.5 7.5 0 0 1 15 0" />
      <path d="M12 4v3M4.6 8l2 1.6M19.4 8l-2 1.6" />
      <path d="M2.5 16.5h19" />
      <path d="M8 20.5h8" />
    </>
  ));

export const SunsetIcon = (p: P) =>
  base(p, (
    <>
      <path d="M4.5 16.5a7.5 7.5 0 0 1 15 0" />
      <path d="M12 4v3M4.6 8l2 1.6M19.4 8l-2 1.6" />
      <path d="M2.5 16.5h19" />
      <path d="M9.5 21l2.5-2.5L14.5 21" />
    </>
  ));

export const SearchIcon = (p: P) =>
  base(p, (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ));

export const PinIcon = (p: P) =>
  base(p, (
    <>
      <path d="M12 21.5s7-6.4 7-11.5a7 7 0 1 0-14 0c0 5.1 7 11.5 7 11.5Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ));

export const ChevronIcon = (p: P) => base(p, <path d="M8 4.5 15.5 12 8 19.5" />);

export const ArrowIcon = (p: P & { deg?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 16}
    height={p.size ?? 16}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={p.className}
    style={{ transform: `rotate(${p.deg ?? 0}deg)` }}
    role="presentation"
    aria-hidden="true"
  >
    <path d="M12 20V5M6 11l6-6 6 6" />
  </svg>
);

export const RefreshIcon = (p: P) =>
  base(p, <path d="M20 5v5h-5M4 19v-5h5M19.5 10a8 8 0 0 0-14-3.5M4.5 14a8 8 0 0 0 14 3.5" />);
