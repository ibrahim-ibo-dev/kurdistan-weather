import { conditionFromCode, getCondition } from "@/lib/weather/codes";
import type { ConditionId } from "@/lib/weather/types";

/**
 * Hand-built animated SVG weather icon system.
 * Every WMO condition maps to an internal ConditionId rendered
 * here — no emoji, no icon-font, fully stylable and accessible.
 */

interface Props {
  code?: number;
  condition?: ConditionId;
  isDay?: boolean;
  size?: number;
  className?: string;
  animated?: boolean;
}

const C = {
  sun: "#FFC94D",
  sunCore: "#FFDF8E",
  moon: "#E9ECF7",
  moonShade: "#C9D0E8",
  cloudL: "#F4F7FB",
  cloudM: "#D9E1EC",
  cloudD: "#B4C2D4",
  cloudNight: "#8E9CB4",
  rain: "#79B8E8",
  rainHeavy: "#4E96D9",
  snow: "#EAF3FF",
  bolt: "#FFD84D",
  fogLine: "#C3CDDA",
  dust: "#D9B98A",
  star: "#F4F0D8",
};

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <g className="wx-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = cx + Math.cos(a) * (r + 3.5);
          const y1 = cy + Math.sin(a) * (r + 3.5);
          const x2 = cx + Math.cos(a) * (r + 7.5);
          const y2 = cy + Math.sin(a) * (r + 7.5);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={C.sun} strokeWidth={2.4} strokeLinecap="round"
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={r} fill={C.sun} />
      <circle cx={cx} cy={cy} r={r * 0.62} fill={C.sunCore} className="wx-glow" />
    </g>
  );
}

function Moon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <path
      d={`M ${cx + r * 0.55} ${cy - r}
          A ${r} ${r} 0 1 0 ${cx + r * 0.55} ${cy + r}
          A ${r * 1.35} ${r * 1.35} 0 0 1 ${cx + r * 0.55} ${cy - r} Z`}
      fill={C.moon}
    />
  );
}

function Stars({ points }: { points: [number, number][] }) {
  return (
    <g fill={C.star}>
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.1} className="wx-twinkle" style={{ animationDelay: `${i * 0.9}s` }} />
      ))}
    </g>
  );
}

function Cloud({
  x = 0, y = 0, s = 1, fill = C.cloudL, shade = C.cloudM, drift = false,
}: {
  x?: number; y?: number; s?: number; fill?: string; shade?: string; drift?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      className={drift ? "wx-drift" : undefined}
    >
      <rect x={17} y={32} width={26} height={10} rx={5} fill={fill} />
      <circle cx={22} cy={33} r={7.5} fill={fill} />
      <circle cx={31.5} cy={27.5} r={9.5} fill={fill} />
      <circle cx={40} cy={33.5} r={7} fill={fill} />
      <circle cx={35.5} cy={36.5} r={7} fill={shade} opacity={0.55} />
    </g>
  );
}

function RainDrops({ n, heavy = false, x = 0 }: { n: number; heavy?: boolean; x?: number }) {
  const xs = [22, 30, 38, 26, 34, 42];
  return (
    <g stroke={heavy ? C.rainHeavy : C.rain} strokeWidth={heavy ? 2.6 : 2.2} strokeLinecap="round">
      {Array.from({ length: n }).map((_, i) => (
        <line
          key={i}
          x1={x + xs[i]} y1={44}
          x2={x + xs[i] - 2.5} y2={heavy ? 55 : 52}
          className="wx-drop"
          style={{ animationDelay: `${i * 0.28}s` }}
        />
      ))}
    </g>
  );
}

function SnowFlakes({ n, x = 0 }: { n: number; x?: number }) {
  const xs = [22, 31, 40, 26, 36];
  return (
    <g stroke={C.snow} strokeWidth={1.8} strokeLinecap="round">
      {Array.from({ length: n }).map((_, i) => {
        const fx = x + xs[i];
        return (
          <g key={i} className="wx-flake" style={{ animationDelay: `${i * 0.55}s` }}>
            <line x1={fx} y1={46} x2={fx} y2={52} />
            <line x1={fx - 2.6} y1={47.5} x2={fx + 2.6} y2={50.5} />
            <line x1={fx + 2.6} y1={47.5} x2={fx - 2.6} y2={50.5} />
          </g>
        );
      })}
    </g>
  );
}

function Bolt() {
  return (
    <path
      d="M35 40 L26.5 54 H32 L29 62 L39.5 47 H33.5 L38.5 40 Z"
      fill={C.bolt}
      className="wx-bolt"
    />
  );
}

