import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/case-study/CaseStudyPage";
import { CASES } from "@/lib/content";
import { CASE_CONTENT } from "@/lib/case-studies";
import "../../case-study.css";

// One page per case study that has a `slug` in lib/content.ts (/work/<slug>).
export function generateStaticParams() {
  return CASES.filter((c) => c.slug).map((c) => ({ slug: c.slug! }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = CASES.find((c) => c.slug === slug);
  const content = CASE_CONTENT[slug];
  if (!study) return { title: "Case study — Nupur Gidhi" };
  return { title: `${content?.title ?? study.title} — Nupur Gidhi`, description: content?.subtitle };
}

// light Figma canvas: browser chrome matches --fig-canvas (tokens.css)
export const viewport: Viewport = { themeColor: "#F5F5F5", colorScheme: "light" };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const study = CASES.find((c) => c.slug === slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} />;
}
