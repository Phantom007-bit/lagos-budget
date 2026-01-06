import type { Metadata } from "next";
import { DM_Sans } from "next/font/google"; // Using DM Sans for a premium app feel
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lagos Budget Directory",
  description: "Find the best spots in Lagos on a budget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}