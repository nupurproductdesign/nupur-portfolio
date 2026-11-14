"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Intro from "./Intro";
import { AboutWall, FunWall, WorkWall } from "./Walls";
import { Cursors } from "./Cursors";
import ChatPanel from "../ChatPanel";
import { CASES, EMAIL } from "@/lib/content";

// The gallery is one CSS 3D room: a front wall (Work), a left wall (About) and a right wall (Fun),
// plus a floor and ceiling. Nothing moves except a "camera": we move/turn the whole room in the opposite
// direction, so the visitor feels like they walk and turn. All sizes below are in room pixels.
// D (depth) sets how far away the front wall feels from the doorway: bigger = farther. 2400 felt too close,
// 4000 too far and empty (2026-11-10), so 3200. Keep every number a multiple of 40 so the dot grid meets at corners.
export const ROOM = { W: 2400, D: 3200, H: 1000 }; // width (front wall), depth (side walls), height

export type Wall = "work" | "about" | "fun";
type View = "overview" | Wall;
type Pose = { yaw: number; x: number; y: number; z: number };
type Box = { cx: number; cy: number; w: number; h: number }; // a frame's centre/size, relative to its wall's centre

const WALLS: Wall[] = ["work", "about", "fun"];
const LABEL: Record<View, string> = { overview: "Portfolio", work: "Work", about: "About", fun: "Fun" };

// Eye distance (CSS `perspective`). Bigger = flatter, smaller = more dramatic. Tuned per orientation.
const perspectiveFor = (w: number, h: number) => (w >= h ? 1.2 * h : 1.5 * w);

// Where the camera stands to face a point on a wall, from `d` room-px away.
// u = sideways along the wall (to the viewer's right), v = up/down (down is +).
function facing(wall: Wall, u: number, v: number, d: number): Pose {
  const { W, D } = ROOM;
  if (wall === "work") return { yaw: 0, x: u, y: v, z: -D / 2 + d }; // straight ahead
  if (wall === "about") return { yaw: -90, x: -W / 2 + d, y: v, z: -u }; // turned left
  return { yaw: 90, x: W / 2 - d, y: v, z: u }; // turned right
}

