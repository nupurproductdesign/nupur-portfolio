import type { Metadata, Viewport } from "next";
import Gallery from "@/components/gallery/Gallery";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Nupur Gidhi — Gallery",
  description: "Nupur Gidhi's portfolio as a gallery room: Work on the left wall, About ahead, Fun on the right.",
};

// light Figma canvas: browser chrome matches --fig-canvas (tokens.css)
export const viewport: Viewport = { themeColor: "#F5F5F5", colorScheme: "light" };

export default function GalleryPage() {
  return <Gallery />;
}
