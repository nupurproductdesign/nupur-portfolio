"use client";

import { useEffect, useState } from "react";
import { GALLERY_HEADLINE } from "@/lib/content";

// Opening shot: one selected Figma text frame on an empty canvas. The headline types itself in,
// then the canvas fades and the camera pulls back into the room.
// Any click or key skips ahead.
export default function Intro({ onLeave, onGone }: { onLeave: () => void; onGone: () => void }) {
  const text = `${GALLERY_HEADLINE.lead} ${GALLERY_HEADLINE.note}`;
  const [n, setN] = useState(0); // characters typed so far
  const [leaving, setLeaving] = useState(false);
  const typed = n >= text.length;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(text.length);
    const t = setInterval(() => setN((k) => (k >= text.length ? k : k + 1)), 45);
    return () => clearInterval(t);
  }, [text]);

  // once the line is typed, hold for a beat, then leave
  useEffect(() => {
    if (!typed || leaving) return;
    const t = setTimeout(() => setLeaving(true), 1400);
    return () => clearTimeout(t);
  }, [typed, leaving]);

  // skip on any click or key
  useEffect(() => {
    const skip = () => setLeaving(true);
    addEventListener("pointerdown", skip);
    addEventListener("keydown", skip);
    return () => {
      removeEventListener("pointerdown", skip);
      removeEventListener("keydown", skip);
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    onLeave();
    const t = setTimeout(onGone, 700);
    return () => clearTimeout(t);
  }, [leaving, onLeave, onGone]);

  return (
    <div className={`g-intro${leaving ? " is-leaving" : ""}`}>
      <div className="g-frame is-sel g-intro-frame">
        <span className="g-name">Intro</span>
        <h1 className="g-head" aria-label={text}>
          <span aria-hidden="true">
            {text.slice(0, n)}
            <span className="g-caret" />
          </span>
        </h1>
        <i className="g-hdl tl" /><i className="g-hdl tr" /><i className="g-hdl bl" /><i className="g-hdl br" />
        <span className="g-size">Hug × Hug</span>
      </div>
      <span className="g-skip">Click anywhere to enter</span>
    </div>
  );
}
