"use client";

import { useEffect, useRef, useState } from "react";

// How long the cursor-chat hint stays up, and how often it may come back (Nupur, 2026-11-10: once every 10s).
const HINT_SHOW_MS = 3500;
const HINT_EVERY_MS = 10000;
const HINT_FIRST_MS = 1400; // wait for the camera to finish turning before the first hint
const HINT_TEXT = "Click anywhere on the canvas to go back to the start";

// Multiplayer cursors, like a shared Figma file: a "You" tag that follows the visitor's pointer,
// and "Nupur" drifting around the canvas on her own. Decorative only.
// `hint`: while true (About and Fun walls), the "You" tag turns into a Figma-style cursor chat bubble
// with HINT_TEXT for a few seconds, at most once every 10 seconds.
export function Cursors({ hint = false }: { hint?: boolean }) {
  const you = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return; // touch screens: no pointer to follow
    const el = you.current!;
    const move = (e: PointerEvent) => {
      el.style.opacity = "1";
      el.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 18}px)`;
      // near the right edge, open the bubble to the left of the pointer so it stays on screen
      el.toggleAttribute("data-flip", e.clientX > innerWidth - 300);
    };
    const hide = () => (el.style.opacity = "0");
    addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    return () => {
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
    };
  }, []);

  // cursor chat: first shortly after arriving on the wall, then every 10s while the visitor stays there
  useEffect(() => {
    if (!hint || !matchMedia("(hover: hover)").matches) return;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      if (you.current?.style.opacity !== "1") return; // pointer not on the page: nothing to attach it to
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
      <div className={`g-cur g-cur-you${chat ? " is-chat" : ""}`} ref={you}>
        <span>{chat ? HINT_TEXT : "You"}</span>
      </div>
      <div className="g-cur g-cur-nupur">
        <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 1l11 6-5 1.5L5.5 14z" fill="currentColor" /></svg>
        <span>Nupur</span>
      </div>
    </div>
  );
}
