"use client";

import { useMemo } from "react";
import { WHEEL_SECTORS, type PrizeKey } from "@/lib/prize";
import { useLanguage } from "./LanguageContext";

type Props = {
  rotation: number; // 当前旋转角度（deg）
  disabled?: boolean;
};

// 扇区主色（与奖品对应）
const SECTOR_COLORS: Record<PrizeKey, string> = {
  iphone: "#0a84ff",
  "50off": "#ff9f0a",
  "90off": "#30d158",
  subsidy: "#bf5af0",
  none: "#1f1f2a",
};

const SECTOR_LABEL_KEY: Record<PrizeKey, string> = {
  iphone: "sectorIphone",
  "50off": "sector50off",
  "90off": "sector90off",
  subsidy: "sectorSubsidy",
  none: "sectorNone",
};

const SIZE = 320; // SVG 视口尺寸
const R = 150; // 转盘半径
const CENTER = SIZE / 2;
const SECTOR_DEG = 360 / WHEEL_SECTORS.length;

// 生成扇区 path（饼图切片）
function sectorPath(startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d - 90) * (Math.PI / 180); // -90 让 0° 在顶部
  const x1 = CENTER + R * Math.cos(toRad(startDeg));
  const y1 = CENTER + R * Math.sin(toRad(startDeg));
  const x2 = CENTER + R * Math.cos(toRad(endDeg));
  const y2 = CENTER + R * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
}

export default function Wheel({ rotation, disabled }: Props) {
  const { t } = useLanguage();

  const sectors = useMemo(() => {
    return WHEEL_SECTORS.map((prize, i) => {
      const start = i * SECTOR_DEG;
      const end = (i + 1) * SECTOR_DEG;
      const mid = start + SECTOR_DEG / 2;
      const color = SECTOR_COLORS[prize];
      const label = t(SECTOR_LABEL_KEY[prize]);
      return { start, end, mid, color, label, prize };
    });
  }, [t]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      {/* 外发光环 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          padding: 3,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.12))",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06) inset",
        }}
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 h-full w-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 10s cubic-bezier(0.17, 0.67, 0.24, 1)",
        }}
      >
        {/* 扇区 */}
        {sectors.map((s, i) => (
          <path
            key={i}
            d={sectorPath(s.start, s.end)}
            fill={s.color}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={1}
          />
        ))}

        {/* 扇区文字：沿扇区中心线方向旋转，单行居中放置在扇区中部 */}
        {sectors.map((s, i) => {
          const mid = s.mid; // 扇区中心角度（0=顶部，顺时针）
          // 文字放在半径 62% 处，沿径向方向旋转
          const textR = R * 0.62;
          const dirRad = (mid * Math.PI) / 180;
          const cx = CENTER + textR * Math.sin(dirRad);
          const cy = CENTER - textR * Math.cos(dirRad);
          // 下半部分（90°~270°）文字翻转 180° 保持正立可读
          const flip = mid > 90 && mid < 270;
          const rotate = flip ? mid + 180 : mid;
          // 根据文字长度动态调整字号
          const len = Array.from(s.label).length;
          const fontSize =
            s.prize === "iphone" ? 13 : len > 4 ? 11 : len > 3 ? 12 : 13;
          return (
            <text
              key={`t-${i}`}
              x={cx}
              y={cy}
              fill="#fff"
              fontSize={fontSize}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotate} ${cx} ${cy})`}
              style={{
                paintOrder: "stroke",
                stroke: "rgba(0,0,0,0.55)",
                strokeWidth: 3,
                strokeLinejoin: "round",
              }}
            >
              {s.label}
            </text>
          );
        })}
      </svg>

      {/* 顶部指针 */}
      <div className="pointer-events-none absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
        <div
          className="h-0 w-0"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "26px solid #ff375f",
            filter: "drop-shadow(0 3px 6px rgba(255,55,95,0.6))",
          }}
        />
      </div>

      {/* 中心按钮 */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-center text-xs font-bold text-black"
          style={{
            boxShadow:
              "0 0 0 4px rgba(255,255,255,0.15), 0 10px 30px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        >
          {disabled ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          ) : (
            "GO"
          )}
        </div>
      </div>
    </div>
  );
}
