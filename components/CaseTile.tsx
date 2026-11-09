import type { CSSProperties } from "react";
import type { CaseKind, CaseStudy } from "@/lib/content";

// TODO(nupur): replace the illustrative CSS mock screens with real (NDA-safe) screenshots.
export default function CaseTile({ study }: { study: CaseStudy }) {
  const { inner, visual } = VISUALS[study.kind];
  return (
    <a className="case" href={study.href} style={{ "--glow": study.glow } as CSSProperties}>
      <div className="tilebox">
        <span className="status label">{study.status}</span>
        <div className="inner" style={inner}>
          {visual}
        </div>
        <div className="hov">
          <span>View case study</span>
          <span className="arrow">→</span>
        </div>
      </div>
      <div className="cap">
        <span className="meta label">{study.org}</span>
        <span className="ttl">{study.title}</span>
      </div>
    </a>
  );
}

const flexBetween: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const smallPill: CSSProperties = { fontSize: 9, padding: "2px 6px" };
// mock avatars come from theme tokens
const AV = { a: "var(--mock-av-1)", b: "var(--mock-av-2)", c: "var(--mock-av-3)" };

function PhoneCard({ w1, w2, tone, label }: { w1: string; w2: string; tone: string; label: string }) {
  return (
    <div className="pcard">
      <div style={{ ...flexBetween, gap: 6 }}>
        <span className="ln" style={{ width: w1 }} />
        <span className={`pill ${tone}`} style={smallPill}>{label}</span>
      </div>
      <span className="ln" style={{ width: w2 }} />
    </div>
  );
}

function Swatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="sw">
      <i style={{ background: color }} />
      {name}
    </div>
  );
}

const VISUALS: Record<CaseKind, { inner?: CSSProperties; visual: React.ReactNode }> = {
  campaigns: {
    visual: (
      <div className="ui">
        <div style={flexBetween}>
          <span className="h">Campaigns</span>
          <span className="pill t1"><i />12 live</span>
        </div>
        <div style={{ display: "grid", gap: 7, marginTop: 12 }}>
          <div className="row"><span className="av" style={{ background: AV.a }} /><span className="nm">Festive Glow Edit</span><span className="pill t1"><i />Payout</span></div>
          <div className="row"><span className="av" style={{ background: AV.b }} /><span className="nm">Monsoon Drop</span><span className="pill t2"><i />In review</span></div>
          <div className="row"><span className="av" style={{ background: AV.c }} /><span className="nm">Back to Campus</span><span className="pill t3"><i />Accepted</span></div>
        </div>
        <div className="note-row">
          <span>Campaign report ready</span>
          <span>↓</span>
        </div>
      </div>
    ),
  },
  phone: {
    inner: { width: "100%" },
    visual: (
      <div className="phone">
        <span className="h">Paid collabs</span>
        <PhoneCard w1="55%" w2="80%" tone="t1" label="₹ Paid" />
        <PhoneCard w1="45%" w2="65%" tone="t2" label="Barter" />
        <PhoneCard w1="60%" w2="70%" tone="t3" label="New" />
        <div className="pcta">Apply to collab</div>
      </div>
    ),
  },
  tokens: {
    inner: { width: "76%" },
    visual: (
      <div className="tiers">
        <div className="tier">
          <span className="label">Primitive</span>
          <Swatch color="var(--sw-1)" name="blue-600" />
          <Swatch color="var(--sw-2)" name="green-600" />
          <Swatch color="var(--sw-3)" name="amber-400" />
        </div>
        <div className="tier" style={{ marginTop: 24 }}>
          <span className="label">Semantic</span>
          <Swatch color="var(--sw-1)" name="action.primary" />
          <Swatch color="var(--sw-2)" name="status.success" />
          <Swatch color="var(--sw-3)" name="status.warning" />
        </div>
        <div className="tier" style={{ marginTop: 48 }}>
          <span className="label">Component</span>
          <span className="btnm solid">Button</span>
          <span className="btnm soft">Approved</span>
        </div>
      </div>
    ),
  },
  workspaces: {
    inner: { width: "56%" },
    visual: (
      <div className="ui" style={{ padding: 8 }}>
        <div className="ws-head">
          <span className="av sq" style={{ background: "var(--mock-av-solid)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="h">Northstar Agency</div>
            <div className="sub2">Agency workspace · 8 brands</div>
          </div>
          <span style={{ color: "var(--text-muted)" }}>⌄</span>
        </div>
        <div style={{ display: "grid", gap: 2, paddingTop: 6 }}>
          <div className="row flat sel"><span className="av sq" style={{ background: AV.b }} /><span className="nm">Glow Co</span><span style={{ color: "var(--pill-3)" }}>✓</span></div>
          <div className="row flat"><span className="av sq" style={{ background: AV.c }} /><span className="nm">Urban Tee</span><span className="pill t4">Viewer</span></div>
          <div className="row flat"><span className="av sq" style={{ background: AV.a }} /><span className="nm">Leaf &amp; Co</span><span className="pill t4">Admin</span></div>
        </div>
      </div>
    ),
  },
};
