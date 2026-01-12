import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";

// 1. Configure the Premium Font
const font = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta"
});

// 2. Metadata for SEO and Mobile Icons
export const metadata: Metadata = {
  title: "GidiSpots",
  description: "The ultimate guide to Lagos spots.",
  manifest: "/manifest.json",
  themeColor: "#059669",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
};

// 3. The Root Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}