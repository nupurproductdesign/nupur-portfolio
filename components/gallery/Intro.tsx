"use client";

import { useEffect, useState } from "react";
import { GALLERY_HEADLINE } from "@/lib/content";

// Opening shot: one selected Figma frame on an empty canvas. The headline types itself in,
// the "Vibe Codes" post-it slaps on, then the canvas fades and the camera pulls back into the room.
// Any click or key skips ahead.
export default function Intro({ onLeave, onGone }: { onLeave: () => void; onGone: () => void }) {
  const { lead, note } = GALLERY_HEADLINE;
  const [n, setN] = useState(0); // characters typed so far
  const [leaving, setLeaving] = useState(false);
  const typed = n >= lead.length;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(lead.length);
    const t = setInterval(() => setN((k) => (k >= lead.length ? k : k + 1)), 45);
    return () => clearInterval(t);
  }, [lead]);

  // once the post-it has landed, hold for a beat, then leave
  useEffect(() => {
    if (!typed || leaving) return;
    const t = setTimeout(() => setLeaving(true), 1900);
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
        <h1 className="g-head" aria-label={`${lead} ${note}`}>
          <span aria-hidden="true">
            {lead.slice(0, n)}
            {!typed && <span className="g-caret" />}
            {typed && <> <span className="hl">{note}</span></>}
          </span>
        </h1>
        <i className="g-hdl tl" /><i className="g-hdl tr" /><i className="g-hdl bl" /><i className="g-hdl br" />
        <span className="g-size">Hug × Hug</span>
      </div>
      <span className="g-skip label">Click anywhere to enter</span>
    </div>
  );
}
