import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
  display: "swap",
});

const display = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "کەش و هەوای کوردستان",
    template: "%s | کەش و هەوای کوردستان",
  },
  description:
    "کەش و هەوای ئێستا و پێشبینی ٧ ڕۆژە بۆ شار و شارۆچکەکانی کوردستان — هەولێر، سلێمانی، دهۆک، زاخۆ و شوێنەکانی تر.",
  keywords: [
    "کەش و هەوا",
    "کوردستان",
    "هەولێر",
    "سلێمانی",
    "دهۆک",
    "kurdistan weather",
    "erbil weather",
  ],
  openGraph: {
    title: "کەش و هەوای کوردستان",
    description:
      "کەش و هەوای ئێستا و پێشبینی ٧ ڕۆژە بۆ هەموو شار و شارۆچکەکانی کوردستان.",
    locale: "ckb_IQ",
    type: "website",
    siteName: "کەش و هەوای کوردستان",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ckb" dir="rtl" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
