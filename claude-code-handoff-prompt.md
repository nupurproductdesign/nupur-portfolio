# Prompt for Claude Code: Nupur Gidhi's portfolio

Paste everything below the line into Claude Code, from inside an empty folder (e.g. `portfolio/`). Put `prototype.html` (the current build, attached with this prompt) in that folder first.

---

I'm Nupur Gidhi, a product designer. I've been designing and vibe-coding my portfolio in a prototype, and I want to continue here so I can ship it to a real domain. The current build is `prototype.html` in this folder. It's the source of truth for layout, styling, copy and interactions: match it exactly unless I say otherwise.

I'm a designer, not an engineer. Work autonomously, explain things in plain language, keep replies short, and when you're unsure between options give me a ranked recommendation with a one-line reason.

## Your first tasks (in order)

1. **Read `prototype.html` fully.**
2. **Set up the project:** Next.js (App Router) + TypeScript, plain CSS or CSS Modules. No Tailwind unless you ask me first. Port the prototype into components so it looks and behaves the same:
   - `TopNav`
   - `LeftRail`
   - `WorkGrid` / `CaseTile`
   - `About`
   - `Fun` / `Desk`
   - `ChatPanel`
   - `Colophon`
3. **Load the fonts** with `next/font/google`: Newsreader, Geist, Geist Mono.
4. **Write a `CLAUDE.md`** at the repo root with everything in this prompt (decisions, tokens, content, to-dos) so any future session or account can pick up from it. Keep it updated as we make decisions.
5. **Run the dev server** and tell me the local URL.
6. **Check responsiveness:** screenshot desktop (1440), tablet (820) and phone (390) with Playwright, compare against the prototype, and fix differences.
7. **Initialise git** and help me create a GitHub repo and push.
8. **Help me deploy to Vercel** and connect a custom domain. I'll tell you the domain.

## Design system (already decided)

- **Theme:** single dark theme, deliberately (no light mode for now).
- **Colour tokens:** `--bg:#1B1B1B` `--tile:#222222` `--tile-2:#2A2A2A` `--line:#2F2F2F` `--rule:#383838` (divider lines) `--ink:#F2F0EC` `--muted:#A6A39E` `--faint:#6E6C68` `--rose:#C9585E` (accent). Status colours: ok `#6FCF97`, amber `#E9B454`, blue `#8C95FF`, each with a ~13% alpha "soft" background.
- **Type roles:**
  - Newsreader (serif): headline and section headings. The accent word is italic in rose.
  - Geist (sans): body text.
  - Geist Mono (uppercase, letter-spacing .02em): nav tabs, captions, labels.
- **Lines:** thin `--rule` lines give a grid feel:
  - under the nav
  - between the left rail and the right side
  - between sections
  - above the social links (full width of the rail)
  - on the chat column's left edge
  Inspired by katherine-le.com.

## Layout (already decided)

**Top nav:** sticky, 84px tall, three parts:
- Left: "NUPUR GIDHI", uppercase mono like the tabs. Clicking it scrolls to Work.
- Centre: tabs WORK · ABOUT · FUN · RESUME ↗. They scroll to sections and highlight based on scroll position. Resume opens the PDF in a new tab.
- Right: an "ASK-NUPUR" tab with a small spinning conic-gradient dot. Clicking it opens the chat and the tab shows an active background plus a × icon. Clicking again closes it. Esc closes it and "/" opens it.

**Below the nav:** a 1 : 2 grid (33.3% / 66.6%).
- **Left rail**, sticky, full height under the nav:
  - "● India · Open to remote" (sentence case, pulsing green dot), top-aligned with the first case tile
  - Headline: "I'm Nupur, a product designer who *vibe-codes*" (italic rose, blinking caret)
  - Subline: "Designing B2B tools used by 100+ brands at LehLah — now shipping the frontend, not just the mockups"
  - Pushed to the bottom: an experience table (2025–Present · LehLah · Product Designer / 2024 · Design Duh! · Product Designer / 2024 · Credain · Associate - UI Intern), then socials LINKEDIN · EMAIL · X.COM · GITHUB
