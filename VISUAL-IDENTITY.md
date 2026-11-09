# Visual Identity: Nupur Gidhi Portfolio

This is the source of truth for the site's look. Follow it for every change. If something isn't covered, ask before inventing a new colour, font or style.

**Mood:** dark, calm, considered, with one warm flourish. Soft charcoal surfaces, clean sans type, and a single butter accent that does the talking.

**Live theme:** Dark + Butter (`data-theme="butter"` on `<html>`, adopted 2026-10-03). Earlier palettes are kept in `app/tokens.css` as fallbacks (see §8).

---

## 1. Colour tokens

Keep every colour in `app/tokens.css` and never hardcode a colour in a component. Components use **role tokens** (`--bg`, `--text`, `--accent`…), never raw hex.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#222222` | Page, nav (86% + blur), rail, chat column |
| `--surface` | `#2E2E2E` | Case tiles, Fun desk |
| `--surface-2` | `#393939` | Inner cards, AI chat bubble, chat input, tooltip, email popover |
| `--line` | `#4A4A4A` | Divider lines and borders |
| `--text` | `#F4F4F4` | Primary text |
| `--text-muted` | `#A8A8A8` | Secondary text, labels |
| `--accent` | `#F3DF9A` | **Butter.** The only accent colour |
| `--on-accent` | `#1E1E1E` | Text on any butter fill |
| `--accent-hover` | 8% darker butter (`#E0CD8E`) | Button hover |
| `--accent-active` | 16% darker butter (`#CCBB81`) | Button pressed |

Status colours (ok `#6FCF97`, amber `#E9B454`, blue `#959DFF`) appear **only inside the placeholder tile mocks**, never in the site UI.

### Where the accent goes

- **Plain butter** (`--accent` as text or line): active nav tab text and its underline, status-chip dot, link underlines, the Ask-Nupur dot, emphasis words in section headings ("states", "paint"), focus ring.
- **Butter fill + `#1E1E1E` text:** primary buttons (send, "View case study" arrow, Copy, mock CTA), the visitor's chat bubble, text selection, and the "vibe-codes" post-it.
- Nothing else is butter. No lime, crimson or peach anywhere.

### Approved contrast pairs (WCAG AA, all checked)

| Text | Background | Ratio |
|---|---|---|
| `--text` | `--bg` | 14.5:1 |
| `--text` | `--surface-2` | 10.5:1 |
| `--text-muted` | `--bg` | 6.7:1 |
| `--text-muted` | `--surface-2` | 4.9:1 |
| butter | `--bg` | 12.0:1 |
| butter | `--surface` | 10.2:1 |
| butter | `--surface-2` | 8.7:1 |
| `#1E1E1E` | butter | 12.6:1 |
| `#1E1E1E` | butter hover | 10.6:1 |
| `#1E1E1E` | butter pressed | 8.7:1 |

Non-text (focus ring, underline, dot): butter on `--bg` 12.0:1, well above 3:1.

Use only these pairs for text. Check any new pair before using it: 4.5:1 for body text, 3:1 for text 24px and larger.

---

## 2. Typography

Two fonts, both from Google Fonts via `next/font/google`.

| Role | Font | Use |
|---|---|---|
| Display | **Funnel Display** (variable, 300–800) | Headline, section headings, "Welcome to Ask-Nupur.", desk note title |
| Body and labels | **Geist** 400, 500 | Everything else, including case-tile titles |

No serif, no script, no monospace. Funnel Display has no italic, so emphasis is **colour only** (butter, upright).

### Type scale

| Element | Font | Size | Line height | Tracking |
|---|---|---|---|---|
| Headline (h1) | Funnel Display 500 | 32px | 1.3 | -0.02em |
| Section heading (About, Fun) | Funnel Display 400 | 36px | 1.15 | -0.02em |
| Chat welcome heading | Funnel Display 400 | 28px | 1.15 | -0.02em |
| Case-tile title | Geist 400 | 16px | 1.35 | 0 |
| Subline, chat subtext | Geist 400 | 14px | 1.5 | 0 |
| Experience table | Geist 400 | 14px | 1.3 | 0 |
| Body | Geist 400 | 15–16.5px | 1.55 | 0 |
| Labels | Geist 500, UPPERCASE | 10.5–12px | 1.3 | 0.14em |

- Every uppercase label gets 0.14em letter-spacing (`--label-tracking`).
- Timeline years use tabular numbers.

---

## 3. Layout

- **Top nav:** sticky, 64px (two rows, 96px, below 620px). `--bg` at 86% with a 14px backdrop blur and a 1px `--line` bottom border. NUPUR GIDHI left, WORK · ABOUT · FUN · RESUME ↗ centre, ASK-NUPUR right.
- **Left rail:** `--bg`, separated from the content by a 1px `--line` (bottom line when stacked below 980px).
- **Content:** Work (2×2 square tiles), About, Fun, colophon. Dividers between sections in `--line`.
- **Chat:** opens a third column (1:1:1) with a `--line` left border; below 980px it replaces the content.
- **Spacing:** one top padding (`--pad-top` 24px) and one side gutter (`--g`, 2.6% of the window, 16–44px; 16px below 980px) for all three columns; the nav and footers share `--g`. Footers (rail socials, colophon, chat header) share `--foot` 64px so their lines align.
- **Never scroll sideways.** Test at 360, 390, 768, 1024 and 1440.

