import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://gidispots.vercel.app'),
  title: "GidiSpots",
  description: "The ultimate guide to affordable date nights and hangouts in Lagos.",
  generator: 'Next.js',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.jpeg?v=2',
    apple: '/icon.jpeg?v=2',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}