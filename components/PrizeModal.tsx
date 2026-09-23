"use client";

import { useEffect, useMemo } from "react";
import { useLanguage } from "./LanguageContext";
import { prizeLabelKey, type PrizeKey } from "@/lib/prize";

type Props = {
  prize: PrizeKey;
  won: boolean;
  onClose: () => void;
};

const CONFETTI_COLORS = [
  "#0a84ff",
  "#bf5af0",
  "#ff9f0a",
  "#ff375f",
  "#30d158",
  "#ffffff",
];

export default function PrizeModal({ prize, won, onClose }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 1.5,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        dx: (Math.random() - 0.5) * 200,
      })),
    []
  );

  const prizeLabel = prize === "none" ? "" : t(prizeLabelKey(prize));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      {won &&
        confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={
              {
                left: `${c.left}%`,
                background: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                "--dx": `${c.dx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      <div className="glass-strong pop-in relative w-full max-w-md rounded-3xl p-8 text-center">
        <div
          className={[
            "mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl",
            won
              ? "bg-gradient-to-br from-[#0a84ff] to-[#bf5af0] shadow-[0_10px_40px_rgba(191,90,240,0.55)]"
              : "bg-white/10",
          ].join(" ")}
        >
          {won ? "🎁" : "✨"}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {won ? t("winTitle") : t("loseTitle")}
        </h2>
        <p className="text-muted mt-2 text-sm">
          {won ? t("winDesc") : t("loseDesc")}
        </p>
        {won && prizeLabel && (
          <div className="rise rise-delay-2 mt-4 inline-block rounded-full bg-white/10 px-5 py-2 text-base font-medium">
            {prizeLabel}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="btn-cta mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
