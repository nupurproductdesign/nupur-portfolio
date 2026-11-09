import type { Metadata } from "next";
import Gallery from "@/components/gallery/Gallery";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Nupur Gidhi — Gallery",
  description: "Nupur Gidhi's portfolio as a gallery room: Work on the left wall, About ahead, Fun on the right.",
};

export default function GalleryPage() {
  return <Gallery />;
}