function FogLines({ y = 47, n = 3, color = C.fogLine }: { y?: number; n?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={2.6} strokeLinecap="round">
      {Array.from({ length: n }).map((_, i) => (
        <line
          key={i}
          x1={16 + (i % 2) * 4} y1={y + i * 5}
          x2={48 - (i % 2) * 4} y2={y + i * 5}
          className="wx-fog-x"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </g>
  );
}

function WindStrokes() {
  return (
    <g fill="none" stroke={C.fogLine} strokeWidth={2.6} strokeLinecap="round">
      <path d="M14 28 H38 a6 6 0 1 0 -6 -6" className="wx-dash" />
      <path d="M12 36 H44 a6 6 0 1 1 -6 6" className="wx-dash" style={{ animationDelay: "0.4s" }} />
      <path d="M18 44 H34" className="wx-dash" style={{ animationDelay: "0.8s" }} />
    </g>
  );
}

function DustSwirl() {
  return (
    <g fill="none" stroke={C.dust} strokeWidth={2.4} strokeLinecap="round">
      <path d="M14 30 q10 -8 20 0 t18 -2" className="wx-dash" />
      <path d="M12 40 q12 -7 22 0 t16 -3" className="wx-dash" style={{ animationDelay: "0.5s" }} />
      <g fill={C.dust} stroke="none">
        <circle cx={20} cy={50} r={1.6} className="wx-twinkle" />
        <circle cx={32} cy={53} r={1.3} className="wx-twinkle" style={{ animationDelay: "0.6s" }} />
        <circle cx={44} cy={49} r={1.6} className="wx-twinkle" style={{ animationDelay: "1.1s" }} />
      </g>
    </g>
  );
}

function renderGlyph(condition: ConditionId, isDay: boolean) {
  switch (condition) {
    case "clear":
      return isDay ? <Sun cx={32} cy={32} r={11} /> : (
        <>
          <Moon cx={28} cy={28} r={13} />
          <Stars points={[[48, 16], [53, 27], [44, 40]]} />
        </>
      );
    case "partly_cloudy":
      return isDay ? (
        <>
          <Sun cx={23} cy={22} r={7.5} />
          <Cloud x={4} y={9} s={1.05} />
        </>
      ) : (
        <>
          <Moon cx={20} cy={19} r={9} />
          <Cloud x={4} y={9} s={1.05} fill={C.cloudNight} shade={C.cloudD} />
        </>
      );
    case "cloudy":
      return (
        <>
          <Cloud x={-6} y={2} s={0.85} fill={C.cloudM} shade={C.cloudD} drift />
          <Cloud x={4} y={12} s={1.05} />
        </>
      );
    case "overcast":
      return (
        <>
          <Cloud x={-4} y={6} s={0.95} fill={C.cloudD} shade={C.cloudNight} />
          <Cloud x={8} y={14} s={0.95} fill={C.cloudM} shade={C.cloudD} />
        </>
      );
    case "drizzle":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <RainDrops n={3} x={-2} />
        </>
      );
    case "freezing_drizzle":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <RainDrops n={2} x={-4} />
          <SnowFlakes n={1} x={14} />
        </>
      );
    case "rain_light":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <RainDrops n={2} />
        </>
      );
    case "rain_moderate":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <RainDrops n={3} />
        </>
      );
    case "rain_heavy":
      return (
        <>
          <Cloud x={4} y={4} s={1.05} fill={C.cloudM} shade={C.cloudD} />
          <RainDrops n={5} heavy />
        </>
      );
    case "freezing_rain":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <RainDrops n={2} x={-4} />
          <SnowFlakes n={1} x={12} />
        </>
      );
    case "sleet":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <RainDrops n={2} x={-4} />
          <SnowFlakes n={2} x={8} />
        </>
      );
    case "snow_light":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <SnowFlakes n={2} />
        </>
      );
    case "snow":
      return (
        <>
          <Cloud x={4} y={6} s={1} />
          <SnowFlakes n={3} />
        </>
      );
    case "snow_heavy":
      return (
        <>
          <Cloud x={4} y={4} s={1.05} fill={C.cloudM} shade={C.cloudD} />
          <SnowFlakes n={5} />
        </>
      );
    case "thunderstorm":
      return (
        <>
          <Cloud x={4} y={4} s={1.05} fill={C.cloudD} shade={C.cloudNight} />
          <Bolt />
          <RainDrops n={2} x={-4} />
        </>
      );
    case "thunderstorm_hail":
      return (
        <>
          <Cloud x={4} y={4} s={1.05} fill={C.cloudD} shade={C.cloudNight} />
          <Bolt />
          <RainDrops n={2} x={-4} />
          <circle cx={42} cy={52} r={2.2} fill={C.snow} />
          <circle cx={46} cy={46} r={1.8} fill={C.snow} />
        </>
      );
    case "fog":
      return (
        <>
          <Cloud x={4} y={0} s={0.9} fill={C.cloudM} shade={C.cloudD} />
          <FogLines y={44} n={3} />
        </>
      );
    case "mist":
      return (
        <>
          <Cloud x={4} y={4} s={0.9} fill={C.cloudL} shade={C.cloudM} />
          <FogLines y={48} n={2} />
        </>
      );
    case "haze":
      return isDay ? (
        <>
          <Sun cx={32} cy={26} r={9} />
          <FogLines y={44} n={3} />
        </>
      ) : (
        <>
          <Moon cx={28} cy={24} r={11} />
          <FogLines y={44} n={3} />
        </>
      );
    case "dust":
      return <DustSwirl />;
    case "wind":
      return <WindStrokes />;
    default:
      return <Cloud x={4} y={10} s={1.05} />;
  }
}

export default function WeatherIcon({
  code,
  condition,
  isDay = true,
  size = 48,
  className,
  animated = true,
}: Props) {
  const cid: ConditionId =
    condition ?? conditionFromCode(code ?? 2);
  const info = getCondition(cid);

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`${animated ? "wx-anim" : ""} ${className ?? ""}`}
      role="img"
      aria-label={info.labelKu}
    >
      <title>{info.labelKu}</title>
      {renderGlyph(cid, isDay)}
    </svg>
  );
}
