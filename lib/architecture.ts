import { allArchitectures, type Architecture } from "content-collections";
import { allProjects } from "content-collections";
import { allKnowledgeBases } from "content-collections";
import { formatSlugLabel } from "@/lib/knowledge-base";

export function getPublishedArchitecture(): Architecture[] {
  return allArchitectures
    .filter((doc) => !doc.draft)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getArchitectureDomains(): {
  slug: string;
  label: string;
  count: number;
}[] {
  const docs = getPublishedArchitecture();
  const counts = new Map<string, number>();
  docs.forEach((d) => counts.set(d.domain, (counts.get(d.domain) ?? 0) + 1));
  return Array.from(counts.entries()).map(([slug, count]) => ({
    slug,
    label: formatSlugLabel(slug),
    count,
  }));
}

export function filterArchitectureByDomain(
  docs: Architecture[],
  domain: string | undefined
): Architecture[] {
  if (!domain) return docs;
  return docs.filter((d) => d.domain === domain);
}

/**
 * Resolves an architecture doc's `relatedProjects`/`relatedKbArticles` slug
 * references (see docs/01-architecture-and-ia.md section 5) into real
 * title + href pairs, so a stale slug reference degrades to "not shown"
 * rather than a dead link with a raw slug as the label.
 */
export function resolveRelatedProjects(slugs: string[]) {
  return slugs
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ title: p.title, href: `/projects/${p.slug}` }));
}

export function resolveRelatedKbArticles(slugs: string[]) {
  return slugs
    .map((slug) => allKnowledgeBases.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({ title: d.title, href: `/knowledge-base/${d.slug}` }));
}
