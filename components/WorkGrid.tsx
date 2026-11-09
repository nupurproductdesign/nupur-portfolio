import { CASES } from "@/lib/content";
import CaseTile from "./CaseTile";

export default function WorkGrid() {
  return (
    <div className="grid" id="work">
      {CASES.map((c) => (
        <CaseTile key={c.title} study={c} />
      ))}
    </div>
  );
}
