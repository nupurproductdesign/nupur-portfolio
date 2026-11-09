"use client";

import { useEffect, useRef } from "react";

// TODO(nupur): swap the generated "paintings" for photos of your real paintings and origami,
// and the spine labels for real book titles.

// Book spines: colours and label colours come from theme tokens (--spine-N, --spine-N-text).
export const SPINES: [number, string][] = [
  [146, "Now reading"],
  [128, "Read twice"],
  [156, "Gifted 5×"],
  [118, "Design"],
  [138, "Fiction"],
];

type Obj = { left: string; top: string; r: number; children: React.ReactNode; className?: string };

const OBJECTS: Obj[] = [
  {
    left: "4%", top: "7%", r: -3, className: "note",
    children: (<><b>Desk rules</b>Everything here moves. Rearrange it however you like, I do it daily.</>),
  },
  { left: "34%", top: "5%", r: 2, children: <Painting w={210} h={150} seed={7} /> },
  { left: "70%", top: "8%", r: 4, children: <Painting w={140} h={180} seed={21} /> },
  {
    left: "6%", top: "54%", r: 1,
    children: (
      <>
        <div className="books">
          {SPINES.map(([h, label], i) => (
            <span key={label} className={`spine label s${i + 1}`} style={{ height: h, background: `var(--spine-${i + 1})` }}>
              {label}
            </span>
          ))}
        </div>
        <div className="c label">The nightstand</div>
      </>
    ),
  },
  {
    left: "38%", top: "52%", r: -2,
    children: (
      <>
        <div className="paper" style={{ width: 170, display: "grid", placeItems: "center" }}>
          <Crane />
        </div>
        <div className="c label">Origami · one sheet, no cuts</div>
      </>
    ),
  },
  { left: "68%", top: "56%", r: -3, children: <Painting w={200} h={130} seed={44} /> },
];


// Origami crane, also hung on the Fun wall in /gallery.
export function Crane({ size = 1 }: { size?: number }) {
  return (
    <svg viewBox="0 0 140 100" width={140 * size} height={100 * size} role="img" aria-label="Origami crane" style={{ color: "var(--origami)" }}>
      <polygon points="70,58 40,30 58,62" fill="currentColor" />
      <polygon points="70,58 58,62 66,78" fill="currentColor" opacity=".6" />
      <polygon points="70,58 100,8 82,60" fill="currentColor" opacity=".78" />
      <polygon points="70,58 82,60 66,78" fill="currentColor" opacity=".45" />
      <polygon points="58,62 18,40 26,36 40,30" fill="currentColor" opacity=".55" />
      <polygon points="18,40 10,52 26,36" fill="currentColor" />
      <polygon points="82,60 128,34 90,64" fill="currentColor" opacity=".65" />
      <polygon points="66,78 90,64 82,60" fill="currentColor" opacity=".3" />
    </svg>
  );
}

function Painting({ w, h, seed }: { w: number; h: number; seed: number }) {
  return (
    <>
      <div className="frame">
        <canvas width={w} height={h} data-seed={seed} role="img" aria-label="Abstract watercolour placeholder" />
      </div>
      <div className="c label">Painting</div>
    </>
  );
}

// Seeded watercolour blobs, same algorithm as the prototype. Inks are read from the CSS tokens,
// so the paintings stay on-palette without hardcoding colours here.
function rng(s: number) {
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
// --inks is a token list like "92 107 240, 201 142 43, …"
function readInks(): number[][] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--inks");
  return raw.split(",").map((c) => c.trim().split(/\s+/).map(Number));
}
export function paint(c: HTMLCanvasElement) {
  const g = c.getContext("2d");
  if (!g) return;
  const INKS = readInks();
  const r = rng(+c.dataset.seed! * 997 + 13), W = c.width, H = c.height;
  g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--desk-canvas").trim();
  g.fillRect(0, 0, W, H);
  const pick = [INKS[Math.floor(r() * 5)], INKS[Math.floor(r() * 5)], INKS[Math.floor(r() * 5)]];
  for (let i = 0; i < 70; i++) {
    const [a, b, d] = pick[i % 3], x = r() * W, y = r() * H, rad = 12 + r() * 50;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(${a},${b},${d},${0.1 + r() * 0.1})`);
    gr.addColorStop(1, `rgba(${a},${b},${d},0)`);
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  }
}

export default function Desk() {
  const desk = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = desk.current!;
    d.querySelectorAll<HTMLCanvasElement>("canvas[data-seed]").forEach(paint);

    let z = 5;
    const cleanups: (() => void)[] = [];
    d.querySelectorAll<HTMLElement>(".obj").forEach((o) => {
      const down = (e: PointerEvent) => {
        if (matchMedia("(max-width:620px)").matches) return;
        e.preventDefault();
        o.setPointerCapture(e.pointerId);
        const dr = d.getBoundingClientRect(), orc = o.getBoundingClientRect();
        const ox = e.clientX - orc.left, oy = e.clientY - orc.top;
        o.classList.add("drag");
        o.style.zIndex = String(++z);
        o.style.transform = "rotate(0deg) scale(1.05)";
        const mv = (ev: PointerEvent) => {
          o.style.left = Math.max(0, Math.min(dr.width - orc.width, ev.clientX - dr.left - ox)) + "px";
          o.style.top = Math.max(0, Math.min(dr.height - orc.height, ev.clientY - dr.top - oy)) + "px";
        };
        const up = () => {
          o.classList.remove("drag");
          o.style.transform = `rotate(${(Math.random() * 6 - 3).toFixed(1)}deg)`;
          o.removeEventListener("pointermove", mv);
          o.removeEventListener("pointerup", up);
          o.removeEventListener("pointercancel", up);
        };
        o.addEventListener("pointermove", mv);
        o.addEventListener("pointerup", up);
        o.addEventListener("pointercancel", up);
      };
      o.addEventListener("pointerdown", down);
      cleanups.push(() => o.removeEventListener("pointerdown", down));
    });
    return () => cleanups.forEach((f) => f());
  }, []);

  return (
    <div className="desk" id="desk" ref={desk}>
      {OBJECTS.map((o, i) => (
        <div
          key={i}
          className={`obj${o.className ? " " + o.className : ""}`}
          style={{ left: o.left, top: o.top, transform: `rotate(${o.r}deg)` }}
        >
          {o.children}
        </div>
      ))}
    </div>
  );
}
