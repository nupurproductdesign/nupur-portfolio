# Nupur Gidhi — portfolio

Personal portfolio for Nupur Gidhi, product designer. Next.js (App Router) + TypeScript + plain global CSS.
**Homepage is the gallery (see "Gallery = the homepage" below).** Everything about the split-screen layout, dark themes,
nav and rail below describes the classic site, now at `/classic`.
`prototype.html` is the original vibe-coded build and the **source of truth** for layout, styling, copy and
interactions: match it exactly unless Nupur says otherwise.

**All styling must follow VISUAL-IDENTITY.md. Read it before any UI change.** (Oxblood identity, adopted 2026-10-02.)
**Theme: DARK + BUTTER (live, 2026-10-03)** — `data-theme="butter"` on <html> in `app/layout.tsx`; values in the
`[data-theme="butter"]` block of `app/tokens.css`; full spec in **VISUAL-IDENTITY.md** (rewritten for this theme).
bg `#222222`, tiles `#2E2E2E`, cards `#393939`, lines `#4A4A4A`, text `#F4F4F4`, secondary `#A8A8A8`, accent
butter `#F3DF9A` (12.0:1) with `#1E1E1E` text on butter fills (12.6:1); hover 8% darker, pressed 16% darker.
"vibe-codes" is a small butter **post-it** (the only one): square corners, no border, −3° tilt, darker curl at the
bottom, shadow under the bottom edge, nowrap, 600ms "slap on" on load, none with reduced motion.
The block below describes the crimson theme, which is what you get with no `data-theme` attribute.

**Theme: CRIMSON DARK** (2026-10-03, from a "Rauph" reference Nupur shared): near-black `#101010` + crimson.
The rail is the same near-black as the page with a thin divider. History: ivory/oxblood "Split" (kept as
`[data-theme="light"]` in `app/tokens.css`) → `#191919` + oxblood rail → warm dark `#1A1617` + peach `#FF6F61` → this.
`prototype.html` is only the reference for layout, copy and interactions, not colours/fonts.

## Working with Nupur
- She's a designer, not an engineer. Work autonomously, explain in plain language, keep replies short.
- When unsure between options, give a ranked recommendation with a one-line reason.
- **Never invent data** (metrics, dates, employers, links, emails). Leave a `TODO(nupur):` marker instead.
- Keep this file updated whenever a decision is made.

## Commands
- `npm run dev` → http://localhost:3000
- `npm run build` → production build (also type-checks)
- Chat needs `ANTHROPIC_API_KEY` in `.env.local` (see `.env.local.example`). Without it, free-text questions
  show a friendly "not switched on yet" message; the 4 suggested questions still work.

## Project map
- `app/layout.tsx` — fonts via `next/font/google` (Funnel Display, Geist), exposed as
  `--font-funnel`, `--font-geist` and consumed by `--font-display/--font-sans`.
- `app/tokens.css` — every colour, font and shared layout value. `VISUAL-IDENTITY.md` — the visual spec.
- `app/globals.css` — layout + component styles (structure from the prototype; colours only via tokens).
- `app/api/ask/route.ts` — Ask-Nupur backend (see below).
- `lib/content.ts` — **all editable copy & links**: resume URL, social links, email, experience, case tiles, canned Q&A.
- `lib/kb.ts` — chatbot system prompt + facts (server-only). Copied from the prototype's `KB`.
- `components/`
  - `Portfolio.tsx` — client shell: chat open state, scroll spy, keyboard shortcuts (Esc closes, `/` opens), `#ask` deep link
  - `TopNav.tsx`, `LeftRail.tsx` (incl. `EmailLink` popover), `WorkGrid.tsx` / `CaseTile.tsx` (CSS mock visuals),
    `About.tsx`, `Fun.tsx` / `Desk.tsx` (draggable desk, seeded canvas "paintings"), `ChatPanel.tsx`, `Colophon.tsx`

