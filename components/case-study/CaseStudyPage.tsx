import Link from "next/link";
import type { CaseStudy } from "@/lib/content";

// A case study page: the gallery's dot-grid canvas with one big Figma frame (80vw) that reads like a page.
// Sections follow the case study template in CLAUDE.md. Everything except the title, org and status is a labelled
// placeholder for now. TODO(nupur): real content, visuals and impact numbers (never invent them).
export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const back = `/#work/${study.slug}`; // the gallery reopens on this case study's frame, without the intro
  return (
    <div className="cs-root">
      <header className="cs-crumb">
        {/* "Nupur Gidhi" goes back to the room's doorway view, without the intro */}
        <Link href="/#room">Nupur Gidhi</Link>
        <span aria-hidden="true">/</span>
        <Link href={back}>Work</Link>
        <span aria-hidden="true">/</span>
        <span className="cs-here">{study.org}</span>
      </header>

      <main className="cs-wrap">
        <span className="cs-name">{study.org} / {study.title}</span>
        {/* the page is a selected Figma frame: blue outline, corner handles and size tag, like the gallery's frames */}
        <article className="cs-frame is-sel">
          <i className="cs-hdl tl" aria-hidden="true" /><i className="cs-hdl tr" aria-hidden="true" />
          <i className="cs-hdl bl" aria-hidden="true" /><i className="cs-hdl br" aria-hidden="true" />
          <span className="cs-size" aria-hidden="true">Hug × Hug</span>
          {/* 1. Cover */}
          <section className="cs-cover">
            <span className="cs-status label">{study.status}</span>
            <h1>{study.title}</h1>
            <Placeholder kind="line" label="One-line hook" />
            <Placeholder kind="hero" label="Hero visual" />
          </section>

          {/* 2. Meta */}
          <section className="cs-meta" aria-label="Project details">
            {["Role", "Timeline", "Team", "Tools"].map((k) => (
              <div key={k}>
                <span className="label">{k}</span>
                <span className="cs-tbd">To come</span>
              </div>
            ))}
          </section>

          {/* 3. Impact, shown early */}
          <Section title="Impact">
            <div className="cs-stats">
              {[1, 2, 3].map((i) => <Placeholder key={i} kind="stat" label="Stat" />)}
            </div>
          </Section>

          {/* 4. Context: short */}
          <Section title="Context">
            <Placeholder kind="text" label="Two or three lines of context" />
          </Section>

          {/* 5. Final artifacts */}
          <Section title="Final artifacts">
            <div className="cs-two">
              <Placeholder kind="image" label="Screen" />
              <Placeholder kind="image" label="Screen" />
            </div>
          </Section>

          {/* 6. Key design moments: 3–5, light captions */}
          <Section title="Key design moments">
            {[1, 2, 3].map((i) => (
              <div className="cs-moment" key={i}>
                <Placeholder kind="image" label={`Moment ${i}`} />
                <Placeholder kind="line" label="Caption" />
              </div>
            ))}
          </Section>

          {/* 7. Reflections */}
          <Section title="Reflections">
            <Placeholder kind="text" label="What I learned" />
          </Section>
        </article>
      </main>

      <nav className="cs-bar" aria-label="Case study">
        <Link href={back}>← Back to Work</Link>
      </nav>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cs-section">
      <h2 className="label">{title}</h2>
      {children}
    </section>
  );
}

// A grey dashed box standing in for content that hasn't been written or designed yet.
function Placeholder({ kind, label }: { kind: "line" | "text" | "hero" | "image" | "stat"; label: string }) {
  return (
    <div className={`cs-ph cs-ph-${kind}`}>
      <span>{label}</span>
    </div>
  );
}
