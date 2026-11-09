"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL, EXPERIENCE, LINKS } from "@/lib/content";

export default function LeftRail() {
  return (
    <aside className="rail">
      <div className="intro">
        <div className="idline">
          <span className="loc">
            <span className="live" aria-hidden="true" />
            India · Open to remote
          </span>
        </div>
        <h1>
          I&apos;m Nupur, a product designer who{" "}
          <span className="hl">vibe-codes</span>
        </h1>
        <p className="sub">
          Designing B2B tools used by 100+ brands at LehLah — now shipping the frontend, not just the mockups
        </p>
      </div>

      <div className="bottom">
        <div className="exp">
          {EXPERIENCE.map((x) => (
            <Row key={x.company} {...x} />
          ))}
        </div>
        <nav className="socials label" aria-label="Links">
          <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <EmailLink />
          <a href={LINKS.x} target="_blank" rel="noopener">X.com</a>
          <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
        </nav>
      </div>
    </aside>
  );
}

function Row({ year, yearSuffix, company, role }: (typeof EXPERIENCE)[number]) {
  return (
    <>
      <span className="yr label">
        {year}
        {yearSuffix}
      </span>
      <span>{company}</span>
      <span>{role}</span>
    </>
  );
}

// EMAIL shows the address with a copy button (it no longer opens the chat).
function EmailLink() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("pointerdown", close);
    addEventListener("keydown", close);
    return () => {
      removeEventListener("pointerdown", close);
      removeEventListener("keydown", close);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked: the address is still visible to copy by hand */
    }
  };

  return (
    <span className="emailwrap" ref={wrap}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        Email
      </button>
      {open && (
        <span className="emailpop" role="dialog" aria-label="Email address">
          {EMAIL ? (
            <>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <button type="button" className="btn" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </>
          ) : (
            <span className="muted">Email address coming soon</span>
          )}
        </span>
      )}
    </span>
  );
}
