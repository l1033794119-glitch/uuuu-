"use client";

import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new RegExp(/© 2026/).test(t("copyright")) ? "2026" : "2026";
  return (
    <footer className="relative z-10 border-t border-white/5 px-5 py-10 text-center">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 text-left sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold">{t("rulesTitle")}</h3>
            <ul className="text-muted mt-2 space-y-1.5 text-xs leading-relaxed">
              <li>{t("rule1")}</li>
              <li>{t("rule2")}</li>
              <li>{t("rule3")}</li>
              <li>{t("rule4")}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t("privacy")}</h3>
            <ul className="text-muted mt-2 space-y-1.5 text-xs leading-relaxed">
              <li>{t("privacy1")}</li>
              <li>{t("privacy2")}</li>
              <li>{t("privacy3")}</li>
              <li>{t("privacy4")}</li>
              <li>{t("privacy5")}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t("contact")}</h3>
            <p className="text-muted mt-2 text-xs leading-relaxed">
              applemate@gmail.com
            </p>
          </div>
        </div>

        <div className="hairline my-6" />

        <p className="text-dim text-[11px] leading-relaxed">
          {year} · {t("copyright")} · Not affiliated with Apple Inc.
        </p>
      </div>
    </footer>
  );
}