## Design system (decided)
- **Theme:** warm dark (see top). Layout follows VISUAL-IDENTITY.md; colours follow the dark palette below; fonts as listed below.
- **Tokens:** `app/tokens.css` is the ONLY place colours/fonts live. Components use ROLE tokens: page (`--bg
  --surface --surface-2 --line --text --text-muted --emph --active --headline-accent --tint --tint-2`), buttons
  (`--btn-*`), tags/popover/tooltip/chat bubble (`--tag-* --pop-* --tip-* --bubble-me-*`), rail (`--rail-bg
  --rail-border`), focus/selection, desk (`--desk-* --books-bg --spine-N --spine-N-text --origami --inks`) and
  tile mocks (`--mock-* --pill-N --sw-N --note-row-* --phone-frame --glow-N`). Dark values on `:root`, light
  values under `[data-theme="light"]`. Only exception: `themeColor` in `app/layout.tsx` (keep equal to `--bg`).
- **Palette (live):** bg `#101010`, tiles `#181818`, inner cards `#202020`, lines `#262626`/`#212121`, text
  `#F2F0EC`, secondary `#9A9A9A`. Two-tone accent, both hue 352°: **crimson `#821E2A`** (Nupur's exact hex) for FILLS only (primary buttons with white text, user chat bubble, text selection; hover `#972331`,
  pressed `#6D1923`), and **`#DB6270`** for the focus ring and small decorative bits. Status ok/amber/blue,
  desk objects and tile mocks keep their original colours.
