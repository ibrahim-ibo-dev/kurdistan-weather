/** Kurdish / Sorani display formatting helpers. */

const KU_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Convert Latin digits in a string/number to Eastern Arabic digits. */
export function kuDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => KU_DIGITS[Number(d)]);
}

export const DAY_NAMES_KU = [
  "یەکشەممە",
  "دووشەممە",
  "سێشەممە",
  "چوارشەممە",
  "پێنجشەممە",
  "هەینی",
  "شەممە",
];

export const MONTH_NAMES_KU = [
  "کانوونی دووەم",
  "شوبات",
  "ئازار",
  "نیسان",
  "ئایار",
  "حوزەیران",
  "تەممووز",
  "ئاب",
  "ئەیلوول",
  "تشرینی یەکەم",
  "تشرینی دووەم",
  "کانوونی یەکەم",
];

/** "2026-10-03" -> { weekday: "شەممە", label: "٣ی تشرینی یەکەم" } */
export function kuDate(isoDate: string): { weekday: string; label: string } {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12);
  return {
    weekday: DAY_NAMES_KU[dt.getDay()],
    label: `${kuDigits(d)}ی ${MONTH_NAMES_KU[m - 1]}`,
  };
}

/** "2026-10-03T14:00" -> "١٤:٠٠" */
export function kuTime(iso: string): string {
  const m = /T(\d{2}):(\d{2})/.exec(iso);
  return m ? kuDigits(`${m[1]}:${m[2]}`) : "";
}

/** "2026-10-03T14:00" -> 14 */
export function hourOf(iso: string): number {
  const m = /T(\d{2}):/.exec(iso);
  return m ? Number(m[1]) : 0;
}

export function kuTemp(t: number): string {
  return `${kuDigits(Math.round(t))}°`;
}

const COMPASS_KU = [
  "باکوور",
  "باکووری ڕۆژهەڵات",
  "ڕۆژهەڵات",
  "باشووری ڕۆژهەڵات",
  "باشوور",
  "باشووری ڕۆژئاوا",
  "ڕۆژئاوا",
  "باکووری ڕۆژئاوا",
];

export function kuCompass(deg: number): string {
  return COMPASS_KU[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/** "نوێکراوەتەوە ٥ خولەک لەمەوبەر" */
export function kuRelativeTime(fetchedAt: number, now = Date.now()): string {
  const diffMin = Math.max(0, Math.round((now - fetchedAt) / 60000));
  if (diffMin < 1) return "نوێکراوەتەوە ئێستا";
  if (diffMin === 1) return "نوێکراوەتەوە ١ خولەک لەمەوبەر";
  if (diffMin === 2) return "نوێکراوەتەوە ٢ خولەک لەمەوبەر";
  if (diffMin < 60) return `نوێکراوەتەوە ${kuDigits(diffMin)} خولەک لەمەوبەر`;
  const hours = Math.round(diffMin / 60);
  if (hours === 1) return "نوێکراوەتەوە ١ کاتژمێر لەمەوبەر";
  if (hours === 2) return "نوێکراوەتەوە ٢ کاتژمێر لەمەوبەر";
  return `نوێکراوەتەوە ${kuDigits(hours)} کاتژمێر لەمەوبەر`;
}

export function uvLabel(uv: number): string {
  if (uv < 3) return "کەم";
  if (uv < 6) return "مامناوەند";
  if (uv < 8) return "زۆر";
  if (uv < 11) return "زۆر بەرز";
  return "مەترسیدار";
}
