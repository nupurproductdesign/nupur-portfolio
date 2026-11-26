// Case study page content, keyed by the case's `slug` in lib/content.ts.
// Copy comes word for word from Nupur. Case study 1 was rewritten by her on 2026-11-26 (new direction: from an
// affiliate app to a multi-earning platform). Never rewrite or invent it.
// `visual` blocks are dashed placeholders until real images/GIFs arrive; `note` is Nupur's brief for that visual.

export type Block =
  | { kind: "p"; text: string }
  | { kind: "lead"; text: string } // a bold line from the doc, shown as an emphasised takeaway
  | { kind: "visual"; label: string; note?: string; wide?: boolean }
  | { kind: "stats"; items: { value: string; label: string }[] }
  | { kind: "products"; items: { name: string; text: string }[] }
  // a before/after diagram: two rows of steps joined by arrows, `who` says who drives each journey
  | { kind: "beforeAfter"; before: { who: string; steps: string[] }; after: { who: string; steps: string[] } }
  // a two-column comparison table, e.g. "What I observed" → "How I applied it"
  | { kind: "table"; head: [string, string]; rows: [string, string][] };

export type Part = {
  eyebrow?: string; // small caps label, e.g. "THE PROBLEM"
  heading?: string; // optional: a section can be just blocks (e.g. the impact numbers)
  blocks?: Block[];
  subs?: { heading: string; blocks: Block[] }[]; // sub-sections (core flows, design decisions)
  split?: boolean; // two columns: visual left, text right, one row per flow
  muted?: boolean; // grey (#7E7E7E) paragraphs, like the App side core flows
};

export type CaseStudyContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  hero?: { mp4: string; webm?: string; poster: string }; // looping 16:9 clip in place of the hero placeholder
  meta: { k: string; v: string[] }[]; // each value line on its own row
  ownership: string;
  parts: Part[];
};

const creatives = (label = "Creatives"): Block => ({ kind: "visual", label });

