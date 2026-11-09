"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TopNav from "./TopNav";
import LeftRail from "./LeftRail";
import WorkGrid from "./WorkGrid";
import About from "./About";
import Fun from "./Fun";
import Colophon from "./Colophon";
import ChatPanel from "./ChatPanel";

export type Section = "work" | "about" | "fun";

const isMobile = () => matchMedia("(max-width:980px)").matches;

// Owns the shared state: whether Ask-Nupur is open, and which section is in view.
export default function Portfolio() {
  const [asking, setAsking] = useState(false);
  const [current, setCurrent] = useState<Section>("work");
  const chatRef = useRef<HTMLElement>(null);

  const setChat = useCallback((open: boolean) => {
    setAsking(open);
    if (open) {
      setTimeout(() => chatRef.current?.querySelector<HTMLInputElement>("#q")?.focus({ preventScroll: true }), 450);
      if (isMobile()) requestAnimationFrame(() => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, []);

  const scrollTo = useCallback((id: Section) => {
    if (isMobile()) setAsking(false);
    // wait a frame so the pane is visible again on mobile before scrolling
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  // open chat when arriving on /#ask
  useEffect(() => {
    if (location.hash === "#ask") setChat(true);
  }, [setChat]);

  // keyboard: Esc closes, "/" opens
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAsking(false);
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? "")) {
        e.preventDefault();
        setChat(true);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setChat]);

  // scroll spy
  useEffect(() => {
    const spy = () => {
      // on mobile the chat hides the content; keep the last section instead of guessing
      const pane = document.getElementById("pane");
      if (pane && getComputedStyle(pane).display === "none") return;
      let cur: Section = "work";
      for (const id of ["about", "fun"] as const) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.45) cur = id;
      }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = "fun";
      setCurrent(cur);
    };
    addEventListener("scroll", spy, { passive: true });
    spy();
    return () => removeEventListener("scroll", spy);
  }, []);

  return (
    <>
      <TopNav current={current} asking={asking} onToggleChat={() => setChat(!asking)} onNavigate={scrollTo} />
      <div className={`shell${asking ? " asking" : ""}`} id="shell">
        <LeftRail />
        <main className="pane" id="pane">
          <WorkGrid />
          <About />
          <Fun />
          <Colophon />
        </main>
        <ChatPanel
          ref={chatRef}
          open={asking}
          onClose={() => {
            setAsking(false);
            // hand focus back to the nav tab so keyboard users aren't left on a hidden button
            document.querySelector<HTMLButtonElement>(".askpill")?.focus({ preventScroll: true });
          }}
        />
      </div>
    </>
  );
}
