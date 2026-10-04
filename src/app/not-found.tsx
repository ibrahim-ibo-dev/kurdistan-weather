import Link from "next/link";

export default function NotFound() {
  return (
    <div className="ph-night flex min-h-screen items-center justify-center bg-[#0d1d38] text-ink">
      <div className="text-center">
        <p className="font-display text-6xl font-bold">٤٠٤</p>
        <p className="mt-3 text-lg">ئەم لاپەڕەیە نەدۆزرایەوە</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white"
        >
          گەڕانەوە بۆ سەرەکی
        </Link>
      </div>
    </div>
  );
}
