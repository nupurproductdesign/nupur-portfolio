// Case study page content, keyed by the case's `slug` in lib/content.ts.
// Copy comes word for word from Nupur's "Case Studies" Google Doc. Never rewrite or invent it.
// `visual` blocks are dashed placeholders until real images/GIFs arrive; `note` is Nupur's brief for that visual.

export type Block =
  | { kind: "p"; text: string }
  | { kind: "lead"; text: string } // a bold line from the doc, shown as an emphasised takeaway
  | { kind: "visual"; label: string; note?: string; wide?: boolean }
  | { kind: "stats"; items: { value: string; label: string }[] }
  | { kind: "products"; items: { name: string; text: string }[] }
  // a before/after diagram: two rows of steps joined by arrows, `who` says who drives each journey
  | { kind: "beforeAfter"; before: { who: string; steps: string[] }; after: { who: string; steps: string[] } };

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
    title: "One place to run Brand Collaborations",
    subtitle:
      "Designing how creators discover and manage paid collaborations, while helping shape a connected platform for brands to run campaigns and understand their results.",
    // same flow as the Work tile clip, made 16:9 (from Nupur's Figma "Case study thumbnail" section)
    hero: { mp4: "/work/campaign-management/hero.mp4", webm: "/work/campaign-management/hero.webm", poster: "/work/campaign-management/hero-poster.jpg" },
    meta: [
      { k: "Role", v: ["Product Designer"] },
      { k: "Timeline", v: ["March-April 2026"] },
      { k: "Team", v: ["1 Product Manager", "2 Product Designers", "3 Engineers"] },
    ],
    ownership:
      "I led the end-to-end creator-facing Paid Collaborations experience on the LehLah mobile app. Collaborated with the team on design decisions for the brand-facing campaign-management platform and Campaign Reports.",
    parts: [
      {
        eyebrow: "The problem",
        heading: "100 creators. 200 pieces of content. One brand collaboration.",
        blocks: [
          { kind: "p", text: "A haircare brand approached LehLah with a request of running a campaign with 100 creators delivering 200 content pieces on Instagram. But getting this done involved much more than finding 100 creators." },
          { kind: "p", text: "One person from LehLah execution team could be coordinating with 50-100 creators at different stages of multiple campaigns at the same time. Briefs, negotiations, drafts, content links and payment details moved between conversations and spreadsheets." },
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
        heading: "Two experiences. One connected campaign.",
        blocks: [
          { kind: "p", text: "Our team worked on two interconnected products:" },
          {
            kind: "products",
            items: [
              { name: "LehLah App (Mobile)", text: "Helping creators discover paid opportunities, apply, complete their tasks and track their progress." },
              { name: "LehLah for Brands (Desktop)", text: "Helping brands and the LehLah team create campaigns, find creators, manage progress and analyze results." },
            ],
          },
          { kind: "lead", text: "My primary ownership was the creator-facing Paid Collaborations journey, from discovering a campaign to completing its requirements. I also contributed to design decisions for Campaign Reports and the broader brand-facing platform." },
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
              { value: "400+", label: "Reports generated" },
            ],
          },
        ],
      },
      {
        eyebrow: "App side core flows",
        split: true,
        heading: "What if creators could discover opportunities themselves?",
        blocks: [
          { kind: "p", text: "Brands set requirements based on the type of content creators they need, including their niche, audience and Instagram profile. Creators can then discover opportunities that match their profile and apply for the ones they're interested in." },
          creatives(),
        ],
        subs: [
          {
            heading: "One page for campaign details and next steps",
            blocks: [
              { kind: "p", text: "A single page view for the creators where they can see brand requirements, content guidelines, timelines, their current progress and the next action they need to take." },
              { kind: "p", text: "The page updates as creators move through the collaboration, from applying and getting approved to submitting content and tracking performance." },
              creatives(),
            ],
          },
          {
            heading: "Connecting content with sales",
            blocks: [
              { kind: "p", text: "After getting approved, creators can connect their Instagram Reels or posts to LehLah's Auto-DM feature." },
              { kind: "p", text: "Auto-DM automatically shares product links with interested viewers who comment selected keyword, allowing creators to earn commissions and track sales generated through their content." },
              creatives(),
            ],
          },
        ],
      },
      {
        eyebrow: "Brand side core flows",
        muted: true,
        heading: "Two simple questions : What did the brand invest? What did the brand get back?",
        blocks: [
          { kind: "p", text: "Instead of introducing brands to a wall of metrics, the team organized the experience around the relationship between investment and results along with a unique score algorithm to summarize the overall performance of the collaboration." },
          creatives(),
        ],
        subs: [
          {
            heading: "Who are the top contributors of campaign success",
            blocks: [
              { kind: "p", text: "Not every creator contributes in the same way. Some might reach the largest audience. Others get more engagement or generate more sales.\nWe included creator-level comparisons to help brands identify who performed best across these different areas." },
              creatives(),
            ],
          },
          {
            heading: "Affiliate helping track sales generated by the creators",
            blocks: [
              { kind: "p", text: "Since creators integrate affiliate with every instagram reel and post, brands can also see sales attributed to tracked content across supported marketplaces. This helps brands understand not just how their content performed on Instagram, but also how it contributed to product sales." },
              creatives(),
            ],
          },
        ],
      },
      {
        eyebrow: "Design decisions and trade-offs",
        heading: "Giving Paid Collaborations its own space",
        blocks: [
          { kind: "p", text: "LehLah already had an affiliate business where creators earned commissions by recommending products. With Paid Collaborations, we were introducing a whole new vertical to earn through brand partnerships. But not every creator prefers the same way of earning. Some prefer paid brand collaborations, while others focus on affiliate commissions." },
          { kind: "lead", text: "We separated Affiliate and Collabs in the app navigation to make both earning options easy to discover and access." },
          { kind: "p", text: "This helped creators understand the different ways they could earn on LehLah and choose what worked best for them." },
        ],
        subs: [
          {
            heading: "Keeping everything in one place",
            blocks: [
              { kind: "p", text: "A paid collaboration involves multiple steps, and creators often need to switch between Instagram and LehLah to complete them." },
              { kind: "p", text: "With less manual guidance from the LehLah team, splitting campaign information and tasks across different pages could make it harder for creators to keep track of what to do next." },
              { kind: "lead", text: "We decided to keep campaign details, progress and next actions on one page, so creators could return to the same place at any stage without having to figure out where to go next." },
            ],
          },
          {
            heading: "Bringing affiliate links into Paid Collaborations",
            blocks: [
              { kind: "p", text: "We added Auto-DM connection as a part of the content submission step making it mandatory for Instagram reels and posts. For Instagram story as a deliverable, an additional step was introduced to generate affiliate links before uploading the content so that creators can tag products in their stories." },
              { kind: "lead", text: "This helped creators to track and earn from product sales where applicable and brands to track product sales across various marketplaces." },
            ],
          },
          {
            heading: "Making every application status clear",
            blocks: [
              { kind: "p", text: "With less direct communication between the LehLah team and creators, it became important for creators to know where they stood in a campaign — whether their application was under review, approved or rejected. Once approved, they also needed to know how far they'd progressed and what to do next." },
              { kind: "lead", text: "We introduced clear application statuses and a step-by-step progress indicator to show what was completed, what was pending and what came next." },
            ],
          },
          {
            heading: "Making the Talent Card part of the application",
            blocks: [
              { kind: "p", text: "A Talent Card works like a creator's resume- it includes their content niche, audience details, social engagement and previous brand collaborations." },
              { kind: "lead", text: "We made completing the Talent Card a requirement before applying for Paid Collabs, so creators could be matched with opportunities suited to their profiles." },
              { kind: "p", text: "It also helped brands to review relevant creator information while shortlisting applicants." },
            ],
          },
          {
            heading: "Making Campaign Reports easier to understand",
            blocks: [
              { kind: "p", text: "Reporting tools like Qoruz, HypeAuditor and CultureX were already being used for creator discovery and performance analysis." },
              { kind: "p", text: "We wanted to bring reporting into the same platform where campaigns were managed, while making the results easier to understand –" },
              { kind: "lead", text: "Instead of only showing numbers, we added comparisons, creator rankings and the Effort vs. Impact view to help brands interpret campaign performance." },
            ],
          },
          {
            heading: "Working around missing data",
            blocks: [
              { kind: "p", text: "Not every creator participating in a campaign was connected to LehLah. This meant some performance data might not be available. We also had to consider creator permissions and technical limitations." },
              { kind: "p", text: "These constraints shaped our discussions with the business and engineering teams about which metrics we could reliably show." },
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
        heading: "Designing one experience meant thinking about everyone involved",
        blocks: [
          { kind: "lead", text: "My biggest learning was understanding how a simple action on the creator app could affect the entire campaign." },
          { kind: "p", text: "Creators needed clear steps and updates. The LehLah team needed to manage many creators at different stages. Brands needed to understand what their investment achieved. Working across these connected experiences helped me think beyond individual screens and understand how different parts of a product work together." },
        ],
      },
    ],
  },
};
