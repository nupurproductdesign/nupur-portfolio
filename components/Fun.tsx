import { FUN } from "@/lib/content";
import Desk from "./Desk";

export default function Fun() {
  const s = FUN.statement;
  return (
    <section className="about" id="fun" aria-labelledby="fun-h">
      <span className="eyebrow label">Fun</span>
      <h2 id="fun-h">
        {s.before}<em>{s.em}</em>{s.after}
      </h2>
      <p>{FUN.paragraph}</p>
      <div className="lbl label" style={{ marginTop: 32 }}>
        <span>The desk</span>
        <span>Drag things around</span>
      </div>
      <Desk />
    </section>
  );
}
