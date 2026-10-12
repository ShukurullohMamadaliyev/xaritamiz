import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xaritamiz — Bugun qayerga boramiz? Aqlli shahar va hordiq marshrutlari",
  description: "Xaritamiz — dam olish, ovqatlanish va shahar bo'ylab eng sara marshrutlarni bir zumda tuzib beruvchi aqlli yo'lboshchi.",
  keywords: ["Xaritamiz", "Toshkent", "dam olish", "marshrut", "qahvaxona", "restoran", "sayr", "Telegram WebApp", "Near Me"],
  openGraph: {
    title: "Xaritamiz — Toshkent shahar dam olish marshrutlari",
    description: "Xaritamiz — dam olish, ovqatlanish va shahar bo'ylab eng sara marshrutlarni bir zumda tuzib beruvchi aqlli yo'lboshchi.",
    type: "website",
    images: ["/logo-full.jpg"]
  },
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Xaritamiz",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full antialiased bg-[#F9FAFB] text-[#111827]">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <link rel="icon" href="/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Xaritamiz" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F9FAFB] text-[#111827] selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
