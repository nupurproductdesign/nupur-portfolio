"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { CANNED } from "@/lib/content";

type Turn = { role: "user" | "assistant"; content: string };
// pending: greyed "Thinking…" placeholder. excluded: failed exchange, kept on screen but not sent as history.
type Bubble = Turn & { pending?: boolean; excluded?: boolean };

export const MAX_QUESTION = 400;
const DISCLAIMER = "AI answers can be wrong. For anything important, reach me on LinkedIn.";
const FALLBACK = "Something went wrong on my side. Try again, or reach me on LinkedIn.";

// Structure: header bar (name + info | reset + close), a scrolling log, and a welcome state with
// suggested questions that sits at the bottom until the first question is asked.
export default function ChatPanel({ open, ref, onClose }: { open: boolean; ref: Ref<HTMLElement>; onClose: () => void }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const run = useRef(0); // bumps on reset so a reply still streaming from an old conversation is ignored
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    const l = logRef.current;
    if (l) l.scrollTop = l.scrollHeight;
  }, [bubbles]);

  function reset() {
    run.current++;
    abort.current?.abort();
    setBubbles([]);
    setBusy(false);
    setQ("");
    document.getElementById("q")?.focus({ preventScroll: true });
  }

  async function ask(raw: string) {
    const question = raw.trim().slice(0, MAX_QUESTION);
    if (!question || busy) return;
    const id = run.current;
    // replace the last (pending) bubble, unless the chat was reset meanwhile
    const setLast = (b: Bubble) => id === run.current && setBubbles((bs) => [...bs.slice(0, -1), b]);
    const markFailed = () =>
      id === run.current && setBubbles((bs) => bs.map((b, i) => (i >= bs.length - 2 ? { ...b, excluded: true } : b)));

    setBusy(true);
    const history: Turn[] = bubbles.filter((b) => !b.pending && !b.excluded).map(({ role, content }) => ({ role, content }));

    if (CANNED[question]) {
      setBubbles((bs) => [...bs, { role: "user", content: question }, { role: "assistant", content: "Typing…", pending: true }]);
      await new Promise((r) => setTimeout(r, 500));
      setLast({ role: "assistant", content: CANNED[question] });
      if (id === run.current) setBusy(false);
      return;
    }

    setBubbles((bs) => [...bs, { role: "user", content: question }, { role: "assistant", content: "Thinking…", pending: true }]);
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: question }].slice(-8) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setLast({ role: "assistant", content: data?.error || FALLBACK });
        markFailed();
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setLast({ role: "assistant", content: text });
      }
      if (!text.trim()) {
        setLast({ role: "assistant", content: FALLBACK });
        markFailed();
      }
    } catch {
      if (ctrl.signal.aborted) return; // reset by the visitor, not an error
      setLast({ role: "assistant", content: FALLBACK });
      markFailed();
    } finally {
      if (id === run.current) setBusy(false);
    }
  }

  const empty = bubbles.length === 0;

  return (
    <section className="chatcol" id="chatcol" aria-label="Ask-Nupur" aria-hidden={!open} inert={!open} ref={ref}>
      <div className="view ask">
        <div className="ask-bar">
          <div className="ask-title">
            <span className="label">Ask-Nupur</span>
            <InfoTip text={DISCLAIMER} />
          </div>
          <div className="ask-actions">
            <button type="button" className="icon-btn" aria-label="Start a new conversation" onClick={reset} disabled={empty}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.2 6.2A5.2 5.2 0 1 1 3 9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M2.8 2.8v3.6h3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="icon-btn" aria-label="Close Ask-Nupur chat" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="log" id="log" aria-live="polite" ref={logRef}>
          {empty ? (
            <div className="welcome">
              <h2>Welcome to Ask-Nupur.</h2>
              <p>An AI trained on my work. Ask it what you&apos;d ask me in the first interview.</p>
              <div className="chips">
                {Object.keys(CANNED).map((k) => (
                  <button key={k} type="button" className="chip" onClick={() => ask(k)}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            bubbles.map((b, i) => (
              <div key={i} className={`msg ${b.role === "user" ? "me" : "ai"}${b.pending ? " think" : ""}`}>
                {b.content}
              </div>
            ))
          )}
        </div>

        <form
          className="field"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            ask(q);
            setQ("");
          }}
        >
          <label htmlFor="q" className="sr-only">
            Your question
          </label>
          <input
            id="q"
            placeholder="Ask about Nupur…"
            maxLength={MAX_QUESTION}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="send" type="submit" aria-label="Send" disabled={!q.trim() || busy}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}

// Info icon with a tooltip: shows on hover and keyboard focus; tap toggles it on touch screens.
function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("pointerdown", close);
    return () => removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <span className="info" ref={wrap}>
      <button
        type="button"
        className="info-btn"
        aria-label="About these answers"
        aria-describedby="ask-disc"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 7.2v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="4.9" r=".9" fill="currentColor" />
        </svg>
      </button>
      <span role="tooltip" id="ask-disc" className={`tip${open ? " open" : ""}`}>
        {text}
      </span>
    </span>
  );
}
