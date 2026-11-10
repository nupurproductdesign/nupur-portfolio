import type { Viewport } from "next";
import Gallery from "@/components/gallery/Gallery";
import "./gallery.css";

// Homepage = the gallery room (light Figma canvas). The old dark site lives at /classic.
// Title and description come from app/layout.tsx.

// light Figma canvas: browser chrome matches --fig-canvas (tokens.css)
export const viewport: Viewport = { themeColor: "#F5F5F5", colorScheme: "light" };

export default function Home() {
  return <Gallery />;
}
