import Link from "next/link";
import type { CaseStudy } from "@/lib/content";
import { CASE_CONTENT, type Block } from "@/lib/case-studies";
import ThumbVideo from "@/components/ThumbVideo";

// A case study page: the gallery's dot-grid canvas with one big Figma frame (80vw) that reads like a page.
// Copy lives in lib/case-studies.ts (word for word from Nupur's doc). Images are dashed placeholders until they arrive.
export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const back = `/#work/${study.slug}`; // the gallery reopens on this case study's frame, without the intro
  const c = study.slug ? CASE_CONTENT[study.slug] : undefined;
  const title = c?.title ?? study.title;
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
        <span className="cs-name">{study.org} / {title}</span>
        {/* the page is a selected Figma frame: blue outline, corner handles and size tag, like the gallery's frames */}
        <article className="cs-frame is-sel">
          <i className="cs-hdl tl" aria-hidden="true" /><i className="cs-hdl tr" aria-hidden="true" />
          <i className="cs-hdl bl" aria-hidden="true" /><i className="cs-hdl br" aria-hidden="true" />
          <span className="cs-size" aria-hidden="true">Hug × Hug</span>

          {/* Cover */}
          <section className="cs-cover">
            <span className="cs-status label">{c?.eyebrow ?? study.org} · {study.status}</span>
            <h1>{title}</h1>
            {c && <p className="cs-sub">{c.subtitle}</p>}
            {c?.hero ? <ThumbVideo {...c.hero} className="cs-hero" /> : <Visual label="Hero visual" hero />}
          </section>

          {c ? (
            <>
              {/* Meta */}
              <section className="cs-meta" aria-label="Project details">
                {c.meta.map((m) => (
                  <div key={m.k}>
                    <span className="label">{m.k}</span>
                    <span className="cs-meta-v">{m.v.map((line) => <span key={line}>{line}</span>)}</span>
                  </div>
                ))}
              </section>
              <p className="cs-own">{c.ownership}</p>

              {c.parts.map((part, i) =>
                part.split ? (
                  // two columns: each flow is a row with its heading + text on the left and its visual on the right
                  <section className="cs-part is-split" key={i}>
                    {part.eyebrow && <span className="cs-eyebrow label">{part.eyebrow}</span>}
                    {[{ heading: part.heading, blocks: part.blocks ?? [] }, ...(part.subs ?? [])].map((row, j) => (
                      <div className="cs-split" key={j}>
                        <div className="cs-split-text">
                          {row.heading && <h2>{row.heading}</h2>}
                          <Blocks blocks={row.blocks.filter((b) => b.kind !== "visual")} />
                        </div>
                        <div className="cs-split-media">
                          <Blocks blocks={row.blocks.filter((b) => b.kind === "visual")} />
                        </div>
                      </div>
                    ))}
                  </section>
                ) : (
                  <section className={`cs-part${part.muted ? " is-muted" : ""}`} key={i}>
                    {part.eyebrow && <span className="cs-eyebrow label">{part.eyebrow}</span>}
                    {part.heading && <h2>{part.heading}</h2>}
                    <Blocks blocks={part.blocks} />
                    {part.subs?.map((s) => (
                      <div className="cs-sub-part" key={s.heading}>
                        <h2>{s.heading}</h2>
                        <Blocks blocks={s.blocks} />
                      </div>
                    ))}
                  </section>
                ),
              )}
            </>
          ) : (
            <p className="cs-tbd">Case study coming soon.</p>
          )}
        </article>
      </main>

      <nav className="cs-bar" aria-label="Case study">
        <Link href={back}>← Back to Work</Link>
      </nav>
    </div>
  );
}

function Blocks({ blocks = [] }: { blocks?: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "lead":
            return <p key={i} className="cs-lead">{b.text}</p>;
          case "visual":
            return <Visual key={i} label={b.label} note={b.note} wide={b.wide} />;
          case "stats":
            return (
              <dl key={i} className="cs-stats" style={{ "--n": b.items.length } as React.CSSProperties}>
                {b.items.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            );
          case "table":
            return (
              <table key={i} className="cs-table">
                <thead>
                  <tr>{b.head.map((h) => <th key={h} scope="col" className="label">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {b.rows.map(([a, c]) => (
                    <tr key={a}><td>{a}</td><td>{c}</td></tr>
                  ))}
                </tbody>
              </table>
            );
          case "beforeAfter":
            return <BeforeAfter key={i} before={b.before} after={b.after} />;
          case "products":
            return (
              <div key={i} className="cs-products">
                {b.items.map((p) => (
                  <div key={p.name}>
                    <h3>{p.name}</h3>
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
            );
        }
      })}
    </>
  );
}

// Before/after diagram: the same three-step journey, first run by the LehLah team, then by creators themselves.
type Journey = { who: string; steps: string[] };
function BeforeAfter({ before, after }: { before: Journey; after: Journey }) {
  const row = (tag: string, j: Journey, cls: string) => (
    <figure className={`cs-ba-row ${cls}`}>
      <figcaption>
        <span className="cs-ba-tag">{tag}</span>
        <span className="cs-ba-who">Driven by {j.who}</span>
      </figcaption>
      <ol>
        {j.steps.map((step, i) => (
          <li key={step}>
            <span className="cs-ba-num" aria-hidden="true">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </figure>
  );
  return (
    <div className="cs-ba">
      {row("Before", before, "is-before")}
      {row("After", after, "is-after")}
    </div>
  );
}

// A grey dashed box standing in for an image/GIF that hasn't been added yet. `note` is the brief for it.
function Visual({ label, note, hero, wide }: { label: string; note?: string; hero?: boolean; wide?: boolean }) {
  return (
    <div className={`cs-ph${hero ? " cs-ph-hero" : wide ? " cs-ph-wide" : " cs-ph-image"}`}>
      <span>{label}</span>
      {note && <small>{note}</small>}
    </div>
  );
}
