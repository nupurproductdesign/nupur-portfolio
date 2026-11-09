import { LINKS } from "@/lib/content";

export default function Colophon() {
  return (
    <footer className="colophon">
      <span>Wireframed in Figma, vibe-coded with Claude, shipped by me.</span>
      <a href={LINKS.source} target="_blank" rel="noopener">
        View this site&apos;s source ↗
      </a>
    </footer>
  );
}
