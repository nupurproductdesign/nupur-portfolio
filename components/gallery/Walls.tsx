"use client";

import { useEffect, useRef, type ReactNode, type Ref } from "react";
import CaseTile from "../CaseTile";
import { Crane, SPINES, paint } from "../Desk";
import { ABOUT, CASES, EMAIL, EXPERIENCE, FUN, LINKS, RESUME_URL } from "@/lib/content";
import type { Wall } from "./Gallery";

type WallProps = {
  ref: Ref<HTMLDivElement>;
  active: boolean; // the visitor is facing this wall
  focus: number | null; // index of the frame they stepped up to
  onOpen: () => void; // clicked the wall from somewhere else in the room
  onFocusFrame: (i: number) => void;
};

// A wall is drawn like a Figma section: a name tag top-left, frames inside.
// Frames on walls you're not facing are `inert`, so a click lands on the wall and turns you to face it.
function WallShell({ wall, title, ref, active, onOpen, children }: WallProps & { wall: Wall; title: string; children: ReactNode }) {
  return (
    <div
      ref={ref}
      className={`g-wall g-wall-${wall}${active ? " is-active" : ""}`}
      onClick={active ? undefined : onOpen}
      role="region"
      aria-label={`${title} wall`}
    >
      <span className="g-section label">{title}</span>
      <div className="g-row" inert={!active}>
        {children}
      </div>
    </div>
  );
}

// A Figma frame: name above, thin outline on hover; when selected, butter outline, corner handles and a size tag.
// The first click steps up to the frame; once you're there, clicks go through to what's inside (links).
function Frame({ i, name, focus, onFocusFrame, children, className = "" }: {
  i: number; name: string; focus: number | null; onFocusFrame: (i: number) => void; children: ReactNode; className?: string;
}) {
  const selected = focus === i;
  const wasSelected = useRef(false);
  return (
    <div
      data-frame
      tabIndex={0}
      role="group"
      aria-label={name}
      className={`g-frame${selected ? " is-sel" : ""} ${className}`}
      onPointerDown={() => (wasSelected.current = selected)}
      onClickCapture={(e) => {
        if (wasSelected.current) return;
        e.preventDefault();
        e.stopPropagation();
        onFocusFrame(i);
      }}
      // keyboard users: tabbing onto a frame steps up to it
      onFocus={(e) => e.target === e.currentTarget && e.currentTarget.matches(":focus-visible") && onFocusFrame(i)}
    >
      <span className="g-name">{name}</span>
      <div className="g-body">{children}</div>
      <i className="g-hdl tl" /><i className="g-hdl tr" /><i className="g-hdl bl" /><i className="g-hdl br" />
      <span className="g-size">Hug × Hug</span>
    </div>
  );
}

// ---------- FRONT WALL: Work ----------
export function WorkWall(p: WallProps) {
  return (
    <WallShell wall="work" title="Work" {...p}>
      {CASES.map((c, i) => (
        <Frame key={c.title} i={i} name={`${c.org} / ${c.title}`} focus={p.focus} onFocusFrame={p.onFocusFrame} className="g-case">
          <CaseTile study={c} />
        </Frame>
      ))}
    </WallShell>
  );
}

// ---------- LEFT WALL: About ----------
export function AboutWall(p: WallProps) {
  const s = ABOUT.statement;
  const f = { focus: p.focus, onFocusFrame: p.onFocusFrame };
  return (
    <WallShell wall="about" title="About" {...p}>
      <Frame i={0} name="About / Statement" {...f} className="g-card g-w-statement">
        <span className="eyebrow label">About</span>
        <h2>{s.before}<em>{s.em}</em>{s.after}</h2>
        {ABOUT.paragraphs.map((t) => <p key={t.slice(0, 20)}>{t}</p>)}
      </Frame>
      <Frame i={1} name="About / Quick facts" {...f} className="g-card g-w-facts">
        <span className="eyebrow label">Quick facts</span>
        <dl className="g-list">
          {ABOUT.facts.map((x) => (
            <div key={x.k}><dt className="label">{x.k}</dt><dd>{x.v}</dd></div>
          ))}
        </dl>
      </Frame>
      <Frame i={2} name="About / Experience" {...f} className="g-card g-w-exp">
        <span className="eyebrow label">Experience</span>
        <dl className="g-list">
          {EXPERIENCE.map((x) => (
            <div key={x.company}>
              <dt className="label">{x.year}{x.yearSuffix}</dt>
              <dd>{x.company}<span>{x.role}</span></dd>
            </div>
          ))}
        </dl>
      </Frame>
      <Frame i={3} name="About / Links" {...f} className="g-card g-w-links">
        <span className="eyebrow label">Find me</span>
        <ul className="g-links">
          <li><a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a></li>
          <li><a href={LINKS.x} target="_blank" rel="noopener">X.com ↗</a></li>
          <li><a href={LINKS.github} target="_blank" rel="noopener">GitHub ↗</a></li>
          <li>{EMAIL ? <a href={`mailto:${EMAIL}`}>{EMAIL}</a> : <span className="muted">Email coming soon</span>}</li>
          <li>{RESUME_URL ? <a href={RESUME_URL} target="_blank" rel="noopener">Resume ↗</a> : <span className="muted">Resume coming soon</span>}</li>
        </ul>
      </Frame>
    </WallShell>
  );
}

// ---------- RIGHT WALL: Fun ----------
// TODO(nupur): swap the generated paintings, crane and spine labels for photos of your real work (same as the desk).
export function FunWall(p: WallProps) {
  const s = FUN.statement;
  const f = { focus: p.focus, onFocusFrame: p.onFocusFrame };
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    row.current?.querySelectorAll<HTMLCanvasElement>("canvas[data-seed]").forEach(paint);
  }, []);
  return (
    <WallShell wall="fun" title="Fun" {...p}>
      <div className="g-row-inner" ref={row}>
        <Frame i={0} name="Fun / Intro" {...f} className="g-card g-w-fun">
          <span className="eyebrow label">Fun</span>
          <h2>{s.before}<em>{s.em}</em>{s.after}</h2>
          <p>{FUN.paragraph}</p>
        </Frame>
        <Frame i={1} name="Painting 01" {...f}>
          <div className="frame"><canvas width={420} height={300} data-seed={7} role="img" aria-label="Abstract watercolour placeholder" /></div>
        </Frame>
        <Frame i={2} name="The nightstand" {...f}>
          <div className="books">
            {SPINES.map(([h, label], k) => (
              <span key={label} className={`spine label s${k + 1}`} style={{ height: h * 1.9, background: `var(--spine-${k + 1})` }}>
                {label}
              </span>
            ))}
          </div>
        </Frame>
        <Frame i={3} name="Origami · one sheet, no cuts" {...f}>
          <div className="paper g-paper"><Crane size={2} /></div>
        </Frame>
        <Frame i={4} name="Painting 02" {...f}>
          <div className="frame"><canvas width={290} height={380} data-seed={21} role="img" aria-label="Abstract watercolour placeholder" /></div>
        </Frame>
      </div>
    </WallShell>
  );
}