- **Accent text = `#CC4433`** (vermilion; Nupur's exact hex, 2026-10-03; tried `#972331`, `#93032E`, `#870339`):
  active nav tab + underline, "vibe-codes", emphasis words, links. 4.0:1 on bg: **passes AA for the 36px headline
  words** (3:1 large-text rule) but **falls just short for small text** (nav tab 12px, links 13px need 4.5:1).
  The focus ring stays on `#DB6270` (5.4:1). Buttons/user bubble stay crimson `#821E2A`. Change via `--accent-text`.
- **Contrast (AA, except the small accent text noted above):** text 16.7:1; secondary 6.8 (5.8 on inner cards); `#DB6270` 5.4 on bg, 4.7 on inner cards;
  white on crimson 9.7, on hover 8.1; focus ring 5.4. Earlier fixes kept: blue pill `#959DFF`, mock button
  `#4F5DE8`, dark labels on green/accent/amber spines.
- **Fonts:** Funnel Display (headlines; chosen 2026-10-03 over Bricolage Grotesque, replaced Newsreader), Geist (everything else). "vibe-codes" is in the
  headline font, accent colour (Pinyon Script removed 2026-10-03: too many type variations). No mono, no serif. Funnel has no italic, so emphasis words ("states", "paint") are
  accent-coloured and upright. (Funnel Display has no italic.)
  Labels = `.label` class (Geist 500, uppercase, `--label-tracking` 0.14em).

## Layout (decided)
- **Top nav:** sticky, 64px at all widths (14px top/bottom padding; was 84px in the prototype, changed 2026-10-01). Left "NUPUR GIDHI" (label, scrolls to Work). Centre tabs WORK · ABOUT · FUN · RESUME ↗
  (scroll + scroll-spy highlight; Resume opens PDF in new tab, says "Soon" until the PDF exists). Right "ASK-NUPUR"
  tab with spinning conic-gradient dot; toggles chat.
- **Nav tabs:** no pills/fills. Oxblood at 82% → 100% on hover; active = 1.5px oxblood underline under the text,
  2px below it, animates in (scaleX, 300ms, from left; instant with reduced motion). Ask-Nupur nav tab has **no selected state** (Nupur will decide later what it does when open); it still
  toggles the chat. The **close (×) button lives inside the chat**, top-right of the header (20×20px, 8% oxblood circle,
  solid oxblood with cream × on hover); closing returns focus to the nav tab. Esc still closes. 2026-10-02. **Below 620px the nav is two rows** (name + Ask-Nupur, then tabs
  spread across), `--nav` = 96px.
- **Below nav:** 1 : 2 grid. Left rail sticky full-height: "● India · Open to remote" (pulsing green dot, aligned with
  first tile), headline "I'm Nupur, a product designer who *vibe-codes*" ("vibe-codes" in the accent colour, no caret), subline,
  then pushed to bottom: experience table + socials LINKEDIN · EMAIL · X.COM · GITHUB.
- **Right side scrolls:** Work (2×2 square 1:1 tiles; status (e.g. SHIPPED 2026) as a cream tag top-left of the image; caption = muted org label then the title in Geist 16px; hover lifts the inner
  visual and shows "View case study →") → About (eyebrow, serif statement, 2 paragraphs, quick facts) → Fun (intro +
  draggable desk; wraps into normal flow on mobile) → Colophon.
- **Chat mode:** grid animates to 1 : 1 : 1 — rail left, Work (1×4) + About + Fun middle, sticky chat right.
  Closing returns to 1 : 2. Below 980px the chat replaces the content full width.
- **Breakpoints:** <980px everything stacks, nav 64px, rail flows normally. <620px single-column grid, smaller tabs,
  chat tab shows only the dot.

## Case studies (4 tiles, in `lib/content.ts`)
1. A campaign management system for brand collaborations — LEHLAH • SHIPPED 2026 (main case study)
2. Bringing influencer marketing into an affiliate-first app — LEHLAH • SHIPPED 2026
3. Luna Design System, and teaching it to AI — LUNA • ONGOING
4. Agency workspaces: many brands, one login — LUNA • IN PROGRESS

Tiles use illustrative CSS mock screens until real screenshots arrive. All tiles currently link to `#work`.

### Case study page template (next to build, starting with #1)
1. Cover: title, one-line hook, hero visual · 2. Meta: role, timeline, team, tools · 3. Impact: 2–4 stat callouts,
shown early · 4. Context: short · 5. Final artifacts · 6. Key design moments: 3–5, light captions · 7. Reflections.
Principle: visuals carry the weight, copy only captions them. No long paragraphs.

### Case study 1 facts
- LehLah started in affiliate marketing, expanded into influencer marketing.
- 100+ brand partners ran paid collab and barter campaigns over WhatsApp and spreadsheets, reports built by hand.
- 600K+ creators on the app.
- Solution: bring influencer marketing into the app; digitise the campaign process; generate concise campaign
  reports; tie sales tracking to affiliate features (Auto-DM, affiliate links).
- Nupur's owned scope: the creator report UI and the creator-facing mobile paid collab flow.
- Candidate design moments: status journey (New → Application under review → Accepted → Content submitted → Payout);
  tier-based pricing validation; bulk approvals with caps; report generation with fallbacks when affiliate data is
  missing; onboarding and brand verification edge cases; effort-vs-impact campaign score as a simple visual.
- **Impact numbers pending from her manager. Never invent numbers; leave clearly marked TODOs.**

## Ask-Nupur chatbot
- Frontend (`ChatPanel.tsx`), structure modelled on a reference Nupur shared (2026-10-02):
  - **Header bar** (64px, sand line under it): "ASK-NUPUR" label + ⓘ disclaimer tooltip on the left; **reset**
    (clears the conversation, disabled when empty) and **close ×** on the right.
  - **Welcome state** (empty chat), pinned to the bottom above the input: "Welcome to Ask-Nupur." (28px display font,
    Nupur's call 2026-10-02), the subline "An AI trained on my work…" (14px), and the 4 suggested questions as
    outline chips (Nupur preferred them to "↳" rows) with fixed answers (`CANNED`). It disappears once a question is asked and returns after reset.
    The old greeting bubble ("Hi, I'm Nupur (well, the AI version)…") was dropped as redundant.
  - **Input**: blush field, sand border → oxblood on focus, 4px radius, placeholder "Ask about Nupur…", oxblood
    round send button with an up arrow (greyed until there's text). Max 400 chars.
- **Nav while chat is open:** the ASK-NUPUR tab collapses to just the spinning dot (no other selected styling).
  The nav keeps `1fr auto 1fr` down to 620px so the centred tabs never shift.
- Free text → `POST /api/ask` (`app/api/ask/route.ts`):
  - Anthropic API server-side; key only in `.env.local` / Vercel env vars, never in the browser
  - model `claude-haiku-4-5` (small, fast), `max_tokens` 350, streamed as plain text
  - last 8 turns of history; question ≤ 400 chars; validated roles/shape
  - in-memory per-IP rate limit: 8/min, 60/day (per server instance — basic, not bulletproof)
  - friendly error messages for no key / rate limit / bad input / API failure
- System prompt = `KB` in `lib/kb.ts`: first person as Nupur, 2–5 sentences, only from the facts; if not covered say
  so and point to LinkedIn; never invent metrics, dates or employers.

## Content still to come from Nupur (TODO markers in code — never fake it)
- [ ] Real case study screenshots (NDA-safe) → replace CSS mocks in `CaseTile.tsx`
- [ ] Impact numbers
- [ ] Resume PDF → `/public/resume.pdf`, then set `RESUME_URL = "/resume.pdf"` in `lib/content.ts`
- [ ] LinkedIn, X, GitHub URLs and this repo's URL → `LINKS` in `lib/content.ts`
- [ ] Email address → `EMAIL` in `lib/content.ts` (EMAIL shows the address with a copy button; built, shows
      "coming soon" until set)
- [ ] Photos of paintings, origami and real book titles for the Fun desk (`Desk.tsx`)
- [ ] Final status for case studies 3 and 4

## Known feedback to address later
- [ ] Case tiles need a one-line outcome each once numbers exist.
- [ ] "View case study" must not dead-end: link only finished studies, label the rest "coming soon".
- [ ] On mobile, show work before the experience table and links.
- [ ] Canned answer "What are your side quests?" says "the playground on the About page" — the desk now lives in
      the Fun section. Kept verbatim from the prototype; ask Nupur before changing.
- Keep accessibility: visible focus states, `prefers-reduced-motion`, semantic headings, alt text.

## Open questions for Nupur (identity rollout, 2026-10-02)
- Size tweaks kept from 2026-10-01 although VISUAL-IDENTITY.md lists the old clamps: h1 36px, subline 14px,
  experience 14px, chat heading 36px. Confirm which wins.
- Prompt said label tracking .16em and a 1px underline; the identity doc says .14em and 1.5px. Doc used.
- Photo card (B&W portrait, hover slideshow) is in the doc but not built: needs photos.
- Tile mock swatch names were changed to fit the palette (red-900, status.error…). Placeholders only.

## Deliberate differences from the prototype
- About and Fun sections, including their paragraphs, span the full content column (prototype capped them at
  760px / 36em). 2026-10-03.
- Rail headline (h1): Funnel Display 500, 32px, line-height 1.3. Nupur's call 2026-10-03 (About/Fun headings stay 36px/400).
- `--cream` is ivory `#FAF6EE` (was `#F7EDDD`); used as text on dark and on oxblood. 2026-10-02.
- About and Fun headings are a fixed 36px (rail headline is now 32px, see above) (these were
  clamp(28px,2.6vw,40px)). The chat welcome heading is 28px. Nupur's call 2026-10-02; overrides the type scale in
  VISUAL-IDENTITY.md.
- All three columns (rail, content, chat) share one top padding `--pad-top: 24px` and the same side padding
  `--g: clamp(16px,2.6vw,44px)` (16px below 980px), also used by the nav and footers. A fixed 20px was tried and
  reverted 2026-10-03 (Nupur preferred the roomier version).
- Case tiles are square 1:1 and their titles are Geist 16px (not Newsreader), Nupur's call 2026-10-03. Overrides
  VISUAL-IDENTITY.md (4:3 tiles, Newsreader titles).
- EMAIL opens a small popover with the address + Copy button instead of opening the chat (Nupur's request).
- Chat system prompt is sent as a proper `system` prompt instead of a fake first user turn.
- Next.js dev badge hidden (`devIndicators: false`).
- Headline (h1) is a fixed 36px at all widths (prototype was `clamp(38px,3.5vw,54px)`). Nupur's call, 2026-10-01.
- Subline (`.sub`) is a fixed 14px with line-height 1.3, matching the experience table (prototype was
  `clamp(16px,1.25vw,19px)`). Nupur's call, 2026-10-01/03.
- Experience table (`.exp`: years, companies, roles) is a fixed 14px (prototype was `clamp(14px,1vw,15.5px)`). Nupur's call, 2026-10-01.
- Nav blur: only the standard `backdrop-filter` is written. Writing it with a `-webkit-` copy made the build keep
  only the prefixed one, so Chrome showed no blur. 2026-10-02.
- Browser default 8px page margin removed (`html,body{margin:0}`) so rule lines run edge to edge. The prototype had it by accident. 2026-10-01.
- Rail socials and the colophon share one footer height (`--foot:64px`, matching the nav, content centred) so their top lines form one continuous rule when scrolled to the bottom. Rail and pane bottom padding set to 0 for this. 2026-10-01.
- No horizontal scroll: the closed chat column drops its 1px left border (it made the page 1px too wide), and `.shell` has `overflow-x:clip` as a safety net (clip, not hidden, so sticky still works). Checked 360–1920px, chat open and closed. 2026-10-01.
- Chat heading "Ask-Nupur" (`.ask-h h2`) is styled identically to the rail headline (36px, lh 1.08, -0.012em), and the chat subtext (`.ask-h p`) matches the rail subline (14px, lh 1.5). Nupur's call, 2026-10-01/02.

## Gallery = the homepage (`/`, started 2026-11-10)
The portfolio as a gallery room, inspired by a Framer portfolio Nupur shared (Figma-canvas UI, 3D walk-through).
**Routes (2026-11-10):** `/` = gallery (`app/page.tsx` + `app/gallery.css`). `/classic` = the original dark split-screen
site below, kept unchanged so it can be compared or reused (Nupur's choice; delete later only if she says so).
`/gallery` redirects to `/` (307, in `next.config.ts`).
- **Look (2026-11-10, Nupur: "forget the old theme, same as the video, like I'm in a Figma file"):** the gallery
  does NOT follow VISUAL-IDENTITY.md. Light Figma canvas: walls, floor and ceiling are all the same `#F5F5F5` canvas with a 40px
  `--fig-grid` dot grid, like Figma's canvas (the room is felt only through perspective, no floorboards/beams), white frames, `#1E1E1E`
  text, Geist only (no Funnel Display, no butter post-it). Figma blue `#0D99FF` for outlines/handles only (fails AA
  behind text); `#0A6DC2` for anything with text (active tab fill, size tag, selected frame name, 5.3:1 with white).
  Cursors: orange "You" `#C2410C`, purple "Nupur" `#8A3FFC`. Tokens: `--fig-*` block scoped to `.g-root` at the end
  of `app/tokens.css`. Case tiles are light too (white artboard, `#F5F5F5` tile, dark-ink pills), via a
  `.g-root .g-case` token block in `app/tokens.css`; tiles on `/classic` stay dark. `/classic` keeps the dark butter theme.
- **Flow:** intro canvas with one selected Figma text frame; the headline types itself in black, then the camera pulls
  back into the room and a "How this works" card in an envelope appears (black "Got it").
- **Room:** CSS 3D, one "camera" (`components/gallery/Gallery.tsx`). Left wall = **Work** (case tiles), front wall =
  **About** (statement, quick facts, experience, links), right wall = **Fun** (paintings, nightstand, crane). Sizes in
  `ROOM` must match `app/gallery/gallery.css`.
- **Bottom bar** (white, like the video): Work · About · Fun (active = solid blue fill, white text) + black ★
  **Ask Nupur (does nothing yet; Nupur will decide)** + ‹ n/N › counter, always in the bar so tabs never shift.
- **Moves:** tab or click a wall → turn to face it. Click a frame → step up to it (Figma selection: blue outline,
  white handles, "Hug × Hug" tag); second click reaches links inside. Arrows / scroll walk frame to frame; Esc steps back.
  Facing a wall (or a frame), a click on the empty canvas goes straight back to the doorway view, without the note
  (zoom-out cursor shows this). The note only appears on first entry. 2026-11-10.
- Headline copy is `GALLERY_HEADLINE` in `lib/content.ts` (TODO: Nupur picks the final line). About/Fun copy moved to
  `ABOUT` / `FUN` there, shared by `/` and `/gallery`.
- **Not done yet:** drag to look around; phone layout is a first pass (room is small on tall screens); real photos.

## Tools
- `node scripts/shoot-pages.mjs <outDir> [widths…]` — full screenshots (chat closed/open) + sideways-scroll check.
- `node scripts/shoot-nav.mjs <outDir>` — Playwright screenshots + measurements of the nav at 1440/820/390, WORK
  active and chat open (dev server must be running).

## Roadmap (original task list)
1. ✅ Read prototype · 2. ✅ Next.js + TS port into components · 3. ✅ Fonts via next/font · 4. ✅ This file ·
5. ✅ Dev server · 6. ⏳ Playwright screenshots at 1440 / 820 / 390 vs prototype, fix diffs · 7. ⏳ git + GitHub ·
8. ⏳ Vercel + custom domain (Nupur will give the domain)
