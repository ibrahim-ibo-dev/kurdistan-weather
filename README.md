# کەش و هەوای کوردستان — Kurdistan Weather

A Kurdish (Sorani, RTL) weather web app for cities and towns across Kurdistan.
Live conditions, hourly and 7-day forecasts, with an atmospheric background
that adapts to the actual weather and time of day.

## Features

- Live weather for Kurdistan cities (Erbil, Sulaymaniyah, Duhok, Zakho, and more)
- Current conditions, hourly strip, and 7-day forecast
- Dynamic sky background driven by real weather + day/dawn/dusk/night phase
- Hand-built animated SVG weather icon system (no emoji, no icon fonts)
- Location search and browser geolocation (opt-in)
- Fully RTL Kurdish UI, Kurdish-Indic digits

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- Tailwind CSS
- [Open-Meteo](https://open-meteo.com) API — no API key required

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Optionally set the site URL for metadata:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New → Project** and import the repo.
3. Vercel detects Next.js automatically — no extra config needed.
4. (Optional) Add `NEXT_PUBLIC_SITE_URL` in the project's environment variables.

## Credits

- Weather data: [Open-Meteo](https://open-meteo.com) (CC BY 4.0)
- Design & development: Ibrahim Hussein (IH)

## License

MIT — see [LICENSE](LICENSE).
