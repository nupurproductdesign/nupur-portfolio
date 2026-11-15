"use client";

import { useEffect, useRef } from "react";

// A looping, silent product clip (case tile thumbnail, case study hero) (used instead of a GIF: same look, ~5x smaller).
// Visitors who ask for reduced motion see the still poster instead.
export default function ThumbVideo({ mp4, webm, poster, className = "thumb" }: { mp4: string; webm?: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current!;
    v.muted = true; // browsers only autoplay muted video; set the property, not just the attribute
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (mq.matches ? v.pause() : v.play().catch(() => {}));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return (
    <video ref={ref} className={className} muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
