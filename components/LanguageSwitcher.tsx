"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LANGS, LANG_META, type Lang } from "@/lib/i18n";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 计算按钮位置，下拉菜单用 fixed 定位脱离父容器 stacking context
  const updatePos = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.right });
  };

  useEffect(() => {
    if (!open) return;
    updatePos();
    const onScroll = () => {
      setOpen(false);
    };
    const onResize = () => updatePos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const menu = open && pos ? (
    <div
      ref={menuRef}
      className="fixed z-[9999] max-h-[70vh] min-w-[160px] overflow-y-auto rounded-xl border border-white/20 bg-[#0c0d14]/97 py-1 shadow-2xl backdrop-blur-xl"
      style={{
        top: pos.top,
        left: Math.max(8, pos.left - 160), // 右对齐按钮，不超出视口
        WebkitOverflowScrolling: "touch",
      }}
      role="listbox"
    >
      {LANGS.map((l: Lang) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLang(l);
              setOpen(false);
            }}
            role="option"
            aria-selected={active}
            className={[
              "flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs transition-colors",
              active
                ? "bg-white/15 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <span className="font-mono text-[10px] text-white/50">
              {LANG_META[l].short}
            </span>
            <span className="flex-1 truncate">{LANG_META[l].label}</span>
            {active && (
              <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/85 transition-all hover:text-white"
        aria-label="Select language"
        aria-expanded={open}
      >
        <span>{LANG_META[lang].short}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : menu}
    </>
  );
}
