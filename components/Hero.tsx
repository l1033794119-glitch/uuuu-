"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageContext";

const VIDEO_EMBED =
  "https://www.youtube.com/embed/39BalPDuTo0?cc_load_policy=0&hl=en&modestbranding=1&rel=0";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative z-10 flex min-h-screen flex-col">
      {/* Top promo strip — sticky header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2.5 text-xs">
          <p className="truncate text-white/70">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff375f]" />
            {t("promoStrip")}
          </p>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Floating glow orb */}
      <div className="hero-orb" aria-hidden="true" />

      {/* Main content — title + video */}
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-14 text-center">
        <p className="rise text-muted text-xs font-medium uppercase tracking-[0.25em]">
          {t("kicker")}
        </p>
        <h1 className="rise rise-delay-1 gradient-text mt-4 text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          {t("title")}
        </h1>
        <p className="rise rise-delay-2 text-muted mt-5 max-w-2xl text-sm leading-relaxed sm:text-base">
          {t("subtitle")}
        </p>

        <div className="rise rise-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#video"
            className="btn-cta rounded-full px-7 py-3 text-sm font-semibold"
          >
            {t("watch")}
          </a>
        </div>

        {/* Video — in header */}
        <div
          id="video"
          className="video-frame rise rise-delay-4 mt-12 w-full max-w-3xl"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-[27px]">
            <iframe
              src={VIDEO_EMBED}
              title="Apple Event September 9 2026"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>

        <a
          href="#join"
          className="scroll-hint mt-10 flex flex-col items-center gap-1 text-white/40"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            {t("scroll")}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
