"use client";

import { useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";
import Wheel from "./Wheel";
import PrizeModal from "./PrizeModal";
import { registerSchema } from "@/lib/validations";
import { WHEEL_SECTORS, type PrizeKey } from "@/lib/prize";

type RegisterOk = {
  ok: true;
  registrationId: number;
  drawsLeft: number;
};
type RegisterErr = { ok: false; code: string; field?: string };
type DrawOk = { ok: true; prize: PrizeKey; won: boolean; drawsLeft: number };
type DrawErr = { ok: false; code: string };

const PERKS = [
  { icon: "🎟️", titleKey: "perk1Title", descKey: "perk1Desc" },
  { icon: "🎯", titleKey: "perk2Title", descKey: "perk2Desc" },
  { icon: "♻️", titleKey: "perk3Title", descKey: "perk3Desc" },
] as const;

const SPIN_DURATION_MS = 10000;
const SECTOR_COUNT = WHEEL_SECTORS.length; // 8
const SECTOR_DEG = 360 / SECTOR_COUNT; // 45

/**
 * 计算目标扇区中心需要对准顶部指针时，转盘应旋转到的绝对角度。
 * 指针在 0°（顶部），扇区 i 中心 = i*SECTOR_DEG + SECTOR_DEG/2。
 * 转盘顺时针旋转 R 度后，扇区 i 中心角度 = (i*SECTOR_DEG + SECTOR_DEG/2 + R) mod 360。
 * 要使其为 0，R ≡ -(i*SECTOR_DEG + SECTOR_DEG/2) (mod 360)，即 targetAngle = 360 - center。
 */
function targetAngleFor(prize: PrizeKey): number {
  const idx = WHEEL_SECTORS.findIndex((p) => p === prize);
  const sectorIdx = idx === -1 ? 0 : idx;
  const center = sectorIdx * SECTOR_DEG + SECTOR_DEG / 2;
  return (360 - center) % 360;
}

/**
 * 基于当前旋转角度，计算下一次的绝对旋转角度，保证：
 * 1. 新角度 > 当前角度（正向旋转）
 * 2. 新角度 mod 360 === targetAngle（精准停在目标扇区）
 * 3. 至少多转 5 圈，视觉效果更好
 */
function nextRotation(currentDeg: number, prize: PrizeKey): number {
  const targetAngle = targetAngleFor(prize);
  const currentMod = ((currentDeg % 360) + 360) % 360;
  const delta = ((targetAngle - currentMod) + 360) % 360;
  // 至少转 5 圈 + 到达目标角度
  return currentDeg + 360 * 5 + delta;
}

export default function PrizeForm() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipcode: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // 注册成功后进入抽奖模式
  const [registered, setRegistered] = useState(false);
  const [drawsLeft, setDrawsLeft] = useState(10);

  // 轮盘状态
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{
    prize: PrizeKey;
    won: boolean;
  } | null>(null);

  const lastRotationRef = useRef(0);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "agree"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
      if (serverError) setServerError("");
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      zipcode: form.zipcode,
      language: lang,
      agree: form.agree,
    };
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      const msgMap: Record<string, { key: string; err: string }> = {
        name_required: { key: "name", err: "errName" },
        name_too_long: { key: "name", err: "errName" },
        email_invalid: { key: "email", err: "errEmail" },
        phone_invalid: { key: "phone", err: "errPhone" },
        address_required: { key: "address", err: "errAddress" },
        address_too_long: { key: "address", err: "errAddress" },
        zipcode_invalid: { key: "zipcode", err: "errZipcode" },
        agree_required: { key: "agree", err: "errAgree" },
      };
      for (const issue of parsed.error.issues) {
        const m = msgMap[issue.message];
        if (m && !next[m.key]) next[m.key] = t(m.err);
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as RegisterOk | RegisterErr;
      if (data.ok) {
        setDrawsLeft(data.drawsLeft);
        setRegistered(true);
      } else {
        const code = data.code;
        if (code === "duplicate") {
          setServerError(t("errDuplicate"));
        } else if (code === "server" || code === "invalid") {
          setServerError(t("errServer"));
        } else if (
          code === "name" ||
          code === "email" ||
          code === "phone" ||
          code === "address" ||
          code === "zipcode" ||
          code === "agree"
        ) {
          setErrors({
            [code]: t(
              code === "name"
                ? "errName"
                : code === "email"
                  ? "errEmail"
                  : code === "phone"
                    ? "errPhone"
                    : code === "address"
                      ? "errAddress"
                      : code === "zipcode"
                        ? "errZipcode"
                        : "errAgree"
            ),
          });
        } else {
          setServerError(t("errServer"));
        }
      }
    } catch {
      setServerError(t("errServer"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSpin = async () => {
    if (spinning || drawsLeft <= 0) return;
    setSpinning(true);
    setServerError("");

    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = (await res.json()) as DrawOk | DrawErr;
      if (data.ok) {
        const newRotation = nextRotation(lastRotationRef.current, data.prize);
        lastRotationRef.current = newRotation;
        setRotation(newRotation);
        setDrawsLeft(data.drawsLeft);

        // 8 秒后显示结果
        setTimeout(() => {
          setResult({ prize: data.prize, won: data.won });
          setSpinning(false);
        }, SPIN_DURATION_MS);
      } else {
        const code = data.code;
        if (code === "no_draws") {
          setServerError(t("errNoDraws"));
        } else {
          setServerError(t("errServer"));
        }
        setSpinning(false);
      }
    } catch {
      setServerError(t("errServer"));
      setSpinning(false);
    }
  };

  const inputCls = (field: string) =>
    [
      "input-glass w-full rounded-xl px-4 py-3 text-sm",
      errors[field]
        ? "!border-[#ff375f] !shadow-[0_0_0_4px_rgba(255,55,95,0.18)]"
        : "",
    ].join(" ");

  return (
    <section id="join" className="relative z-10 px-5 py-20">
      <div className="mx-auto max-w-5xl">
        {/* perks */}
        <div className="grid gap-4 sm:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.titleKey} className="glass rounded-2xl p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
                {p.icon}
              </div>
              <h3 className="text-sm font-semibold">{t(p.titleKey)}</h3>
              <p className="text-muted mt-1 text-xs leading-relaxed">
                {t(p.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* 主卡片 */}
        <div className="glass-strong mt-8 rounded-3xl p-6 sm:p-8">
          {!registered ? (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {t("formTitle")}
                </h2>
                <p className="text-muted mt-2 text-sm">{t("formSubtitle")}</p>
              </div>

              <form
                onSubmit={onSubmit}
                className="grid gap-4 sm:grid-cols-2"
                noValidate
              >
                <div>
                  <label className="text-muted mb-1 block text-xs font-medium">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder={t("namePlaceholder")}
                    className={inputCls("name")}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-[#ff375f]">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-muted mb-1 block text-xs font-medium">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder={t("emailPlaceholder")}
                    className={inputCls("email")}
                    autoComplete="email"
                    inputMode="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#ff375f]">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-muted mb-1 block text-xs font-medium">
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder={t("phonePlaceholder")}
                    className={inputCls("phone")}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#ff375f]">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-muted mb-1 block text-xs font-medium">
                    {t("zipcode")}
                  </label>
                  <input
                    type="text"
                    value={form.zipcode}
                    onChange={update("zipcode")}
                    placeholder={t("zipcodePlaceholder")}
                    className={inputCls("zipcode")}
                    autoComplete="postal-code"
                    inputMode="numeric"
                  />
                  {errors.zipcode && (
                    <p className="mt-1 text-xs text-[#ff375f]">
                      {errors.zipcode}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-muted mb-1 block text-xs font-medium">
                    {t("address")}
                  </label>
                  <textarea
                    value={form.address}
                    onChange={update("address")}
                    placeholder={t("addressPlaceholder")}
                    rows={3}
                    className={`${inputCls("address")} resize-none`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-[#ff375f]">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={update("agree")}
                      className="mt-0.5 h-4 w-4 cursor-pointer accent-[#0a84ff]"
                    />
                    <span>{t("agree")}</span>
                  </label>
                  {errors.agree && (
                    <p className="mt-1 text-xs text-[#ff375f]">{errors.agree}</p>
                  )}
                </div>

                {serverError && (
                  <div className="sm:col-span-2 rounded-xl border border-[#ff375f]/40 bg-[#ff375f]/10 px-4 py-3 text-xs text-[#ff8aa3]">
                    {serverError}
                  </div>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-cta w-full rounded-full px-6 py-3.5 text-sm font-semibold"
                  >
                    {submitting ? t("submitting") : t("submit")}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("wheelTitle")}
              </h2>
              <p className="text-muted mt-2 text-sm">{t("wheelDesc")}</p>

              <div className="mt-6">
                <Wheel rotation={rotation} disabled={spinning} />
              </div>

              <div className="mt-6">
                <div className="text-muted text-xs">{t("drawsLeft")}</div>
                <div className="mt-1 text-4xl font-bold gradient-text">
                  {drawsLeft}
                </div>
              </div>

              {serverError && (
                <div className="mt-4 rounded-xl border border-[#ff375f]/40 bg-[#ff375f]/10 px-4 py-3 text-xs text-[#ff8aa3]">
                  {serverError}
                </div>
              )}

              <button
                type="button"
                onClick={handleSpin}
                disabled={spinning || drawsLeft <= 0}
                className="btn-cta mt-6 w-full max-w-xs rounded-full px-8 py-3.5 text-sm font-semibold"
              >
                {spinning
                  ? t("drawing")
                  : drawsLeft <= 0
                    ? t("errNoDraws")
                    : t("drawBtn")}
              </button>
            </div>
          )}
        </div>
      </div>

      {result && (
        <PrizeModal
          prize={result.prize}
          won={result.won}
          onClose={() => setResult(null)}
        />
      )}
    </section>
  );
}
