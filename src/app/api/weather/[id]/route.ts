import { getLocationWeather } from "@/lib/weather/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await getLocationWeather(id);
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=480",
      },
    });
  } catch {
    return Response.json(
      { error: "weather fetch failed" },
      { status: 502 }
    );
  }
}
