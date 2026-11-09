import type { Metadata, Viewport } from "next";
import { Funnel_Display, Geist } from "next/font/google";
import "./tokens.css";
import "./globals.css";

// Two fonts only: Funnel Display for headlines, Geist for everything else.
const display = Funnel_Display({ subsets: ["latin"], variable: "--font-funnel", display: "swap" }); // variable, 300–800
const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: "Nupur Gidhi — Product Designer",
  description:
    "Product designer who vibe-codes. Designing B2B tools used by 100+ brands at LehLah, now shipping the frontend, not just the mockups.",
};

// themeColor must be a literal (browser meta tag); keep it equal to --bg in tokens.css
export const viewport: Viewport = { themeColor: "#222222", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="butter" className={`${display.variable} ${geist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