export const CASE_CONTENT: Record<string, CaseStudyContent> = {
  "campaign-management": {
    eyebrow: "LehLah",
    title: "From an affiliate app to a multi-earning platform",
    subtitle:
      "Introducing Influencer Marketing on LehLah app and redesigning the app to accommodate multiple ways for creators to earn.",
    // same flow as the Work tile clip, made 16:9 (from Nupur's Figma "Case study thumbnail" section)
    hero: { mp4: "/work/campaign-management/hero.mp4", webm: "/work/campaign-management/hero.webm", poster: "/work/campaign-management/hero-poster.jpg" },
    meta: [
      { k: "Role", v: ["Product Designer"] },
      { k: "Timeline", v: ["March-April 2026"] },
      { k: "Team", v: ["1 Product Manager", "2 Product Designers", "3 Engineers"] },
    ],
    ownership:
      "I led the end-to-end creator-facing Paid Collaborations experience and worked on restructuring the LehLah app to accommodate both Affiliate and Influencer Marketing.",
    parts: [
      {
        eyebrow: "The context",
        heading: "LehLah wasn't always a place for brand collaborations",
        blocks: [
          { kind: "p", text: "LehLah started as an affiliate marketing platform where content creators could earn commissions by recommending products to their audience on Instagram and YouTube." },
          { kind: "p", text: "The app was built around this earning model, with features like Product Link Generator, Auto-DM, Collections and performance insights." },
          { kind: "visual", wide: true, label: "The old LehLah app" },
          { kind: "p", text: "While affiliate marketing was our primary business, LehLah was also managing paid brand collaborations manually." },
        ],
      },
      {
        eyebrow: "The problem",
        heading: "100 creators. 200 pieces of content. One brand collaboration.",
        blocks: [
          { kind: "p", text: "A haircare brand approached LehLah with a request of running a campaign with 100 creators delivering 200 content pieces on Instagram. But getting this done involved much more than finding 100 creators." },
          { kind: "p", text: "One person from LehLah's execution team could be coordinating with 50-100 creators at different stages of multiple campaigns at the same time. Briefs, negotiations, drafts, content links and payment details moved between conversations and spreadsheets." },
          { kind: "lead", text: "The challenge wasn't running one campaign. It was repeating this process every time a new brand came in." },
        ],
      },
      {
        eyebrow: "The opportunity",
        heading: "We had the creators. We had the brands. What was missing?",
        blocks: [
          { kind: "p", text: "Creators have been using LehLah App to earn money by recommending products through affiliate links. At the same time, LehLah had built relationships with brands by managing paid collaborations manually." },
          { kind: "lead", text: "We saw an opportunity to bring the entire collaboration journey into one connected system." },
          { kind: "p", text: "For creators, this meant being able to discover and apply for collaborations that matched their interests, profile and expected payment — instead of waiting for someone to contact them." },
          {
            kind: "beforeAfter",
            before: { who: "LehLah team", steps: ["LehLah team finds creators", "Contacts them", "Coordinates the campaign"] },
            after: { who: "creators", steps: ["Creators discover opportunities", "Choose collaborations", "Apply directly"] },
          },
        ],
      },
      {
        eyebrow: "The solution",
        heading: "A new way to earn. A redesigned LehLah experience.",
        blocks: [
          { kind: "p", text: "Rather than introducing Paid Collaborations as just another feature, we restructured the app to accommodate both business verticals." },
          {
            kind: "products",
            items: [
              { name: "Affiliate", text: "Creators earn commissions when someone purchases a product through their affiliate links." },
              { name: "Collabs", text: "Creators earn by partnering with brands and creating content for them." },
            ],
          },
          { kind: "visual", wide: true, label: "Before and after app structure" },
          { kind: "p", text: "The changes extended beyond the navigation. We redesigned the homepage, introduced the Talent Card, built the Paid Collaborations journey and brought earnings from both verticals together." },
        ],
      },
      // impact numbers: a section of their own, named but with no heading
      {
        eyebrow: "The impact",
        blocks: [
          {
            kind: "stats",
            items: [
              { value: "1000+", label: "Creators participating" },
              { value: "3000+", label: "Applications per month" },
              { value: "75+", label: "Campaigns" },
            ],
          },
        ],
      },
      {
        eyebrow: "Core flows",
        split: true,
        heading: "A homepage for both earning experiences",
        blocks: [
          { kind: "p", text: "The redesigned homepage gives creators access to their Talent Card, earnings, frequently used features and recommended opportunities." },
          creatives("Redesigned homepage"),
        ],
        subs: [
          {
            heading: "Giving Affiliate and Collabs their own space",
            blocks: [
              { kind: "p", text: "Two dedicated tab screens in the app allow creators to explore different earning opportunities." },
              { kind: "p", text: "The Affiliate section brings together existing affiliate features, while the Collabs section introduces opportunities such as Paid Collabs, Barter and UGC campaigns." },
              creatives("Affiliate and Collabs screens"),
            ],
          },
          {
            heading: "Introducing the Talent Card",
            blocks: [
              { kind: "p", text: "A Talent Card works like a creator's resume. It includes their content niche, audience details, social engagement and previous brand collaborations." },
              { kind: "p", text: "Creators can build their Talent Card during onboarding and update it as their profile grows." },
              creatives("Talent Card creation flow"),
            ],
          },
          {
            heading: "What if creators could discover opportunities themselves?",
            blocks: [
              { kind: "p", text: "Brands set requirements based on the type of content creators they need, including their niche, audience and Instagram profile." },
              { kind: "p", text: "Creators can then discover opportunities that match their profile and apply for the ones they're interested in." },
              creatives("Paid Collab discovery and application"),
            ],
          },
          {
            heading: "One page for campaign details and next steps",
            blocks: [
              { kind: "p", text: "Applying for a collaboration is only the beginning - once selected, creators need to follow brand guidelines, publish content, submit it and track their payment." },
              { kind: "p", text: "I designed the campaign page to bring all this information together." },
              creatives("Different states of the campaign page"),
            ],
          },
          {
            heading: "Connecting affiliate with Paid Collaborations",
            blocks: [
              { kind: "p", text: "For campaigns involving Instagram Reels and posts, creators integrate Auto-DM to automatically share product affiliate links with interested viewers." },
              { kind: "p", text: "This allows creators to track the sales generated through their campaign content and earn affiliate commissions where applicable." },
              creatives("Auto-DM integration flow"),
            ],
          },
          {
            heading: "Bringing all earnings together",
            blocks: [
              { kind: "p", text: "The Wallet brings together earnings from Affiliate and Collabs, allowing creators to view their lifetime earnings, individual earning breakdowns and manage withdrawals in one place." },
              creatives("Redesigned Wallet"),
            ],
          },
        ],
      },
      {
        eyebrow: "Design decisions and trade-offs",
        heading: "Designing for a diverse creator base",
        blocks: [
          { kind: "p", text: "With the introduction of Influencer Marketing, we wanted LehLah to appeal to premium creators who the brands would want to work with while remaining accessible to our existing creator base, largely from Tier 2 and Tier 3 cities who focus more on Affiliate for their earnings. The challenge was to create a design language that felt premium without compromising ease of use." },
          { kind: "p", text: "While exploring products beyond the creator economy, I studied Uber's product experience. Despite catering to a diverse audience, Uber strikes a balance between a premium look and feel and ease of use." },
          { kind: "p", text: "I drew inspiration from its visual hierarchy, modular layouts and intuitive feature discovery to establish a new design language for LehLah. The goal was to make LehLah feel aspirational for new creators and approachable for existing ones." },
          { kind: "visual", wide: true, label: "Uber and LehLah homepage" },
          {
            kind: "table",
            head: ["What I observed", "How I applied it"],
            rows: [
              ["Modular service tiles", "Quick access to earning features"],
              ["Clear visual hierarchy", "Prioritizing information on top-level screens"],
              ["Consistent design patterns across services", "A cohesive experience across both business verticals"],
            ],
          },
        ],
        subs: [
          {
            heading: "Giving Paid Collaborations its own space",
            blocks: [
              { kind: "p", text: "LehLah already had an affiliate business where creators earned commissions by recommending products. With Paid Collaborations, we were introducing a whole new vertical to earn through brand partnerships. But not every creator prefers the same way of earning. Some prefer paid brand collaborations, while others focus on affiliate commissions." },
              { kind: "lead", text: "We separated Affiliate and Collabs in the app navigation to make both earning options easy to discover and access." },
              { kind: "p", text: "This helped creators understand the different ways they could earn money on LehLah and choose what worked best for them." },
              { kind: "visual", wide: true, label: "Old vs. new navigation" },
            ],
          },
          {
            heading: "Moving away from an affiliate-first homepage",
            blocks: [
              { kind: "p", text: "The earlier homepage was largely focused on affiliate performance, earnings and features. With the introduction of Influencer Marketing, the homepage needed to be equally relevant to creators who preferred brand collaborations." },
              { kind: "lead", text: "We redesigned the homepage around two priorities — the creator's Talent Card and quick access to features across both verticals." },
              { kind: "p", text: "Instead of making affiliate performance the primary focus, we gave creators access to their profile, overall earnings and relevant opportunities." },
              { kind: "visual", wide: true, label: "Homepage before and after" },
            ],
          },
          {
            heading: "Making the Talent Card part of the application",
            blocks: [
              { kind: "p", text: "A Talent Card works like a creator's resume, giving brands relevant information about the creator and their audience." },
              { kind: "lead", text: "We made completing the Talent Card a requirement before applying for Paid Collabs, so creators could be matched with opportunities suited to their profiles." },
              { kind: "p", text: "It also gave brands the information they needed to review and shortlist creators. While this added an extra step to the application process, it helped ensure that brands had the necessary information to evaluate applications." },
              { kind: "visual", wide: true, label: "Application flow with Talent Card" },
            ],
          },
          {
            heading: "Making every application status clear",
            blocks: [
              { kind: "p", text: "With less direct communication between the LehLah team and creators, it became important for creators to know where they stood in a campaign — whether their application was under review, approved or rejected. Once approved, they also needed to know how far they'd progressed and what to do next." },
              { kind: "lead", text: "We introduced clear application statuses and a step-by-step progress indicator to show what was completed, what was pending and what came next." },
              { kind: "visual", wide: true, label: "Application statuses and progress indicator" },
            ],
          },
          {
            heading: "One collab details page for everything",
            blocks: [
              { kind: "p", text: "A paid collaboration involves multiple steps, and creators often need to switch between Instagram and LehLah to complete them." },
              { kind: "p", text: "With less manual guidance from the LehLah team, splitting campaign information and tasks across different pages could make it harder for creators to keep track of what to do next." },
              { kind: "lead", text: "We decided to keep campaign details, progress and next actions on one page, so creators could return to the same place at any stage without having to figure out where to go next." },
              { kind: "visual", wide: true, label: "Annotated campaign page" },
            ],
          },
          {
            heading: "Connecting two different ways to earn",
            blocks: [
              { kind: "p", text: "Although Affiliate and Paid Collaborations had their own spaces in the app, they didn't need to work independently. A creator participating in a paid collaboration was already recommending a product to their audience." },
              { kind: "lead", text: "By integrating affiliate links into the Paid Collab journey, we gave creators an opportunity to earn beyond their collaboration fee." },
              { kind: "p", text: "It also allowed brands to track the sales generated through campaign content wherever affiliate tracking was available." },
              { kind: "visual", wide: true, label: "How both earning models work together" },
            ],
          },
        ],
      },
      {
        eyebrow: "What we didn’t include in this version",
        heading: "No price negotiations or draft approvals",
        blocks: [
          { kind: "p", text: "For the first version, our priority was creator adoption to discover and apply for paid collaborations. To keep the experience focused, we decided to leave price negotiations and content draft approvals for future versions." },
          { kind: "lead", text: "This allowed us to focus on the core journey first: Discover → Apply → Get selected → Complete the collaboration." },
        ],
      },
      {
        eyebrow: "Key takeaways",
        heading: "Introducing a new feature sometimes means rethinking the entire product",
        blocks: [
          { kind: "p", text: "What started as introducing Paid Collaborations into the app turned into a larger exercise of rethinking the navigation, homepage, creator profiles and earnings experience." },
          { kind: "p", text: "The challenge was not just designing a new way for creators to earn, but making sure it worked alongside the experience they were already familiar with." },
          { kind: "lead", text: "This project helped me understand how a business decision can influence the entire product experience, and how design can bring both together without adding unnecessary complexity." },
        ],
      },
    ],
  },
};