- **Right side:** the only thing that scrolls:
  1. **Work:** 2×2 grid of square case tiles. Each has a mono caption like "LEHLAH • SHIPPED 2026" (rose bullet) and a muted title line. On hover the tile's inner visual lifts and a "View case study →" row appears.
  2. **About:** eyebrow, serif statement, two paragraphs, quick facts row.
  3. **Fun:** intro and a draggable "desk" (sticky note, paintings, book spines, origami crane). On mobile the desk items wrap into a normal flow.
  4. **Colophon:** "Wireframed in Figma, vibe-coded with Claude, shipped by me." plus "View this site's source ↗".

**Chat mode:** opening Ask-Nupur animates the grid to 1 : 1 : 1.
- Rail stays on the left.
- Work (now a 1×4 single column) plus About and Fun sit in the middle.
- The chat panel is sticky in the third column.
- Closing returns to 1 : 2.
- On mobile (<980px) the chat replaces the content full width.

**Breakpoints:**
- Below 980px: everything stacks. Nav stays sticky at 64px and the rail flows normally.
- Below 620px: single-column grid, smaller tabs, the chat tab shows only the dot.

## Case studies (4 tiles)

1. **A campaign management system for brand collaborations.** LEHLAH • SHIPPED 2026. The main case study; source doc details below.
2. **Bringing influencer marketing into an affiliate-first creator app.** LEHLAH • SHIPPED 2026.
3. **Luna Design System, and teaching it to AI.** LUNA • ONGOING.
4. **Agency workspaces: many brands, one login.** LUNA • IN PROGRESS.

The tiles currently use illustrative CSS mock screens. I will replace them with real screenshots.

**Case study page template** (to build next, starting with #1). Section order:
1. Cover: title, one-line hook, hero visual
2. Meta: role, timeline, team, tools
3. Impact: 2–4 stat callouts, shown early
4. Context: short
5. Final artifacts
6. Key design moments: 3–5, light captions
7. Reflections

Principle: visuals carry the weight, copy only captions them. No long paragraphs.

**Case study 1 facts:**
- LehLah started in affiliate marketing and expanded into influencer marketing.
- 100+ brand partners ran paid collab and barter campaigns over WhatsApp and spreadsheets, with reports built by hand.
- 600K+ creators are on the app.
- Solution:
  - bring influencer marketing into the app
  - digitise the campaign process
  - generate concise campaign reports
  - tie sales tracking to affiliate features (Auto-DM, affiliate links)
- My owned scope: the creator report UI and the creator-facing mobile paid collab flow.
- Candidate design moments:
  - status journey (New → Application under review → Accepted → Content submitted → Payout)
  - tier-based pricing validation
  - bulk approvals with caps
  - report generation with fallbacks when affiliate data is missing
  - onboarding and brand verification edge cases
  - an effort-vs-impact campaign score shown as a simple visual
- Impact numbers are pending from my manager. Never invent numbers; leave clearly marked TODOs.

## Ask-Nupur chatbot

- **Frontend:** as in the prototype, a chat log with suggested-question chips and an input. The four suggested questions have fixed pre-written answers (copy them from the prototype's `CANNED` object).
- **Free-text questions:** the prototype used a preview-only API (`window.claude.use('sample')`). Replace it with a Next.js route handler (`app/api/ask/route.ts`) that calls the Anthropic API server-side, with:
  - `ANTHROPIC_API_KEY` in `.env.local` and in Vercel env vars; never exposed to the browser
  - a small, fast model
  - streaming responses
  - short max tokens
  - basic rate limiting per IP
  - input length limits
  - a friendly error message
- **Instructions and facts:** use the prototype's `KB` text as the system prompt: answer in first person as me, in 2–5 sentences, only from the facts. If something isn't covered, say so and point to LinkedIn. Never invent metrics, dates or employers.

## Content still to come from me (use TODO markers, never fake data)

- Real case study screenshots (NDA-safe)
- Impact numbers
- Resume PDF (`/public/resume.pdf`)
- LinkedIn, email, X and GitHub links. EMAIL must show my address with a copy button, not open the chat.
- Photos of my paintings, origami and real book titles for the Fun desk
- Final status for case studies 3 and 4

## Known feedback to address later

- Case tiles need a one-line outcome each once numbers exist.
- "View case study" must not dead-end: link only finished studies and label the rest "coming soon".
- Raise the contrast of `--faint` text to pass WCAG AA.
- On mobile, show work before the experience table and links.
- Keep accessibility: visible focus states, `prefers-reduced-motion`, semantic headings, alt text.

Start with task 1 and tell me when the dev server is running.
