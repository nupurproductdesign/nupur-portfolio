// All site copy and links live here, so content edits never touch components.
// Anything marked TODO is still to come from Nupur. Never replace a TODO with invented data.

// TODO(nupur): add /public/resume.pdf, then set this to "/resume.pdf".
export const RESUME_URL = "";

// TODO(nupur): real profile links. Empty string = link not added yet.
export const LINKS = {
  linkedin: "https://www.linkedin.com/", // TODO(nupur): your LinkedIn profile URL
  x: "https://x.com/", // TODO(nupur): your X profile URL
  github: "https://github.com/", // TODO(nupur): your GitHub profile URL
  source: "https://github.com/", // TODO(nupur): this repo's URL once it's on GitHub
};

// Contact email (Nupur, 2026-11-10): "Say Hi!" in the gallery, the About wall links, the classic site's Email popover.
export const EMAIL = "nupur.productdesign@gmail.com";

export const EXPERIENCE = [
  { year: "2025", yearSuffix: " - Present", company: "LehLah", role: "Product Designer" },
  { year: "2024", company: "Design Duh!", role: "Product Designer" },
  { year: "2024", company: "Credain", role: "Associate - UI Intern" },
];

export type CaseKind = "campaigns" | "phone" | "tokens" | "workspaces";

export type CaseStudy = {
  kind: CaseKind;
  org: string;
  status: string; // TODO(nupur): final status for Luna cases 3 and 4
  title: string;
  glow: string; // soft radial tint at the tile bottom (theme token)
  href: string; // "#work" until the case study page exists, then "/work/<slug>"
  slug?: string; // set once the case study has a page at /work/<slug>
  // TODO(nupur): one-line outcome per tile once impact numbers exist
};

export const CASES: CaseStudy[] = [
  { kind: "campaigns", org: "LehLah", status: "Shipped 2026", title: "A campaign management system for brand collaborations", glow: "var(--glow-1)", href: "/work/campaign-management", slug: "campaign-management" },
  { kind: "phone", org: "LehLah", status: "Shipped 2026", title: "Bringing influencer marketing into an affiliate-first app", glow: "var(--glow-2)", href: "#work" },
  { kind: "tokens", org: "Luna", status: "Ongoing", title: "Luna Design System, and teaching it to AI", glow: "var(--glow-3)", href: "#work" },
  { kind: "workspaces", org: "Luna", status: "In progress", title: "Agency workspaces: many brands, one login", glow: "var(--glow-4)", href: "#work" },
];

// Suggested-question chips. Fixed answers, copied from the prototype.
export const CANNED: Record<string, string> = {
  "What do you work on?":
    "I'm a product designer at LehLah, a B2B influencer marketing platform. I design across Luna, the tool 100+ brands use to run campaigns, and the creator app used by 600K+ creators. Lately I'm also shipping frontend, not just mockups.",
  "Walk me through a case study":
    "My favourite is the campaign management system. Brands ran paid collabs over WhatsApp and spreadsheets, with reports stitched together by hand. We moved it into the product with a tracked journey from application to payout and auto-generated reports. I owned the creator report UI and the creator-side mobile flow.",
  "How do you work with engineers?":
    "Closely, and in tokens. I align prototypes to the Luna Design System, swap hardcoded styles for semantic tokens and write developer-ready handoff docs. I also built a Claude skill that encodes our design system, so new work starts on-system.",
  "What are your side quests?":
    "Painting, origami and books. Check the playground on the About page, you can drag everything around.",
};

// ---------- Gallery (/gallery) ----------
// TODO(nupur): final headline. The gallery intro types `lead` + `note` as one line.
export const GALLERY_HEADLINE = { lead: "Nupur is a Product Designer who", note: "Vibe Codes" };

// About copy, shared by the About section on / and the About wall in /gallery.
// `statement` is split so the emphasis word can be picked out in the accent colour.
export const ABOUT = {
  statement: { before: "I like the unglamorous middle of products: the ", em: "states", after: ", the edge cases, the handoff." },
  paragraphs: [
    "At LehLah I design across Luna, the tool brands use to run influencer campaigns, and the creator app where influencers find and deliver them. I write the UX copy, map the status trees, argue for the empty states and stay close to engineering until it ships.",
    "Lately that closeness has turned into code. I vibe-code my prototypes, and I encoded our design system as a Claude skill so new screens start from real tokens instead of guesswork.",
  ],
  facts: [
    { k: "Now", v: "Product Designer, LehLah" },
    { k: "Focus", v: "B2B SaaS, design systems" },
    { k: "Toolkit", v: "Figma, code, Claude" },
  ],
};

// Fun copy, shared by the Fun section on / and the Fun wall in /gallery.
export const FUN = {
  statement: { before: "Off the clock I ", em: "paint", after: ", fold paper and read." },
  paragraph:
    "Side quests that keep my hands busy and my eye honest. Same instincts as the day job: patience, constraints, one clean fold at a time.",
};
