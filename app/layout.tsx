import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "iPhone 18 Pro 发布会 · 抽奖 & 以旧换新活动",
  description:
    "观看 Apple Event 2026 发布会视频，提交信息参与 iPhone 18 Pro 抽奖，90% 中奖率，以旧换新额外补贴。",
  keywords: [
    "iPhone 18 Pro",
    "Apple Event 2026",
    "iPhone Duo",
    "抽奖",
    "以旧换新",
    "AirPods 5",
    "Apple Watch Series 12",
  ],
  authors: [{ name: "Event Team" }],
  openGraph: {
    title: "iPhone 18 Pro 发布会 · 抽奖活动",
    description:
      "观看 Apple Event 2026 发布会视频，提交信息参与 iPhone 18 Pro 抽奖，90% 中奖率。",
    type: "website",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
