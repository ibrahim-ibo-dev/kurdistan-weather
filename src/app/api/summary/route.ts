import { getAllCitySummaries } from "@/lib/weather/service";

export async function GET() {
  try {
    const data = await getAllCitySummaries();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return Response.json({ error: "summary fetch failed" }, { status: 502 });
  }
}
