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
  metadataBase: new URL("https://applen.click"),
  icons: {
    icon: "/apple-icon.png",
    apple: "/apple-icon.png",
  },
  title: "iPhone 18 Pro Event · Lucky Draw & Trade-in",
  description:
    "Đổi máy chẳng đắn đo, may mắn thêm mượt mà. Trợ giá đổi máy cực cao kết hợp bốc thăm giới hạn, mang về cuộc sống cao cấp kế tiếp. Máy cũ thành máy mới, may mắn không chỉ 'một' chút! Tham gia đổi cũ lấy mới, cơ hội trúng miễn phí một trong ba mẫu iPhone 18 Pro và Pro Max. Tái tạo kinh điển, may mắn nhân đôi! Dùng iPhone cũ đổi máy mới, đồng thời có cơ hội trúng miễn đơn toàn bộ!",
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
      "Đổi máy chẳng đắn đo, may mắn thêm mượt mà. Trợ giá đổi máy cực cao kết hợp bốc thăm giới hạn, mang về cuộc sống cao cấp kế tiếp. Máy cũ thành máy mới, may mắn không chỉ 'một' chút! Tham gia đổi cũ lấy mới, cơ hội trúng miễn phí iPhone 18 Pro và Pro Max. Tái tạo kinh điển, may mắn nhân đôi!",
    type: "website",
    locale: "vi_VN",
    siteName: "iPhone 18 Pro Event",
    images: [
      {
        url: "/og-image.jpg",
        width: 1230,
        height: 1278,
        alt: "iPhone 18 Pro — Pro further.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone 18 Pro Event · Lucky Draw",
    description:
      "Đổi máy chẳng đắn đo, may mắn thêm mượt mà. Trợ giá đổi máy cực cao kết hợp bốc thăm giới hạn, may mắn nhân đôi! Tham gia đổi cũ lấy mới, cơ hội trúng miễn phí iPhone 18 Pro và Pro Max.",
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
