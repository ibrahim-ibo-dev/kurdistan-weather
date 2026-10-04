import type { SkyPhase } from "@/lib/weather/types";
import type { SkyCategory } from "@/lib/weather/codes";

/**
 * Fixed atmospheric background driven by the live weather condition
 * and the actual day/night/dawn/dusk phase. Pure CSS — cheap to paint.
 */
export default function SkyBackground({
  category,
  phase,
}: {
  category: SkyCategory;
  phase: SkyPhase;
}) {
  const night = phase === "night";
  const showClouds =
    category === "cloudy" || category === "rain" || category === "storm";
  const showRain = category === "rain" || category === "storm";
  const showSnow = category === "snow";
  const showFog = category === "fog";
  const showDust = category === "dust";

  return (
    <div
      aria-hidden="true"
      className={`sky sky-${phase}-${category}`}
    >
      {night && <div className="sky-stars" />}
      {showClouds && (
        <div className="sky-clouds">
          <i /><i /><i />
        </div>
      )}
      {showRain && <div className="sky-rain" />}
      {showSnow && <div className="sky-snow"><i /><i /></div>}
      {showFog && <div className="sky-fog"><i /><i /></div>}
      {showDust && <div className="sky-dust" />}
      {category === "storm" && <div className="sky-flash" />}
    </div>
  );
}
