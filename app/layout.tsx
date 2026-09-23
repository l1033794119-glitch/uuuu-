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
  metadataBase: new URL("http://156.238.231.6:3000"),
  icons: {
    icon: "/apple-icon.png",
    apple: "/apple-icon.png",
  },
  title: "iPhone 18 Pro Event · Lucky Draw & Trade-in",
  description:
    "Watch the Apple Event 2026 video, submit your info to join the iPhone 18 Pro lucky draw. 90% win rate, plus trade-in bonus.",
  keywords: [
    "iPhone 18 Pro",
    "Apple Event 2026",
    "iPhone Duo",
    "lucky draw",
    "trade-in",
    "AirPods 5",
    "Apple Watch Series 12",
  ],
  authors: [{ name: "Event Team" }],
  openGraph: {
    title: "iPhone 18 Pro Event · Lucky Draw",
    description:
      "Watch the Apple Event 2026 video, submit your info to join the iPhone 18 Pro lucky draw. 90% win rate.",
    type: "website",
    locale: "en_US",
    siteName: "iPhone 18 Pro Event",
    images: [
      {
        url: "/og-image.jpg",
        width: 2560,
        height: 1440,
        alt: "iPhone 18 Pro — Pro further.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone 18 Pro Event · Lucky Draw",
    description:
      "Watch the Apple Event 2026 video, submit your info to join the iPhone 18 Pro lucky draw. 90% win rate.",
    images: ["/og-image.jpg"],
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
