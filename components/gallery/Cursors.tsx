"use client";

import { useEffect, useRef, useState } from "react";

// How long the cursor-chat hint stays up, and how often it may come back (Nupur, 2026-11-10: once every 10s).
const HINT_SHOW_MS = 3500;
const HINT_EVERY_MS = 10000;
const HINT_FIRST_MS = 1400; // wait for the camera to finish turning before the first hint
const HINT_TEXT = "Click anywhere on the canvas to go back to the start";

// Multiplayer cursors, like a shared Figma file (Decorative only):
// - "You": a tag that follows the visitor's pointer.
// - "Nupur": parked at the bottom-right corner of the selected frame, like the reference video. It follows that
//   corner every animation frame (so it rides along with camera moves) and fades out when nothing is selected.
// `hint`: while true (About and Fun walls), Nupur's cursor "says" HINT_TEXT in a Figma-style cursor chat bubble
// for a few seconds, at most once every 10 seconds.
export function Cursors({ hint = false }: { hint?: boolean }) {
  const you = useRef<HTMLDivElement>(null);
  const nupur = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState(false);

  // "You" follows the pointer
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

  // "Nupur" sticks to the selected frame's bottom-right corner (its on-screen box, after the 3D projection)
  useEffect(() => {
    const el = nupur.current!;
    let raf = 0;
    let x = NaN, y = NaN; // current position, eased toward the corner so she glides like a real cursor
    const tick = () => {
      const sel = document.querySelector<HTMLElement>(".g-frame.is-sel");
      if (sel) {
        const r = sel.getBoundingClientRect();
        const tx = r.right + 4, ty = r.bottom + 4; // arrow tip just outside the corner handle
        if (Number.isNaN(x)) { x = tx; y = ty; }
        x += (tx - x) * 0.25;
        y += (ty - y) * 0.25;
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.opacity = "1";
        // near the right edge, the tag/bubble opens to the left of the arrow so it stays on screen
        el.toggleAttribute("data-flip", x > innerWidth - 300);
      } else {
        el.style.opacity = "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Nupur's cursor chat: first shortly after arriving on the wall, then every 10s while the visitor stays there
  useEffect(() => {
    if (!hint) return;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      setChat(true);
      hideTimer = setTimeout(() => setChat(false), HINT_SHOW_MS);
    };
    const first = setTimeout(show, HINT_FIRST_MS);
    const every = setInterval(show, HINT_EVERY_MS);
    return () => {
      clearTimeout(first);
      clearInterval(every);
      clearTimeout(hideTimer);
      setChat(false);
    };
  }, [hint]);

  return (
    <div className="g-cursors" aria-hidden="true">
      <div className="g-cur g-cur-you" ref={you}>
        <span>You</span>
      </div>
      <div className={`g-cur g-cur-nupur${chat ? " is-chat" : ""}`} ref={nupur}>
        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 1l11 6-5 1.5L5.5 14z" fill="currentColor" /></svg>
        <span>{chat ? HINT_TEXT : "Nupur"}</span>
      </div>
    </div>
  );
}
