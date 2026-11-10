import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";

// The original dark split-screen site, kept here after the gallery became the homepage (Nupur, 2026-11-10).
export const metadata: Metadata = { title: "Nupur Gidhi — Product Designer (classic)" };

export default function Classic() {
  return <Portfolio />;
}