---

## 4. Components

### The "vibe-codes" post-it (the one flourish)

- **Only on the word "vibe-codes" in the headline.** Never put a post-it on any other word, heading, button or label.
- A small square-cornered butter note (`--accent`, no border, no radius) with `#1E1E1E` text (12.6:1), padding
  `.12em .32em .16em`, line-height 1.1.
- The bottom third fades to a slightly darker butter (the paper curl), and the shadow sits mostly under the bottom
  edge, so it reads as a note stuck at the top and lifting at the bottom.
- Tilted −3°; straightens slightly and lifts on hover.
- No line break inside the word (`white-space: nowrap`).
- On load it "slaps on" over 600ms: drops in slightly larger and more tilted, overshoots, then settles.
- With `prefers-reduced-motion`, it appears in place with no animation.
- (Evolved from a marker highlighter → rounded sticker → post-it, 2026-10-03.)

### Nav tabs and Ask-Nupur

- **Inactive tab:** `--text` at 82% opacity, 100% on hover. No background.
- **Active tab:** butter text with a 1.5px butter underline under the text only, 2px below it. It animates in with `scaleX` 0→1 from the left over 300ms; instant with reduced motion.
- **No pill fills.** Not on active tabs, not on hover.
- **Ask-Nupur:** a butter dot plus the label. While the chat is open, the tab collapses to just the dot (no other selected styling). The close button lives inside the chat header.

### Case tiles

- `--surface` background, **1:1 square**, 4px radius, no border.
- Status chip top-left: `--bg` pill with a butter dot and `--text` label (e.g. ● SHIPPED 2026).
- Caption: org label (Geist 500 uppercase, `--text-muted`), then the title (Geist 16px, `--text`).
- Hover: the visual lifts (translateY -8px, scale 1.03); "View case study →" shows on desktop hover only.

### Buttons

- **Primary:** butter fill, `#1E1E1E` text, hover 8% darker, pressed 16% darker. Pill-shaped (round for icon buttons).
- **Icon buttons** (reset, close, info): `--text` icon, no fill, a 7% `--text` tint on hover.

### Links

- `--text` with a 1px butter underline. Hover turns the text butter.
- Social links underline in butter on hover (sweeps in from the left).

### Chat (Ask-Nupur)

- **Header bar** (64px, `--line` bottom border): ASK-NUPUR label + ⓘ tooltip; reset and close on the right.
- **Welcome state:** "Welcome to Ask-Nupur." (28px), the subline, and suggested questions as outline chips (`--line` border, `--text-muted` text → `--text` on hover).
- **Visitor messages:** butter bubble, `#1E1E1E` text. **AI messages:** `--surface-2` bubble, `--text`.
- **Input:** `--surface-2` field with a `--line` border that turns `--text` on focus; butter send button with a dark up arrow (greyed until there's text).

### Fun desk

- `--surface` desk with a subtle dot grid. Objects are physical things and keep their own colours (yellow note, paper frames, coloured spines). The butter spine and the crane (`#8A7631`, a deeper butter) are the only accent touches.

### Focus and selection

- `:focus-visible`: 2px butter outline, 3px offset.
- `::selection`: butter background, `#1E1E1E` text.

---

## 5. Shadows and motion

- Shadows are black and soft (`0 30px 60px -30px rgba(0,0,0,.8)` for cards).
- Default easing: `cubic-bezier(.2,.8,.2,1)`. Grid change when the chat opens: 700ms.
- Respect `prefers-reduced-motion`: no post-it animation, no underline animation, no spinning or pulsing.

---

## 6. Responsive

- **Below 980px:** everything stacks; the rail flows normally; nav stays 64px.
- **Below 620px:** nav becomes two rows (name + Ask-Nupur, then the tabs spread across); one-column case grid; desk objects wrap into a normal flow.

---

## 7. Don'ts

- No second accent colour. Butter only (status colours live inside tile mocks only).
- No post-it, sticker or highlight on anything except "vibe-codes".
- No serif, script or monospace fonts.
- No pill-filled active tabs.
- No butter text on butter, and no light text on butter (always `#1E1E1E`).
- No placeholder or invented metrics in copy.

---

## 8. Other palettes kept in `app/tokens.css`

Switch with the `data-theme` attribute on `<html>` in `app/layout.tsx`.

- **No attribute → Crimson dark:** bg `#101010`, crimson `#821E2A` fills, accent text `#CC4433`.
- **`data-theme="light"` → Oxblood/ivory "Split":** ivory `#FAF6EE` page, oxblood `#440512` rail and text, wine/cocoa/sand supporting colours.
