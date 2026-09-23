"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DICTS, LANGS, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "apple18-event-lang";

// 根据浏览器语言偏好匹配最接近的 Lang
function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "zh";
  const navLangs = navigator.languages ?? [navigator.language];
  for (const bl of navLangs) {
    const lower = bl.toLowerCase();
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("vi")) return "vi";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("ru")) return "ru";
    if (lower.startsWith("id") || lower.startsWith("in")) return "id";
    if (lower.startsWith("hi")) return "hi";
    if (lower.startsWith("fil") || lower.startsWith("tl")) return "fil";
    if (lower.startsWith("uk")) return "uk";
    if (lower.startsWith("hy")) return "hy";
    if (lower.startsWith("kk")) return "kk";
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && LANGS.includes(saved)) {
        setLangState(saved);
      } else {
        // 无本地缓存时跟随浏览器语言
        const detected = detectBrowserLang();
        setLangState(detected);
      }
    } catch {
      const detected = detectBrowserLang();
      setLangState(detected);
    }
    document.documentElement.lang =
      lang === "vi" ? "vi" : lang === "en" ? "en" : lang === "ru" ? "ru" : lang === "id" ? "id" : "zh";
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => DICTS[lang]?.[key] ?? DICTS.en[key] ?? key,
    }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
