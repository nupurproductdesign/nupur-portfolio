import { ABOUT } from "@/lib/content";

export default function About() {
  const s = ABOUT.statement;
  return (
    <section className="about" id="about" aria-labelledby="about-h">
      <span className="eyebrow label">About</span>
      <h2 id="about-h">
        {s.before}<em>{s.em}</em>{s.after}
      </h2>
      {ABOUT.paragraphs.map((p) => (
        <p key={p.slice(0, 20)}>{p}</p>
      ))}
      <div className="lbl label" style={{ marginTop: 40 }}>
        <span>Quick facts</span>
      </div>
      <div className="facts">
        {ABOUT.facts.map((f) => (
          <div className="fact" key={f.k}>
            <span className="label">{f.k}</span>
            <div>{f.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