export default function Gallery() {
  const [phase, setPhase] = useState<"intro" | "room">("intro");
  const [introGone, setIntroGone] = useState(false);
  const [entered, setEntered] = useState(false); // camera has started its first pull-back
  const [view, setView] = useState<View>("overview");
  const [focus, setFocus] = useState<number | null>(null); // which frame we stepped up to
  const [asking, setAsking] = useState(false); // Ask-Nupur floating chat panel
  const [slow, setSlow] = useState(false); // the opening auto-pan uses a slower camera move
  const autoPan = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const chatRef = useRef<HTMLElement>(null);
  const sparkRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  // the chat is exactly as wide as the bottom bar: measure the bar and hand its width to the CSS as --bar-w
  useLayoutEffect(() => {
    const bar = barRef.current, root = rootRef.current;
    if (!bar || !root) return;
    const ro = new ResizeObserver(() => root.style.setProperty("--bar-w", `${bar.offsetWidth}px`));
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const [boxes, setBoxes] = useState<Record<Wall, Box[]>>({ work: [], about: [], fun: [] });
  const wallRefs = useRef<Record<Wall, HTMLDivElement | null>>({ work: null, about: null, fun: null });

  // viewport size drives the camera maths
  useLayoutEffect(() => {
    const on = () => setVp({ w: innerWidth, h: innerHeight });
    on();
    addEventListener("resize", on);
    return () => removeEventListener("resize", on);
  }, []);

  // measure every frame on every wall (layout positions are unaffected by the 3D transforms)
  const measure = useCallback(() => {
    const next = { work: [], about: [], fun: [] } as Record<Wall, Box[]>;
    for (const wall of WALLS) {
      const el = wallRefs.current[wall];
      if (!el) continue;
      const L = el.offsetWidth, H = el.offsetHeight;
      el.querySelectorAll<HTMLElement>("[data-frame]").forEach((f) => {
        // offsetLeft/Top are relative to the wall because the wall is the positioned ancestor
        let x = 0, y = 0, n: HTMLElement | null = f;
        while (n && n !== el) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
        next[wall].push({ cx: x + f.offsetWidth / 2 - L / 2, cy: y + f.offsetHeight / 2 - H / 2, w: f.offsetWidth, h: f.offsetHeight });
      });
    }
    setBoxes(next);
  }, []);
  useEffect(() => {
    if (phase !== "room") return;
    measure();
    document.fonts?.ready.then(measure);
  }, [phase, measure, vp]);

  const P = perspectiveFor(vp.w, vp.h);
  const BAR = 72; // screen px kept clear at the bottom for the tab bar
  const PEEK = 0.3; // how much of the next frame shows beside the focused one (30%, Nupur 2026-11-10)

  const pose: Pose = useMemo(() => {
    const { W, D, H } = ROOM;
    if (view === "overview") {
      // stand just outside the doorway, looking at the Work wall. Fit the doorway's height to the screen,
      // but on narrow screens step back further so the side walls still show.
      const e = Math.max((H * P) / vp.h, (W * P) / (1.6 * vp.w));
      return { yaw: 0, x: 0, y: 0, z: D / 2 + e * (entered ? 1 : 0.55) };
    }
    const box = focus !== null ? boxes[view][focus] : undefined;
    if (box) {
      // step up to one frame, carousel-style: frame it together with the first 30% of the NEXT frame, so the
      // visitor can see there's more to the right. The last frame has no next one, so it's simply centred.
      const next = boxes[view][focus! + 1];
      const left = box.cx - box.w / 2;
      const right = next ? next.cx - next.w / 2 + PEEK * next.w : box.cx + box.w / 2;
      // fit the focused frame's height (72% of the space above the bar) and the whole span's width (90%)
      const s = Math.min((0.72 * (vp.h - BAR)) / box.h, (0.9 * vp.w) / (right - left));
      return facing(view, (left + right) / 2, box.cy + BAR / 2 / s, Math.max(P / s, 140));
    }
    // whole wall: fit its height (and width when it can), but never back through the opposite wall.
    // The front wall is W wide; side walls run the room's depth D, with their frames spread along all of it.
    const L = view === "work" ? W : D;
    const s = Math.min((0.66 * vp.h) / H, (0.9 * vp.w) / L);
    const maxD = view === "work" ? D * 1.3 : W * 0.95;
    const d = Math.min(P / s, maxD);
    return facing(view, 0, (BAR / 2) * (d / P), d);
  }, [view, focus, boxes, vp, P, entered]);

  const camera = `translateZ(${P}px) rotateY(${pose.yaw}deg) translate3d(${-pose.x}px, ${-pose.y}px, ${-pose.z}px)`;

  // ----- navigation -----
  // opening a wall (tab or click) steps straight up to its first frame; the doorway view has no focus
  // any move the visitor makes cancels the opening auto-pan and goes back to the normal camera speed
  // (it also closes the chat, e.g. a tab clicked in the bottom bar while chatting, so the visitor sees where they went)
  const userMoved = useCallback(() => {
    clearTimeout(autoPan.current);
    setSlow(false);
    setAsking(false);
  }, []);

  const go = useCallback((v: View) => {
    userMoved();
    setFocus(v === "overview" ? null : 0);
    setView(v);
  }, [userMoved]);

  const count = view === "overview" ? 0 : boxes[view].length;
  const step = useCallback(
    (dir: 1 | -1) => {
      if (view === "overview" || !count) return;
      userMoved();
      setFocus((f) => (f === null ? (dir === 1 ? 0 : count - 1) : Math.max(0, Math.min(count - 1, f + dir))));
    },
    [view, count, userMoved]
  );

  // Esc: close the chat, otherwise back to the doorway (same as clicking the empty canvas)
  // open/close Ask-Nupur; opening focuses the question field, closing hands focus back to the sparkle button
  const setChat = useCallback((open: boolean) => {
    setAsking(open);
    if (open) setTimeout(() => chatRef.current?.querySelector<HTMLInputElement>("#q")?.focus({ preventScroll: true }), 300);
    else sparkRef.current?.focus({ preventScroll: true });
  }, []);

  const back = useCallback(() => {
    if (asking) return setChat(false);
    if (view !== "overview") go("overview");
  }, [asking, setChat, view, go]);

  // keyboard: arrows walk frame to frame, Esc steps back
  useEffect(() => {
    if (phase !== "room") return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") return back();
      // typing in the chat: arrow keys move the text cursor, not the camera
      if ((e.target as Element).closest?.("input, textarea, .g-ask")) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, [phase, back, step]);

  // scroll wheel / trackpad: one frame per gesture
  useEffect(() => {
    if (phase !== "room") return;
    let lock = 0;
    const on = (e: WheelEvent) => {
      if ((e.target as Element).closest?.(".g-ask")) return; // scrolling the chat, not the room
      const dv = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(dv) < 12 || Date.now() < lock) return;
      lock = Date.now() + 700;
      step(dv > 0 ? 1 : -1);
    };
    addEventListener("wheel", on, { passive: true });
    return () => removeEventListener("wheel", on);
  }, [phase, step]);

  // intro → room: pull the camera back from the Work wall, pause, then slowly pan up to the Work wall
  // (its first frame, same as the Work tab). Skipped if the visitor moves first.
  const AUTO_PAN_DELAY = 2000; // ms after the room appears: 1.25s pull-back + a short pause
  const enter = useCallback(() => {
    setPhase("room");
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    autoPan.current = setTimeout(() => {
      setSlow(true);
      setFocus(0);
      setView("work");
    }, AUTO_PAN_DELAY);
  }, []);
  useEffect(() => () => clearTimeout(autoPan.current), []);

  // coming back from a case study page, skip the intro:
  //   /#room        → the doorway view of the room ("Nupur Gidhi" in the breadcrumb)
  //   /#work/<slug> → the Work wall, on that case's frame ("Work" / "Back to Work")
  useLayoutEffect(() => {
    const m = location.hash.match(/^#(room|work)(?:\/(.+))?$/);
    if (!m) return;
    history.replaceState(null, "", "/"); // a refresh after this plays the intro as usual
    setIntroGone(true);
    setPhase("room");
    if (m[1] === "work") {
      setView("work");
      setFocus(Math.max(0, CASES.findIndex((c) => c.slug === m[2])));
    }
    // turn camera animation on only after the first placement, so the room appears already in position
    setTimeout(() => setEntered(true), 400);
  }, []);

  const gone = useCallback(() => setIntroGone(true), []);

  const wallProps = (wall: Wall) => ({
    ref: (el: HTMLDivElement | null) => { wallRefs.current[wall] = el; },
    active: view === wall,
    focus: view === wall ? focus : null,
    // from the doorway, clicking a wall turns you to face it; when already facing a wall, the stage's click handler
    // takes you back to the doorway instead
    onOpen: () => { if (view === "overview") go(wall); },
    onFocusFrame: (i: number) => { userMoved(); setFocus(i); },
  });

  return (
    <div
      ref={rootRef}
      className={`g-root${phase === "room" ? " is-room" : ""}${view === "overview" ? " is-overview" : " is-wall"}`}
      // room sizes for the CSS (app/gallery.css builds the walls, floor and ceiling from these)
      style={{ "--W": `${ROOM.W}px`, "--D": `${ROOM.D}px`, "--H": `${ROOM.H}px` } as CSSProperties}
    >
      {introGone && <h1 className="sr-only">Nupur Gidhi, product designer: portfolio gallery</h1>}

      {/* the room */}
      {/* clicking empty canvas (anything that isn't a frame) while facing a wall goes back to the doorway view. */}
      <div
        className="g-stage"
        style={{ perspective: `${P}px` }}
        aria-hidden={phase !== "room"}
        onClick={(e) => {
          if (view !== "overview" && !(e.target as Element).closest("[data-frame]")) go("overview");
        }}
      >
        <div className={`g-world${entered ? " is-moving" : ""}${slow ? " is-slow" : ""}`} style={{ transform: camera }}>
          <div className="g-floor" />
          <div className="g-ceiling" />
          <WorkWall {...wallProps("work")} />
          <AboutWall {...wallProps("about")} />
          <FunWall {...wallProps("fun")} />
        </div>
      </div>

      {/* Figma-style chrome */}
      <header className="g-crumb">
        <button type="button" onClick={() => go("overview")}>Nupur Gidhi</button>
        <span aria-hidden="true">/</span>
        <span>{LABEL[view]}</span>
      </header>

      {/* Say Hi!: quiet white floating button top right, opens an email to Nupur (EMAIL in lib/content.ts).
          If EMAIL is ever emptied it links nowhere and says so. */}
      <a
        className="g-float"
        href={EMAIL ? `mailto:${EMAIL}` : undefined}
        aria-disabled={!EMAIL}
        title={EMAIL ? `Email ${EMAIL}` : "Email address coming soon"}
      >
        Say Hi!
      </a>

      <nav className="g-bar" aria-label="Gallery walls" ref={barRef}>
        {WALLS.map((w) => (
          // while the chat is open, only the Ask Nupur tab shows as selected
          <button key={w} type="button" className="g-tab" aria-current={!asking && view === w} onClick={() => go(w)}>
            {LABEL[w]}
          </button>
        ))}
        {/* Ask Nupur: a fourth tab that opens the chat; selected while the chat is open (Nupur 2026-11-10) */}
        <button
          ref={sparkRef}
          type="button"
          className="g-tab g-tab-ask"
          aria-expanded={asking}
          aria-controls="chatcol"
          onClick={() => setChat(!asking)}
        >
          {/* Nupur's sparkle icon (her file: public/ask-nupur/Subtract.svg), inlined so it takes the text colour */}
          <svg viewBox="0 0 1500 1500" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M750 0C750 414.214 1085.79 750 1500 750C1085.79 750 750 1085.79 750 1500C750 1085.79 414.214 750 0 750C414.214 750 750 414.214 750 0Z"
            />
          </svg>
          Ask Nupur
        </button>
        <span className="g-pager">
          <button type="button" aria-label="Previous frame" onClick={() => step(-1)} disabled={!count || focus === 0}>‹</button>
          <span className="g-count" aria-live="polite">{count ? `${focus === null ? "–" : focus + 1}/${count}` : "–/–"}</span>
          <button type="button" aria-label="Next frame" onClick={() => step(1)} disabled={!count || focus === count - 1}>›</button>
        </span>
      </nav>


      {/* Ask-Nupur: same chat as the classic site (welcome, suggested questions, /api/ask), centred over a blurred room */}
      {/* blurred backdrop behind the centred chat; clicking it closes the chat */}
      <div className={`g-ask-backdrop${asking ? " is-open" : ""}`} aria-hidden="true" onClick={() => setChat(false)} />
      <ChatPanel ref={chatRef} open={asking} onClose={() => setChat(false)} className={`g-ask${asking ? " is-open" : ""}`} />

      {/* cursor chat hint only on About and Fun (not Work), Nupur 2026-11-10 */}
      <Cursors hint={view === "about" || view === "fun"} />

      {!introGone && <Intro onLeave={enter} onGone={gone} />}
    </div>
  );
}
