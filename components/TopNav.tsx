"use client";

import { useState } from "react";
import { RESUME_URL } from "@/lib/content";
import type { Section } from "./Portfolio";

type Props = {
  current: Section;
  asking: boolean;
  onToggleChat: () => void;
  onNavigate: (id: Section) => void;
};

const TABS: { id: Section; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "fun", label: "Fun" },
];

export default function TopNav({ current, asking, onToggleChat, onNavigate }: Props) {
  const [resumeLabel, setResumeLabel] = useState("Resume");

  const go = (id: Section) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(id);
  };

  // Until the PDF exists, the tab briefly says "Soon" instead of dead-ending.
  const onResume = (e: React.MouseEvent) => {
    if (RESUME_URL) return;
    e.preventDefault();
    setResumeLabel("Soon");
    setTimeout(() => setResumeLabel("Resume"), 1400);
  };

  return (
    <header className="topnav" id="topnav">
      <a className="brand label" href="#work" onClick={go("work")} aria-label="Nupur Gidhi, back to work">
        Nupur Gidhi
      </a>
      <nav className="tabs label" aria-label="Sections">
        {TABS.map((t) => (
          <a key={t.id} href={`#${t.id}`} onClick={go(t.id)} aria-current={current === t.id ? "true" : "false"}>
            {t.label}
          </a>
        ))}
        <a href={RESUME_URL || "#resume"} target="_blank" rel="noopener" onClick={onResume}>
          {resumeLabel}
          <span className="arr" aria-hidden="true">↗</span>
        </a>
      </nav>
      <button
        className="askpill label"
        type="button"
        aria-expanded={asking}
        aria-controls="chatcol"
        aria-label={asking ? "Close Ask-Nupur chat" : "Open Ask-Nupur chat"}
        onClick={onToggleChat}
      >
        <span className="spark" aria-hidden="true" />
        <span className="t">Ask-Nupur</span>
      </button>
    </header>
  );
}
