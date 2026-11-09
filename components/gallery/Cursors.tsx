"use client";

import { useEffect, useRef } from "react";

// Multiplayer cursors, like a shared Figma file: a "You" tag that follows the visitor's pointer,
// and "Nupur" drifting around the canvas on her own. Decorative only.
export function Cursors() {
  const you = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return; // touch screens: no pointer to follow
    const el = you.current!;
    const move = (e: PointerEvent) => {
      el.style.opacity = "1";
      el.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 18}px)`;
    };
    const hide = () => (el.style.opacity = "0");
    addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    return () => {
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
    };
  }, []);

  return (
    <div className="g-cursors" aria-hidden="true">
      <div className="g-cur g-cur-you" ref={you}>
        <span>You</span>
      </div>
      <div className="g-cur g-cur-nupur">
        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 1l11 6-5 1.5L5.5 14z" fill="currentColor" /></svg>
        <span>Nupur</span>
      </div>
    </div>
  );
}
