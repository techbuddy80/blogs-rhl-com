import { allKnowledgeBases, type KnowledgeBase } from "content-collections";
import { getCategory } from "@/lib/taxonomy";
import type { KbSidebarCategory } from "@/components/content/kb-sidebar";

// A handful of domain acronyms worth capitalizing correctly rather than
// title-casing into "Rac" or "Aws" — this content is genuinely full of
// them, so it's worth the small lookup table.
const ACRONYMS = new Set([
  "rac",
  "aws",
  "oci",
  "sql",
  "ai",
  "dns",
  "san",
  "nas",
  "vlan",
  "vlans",
  "ci",
  "cd",
  "gcs",
  "lxc",
]);

export function formatSlugLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) =>
      ACRONYMS.has(word.toLowerCase()) ? word.toUpperCase() : capitalize(word)
    )
    .join(" ");
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export interface ParsedKbSlug {
  category: string;
  topic: string;
  page: string;
}

// KB docs are stored at a fixed 3-level path (see docs/01-architecture-and-ia.md
// section 4), so `_meta.path` / `slug` is always "category/topic/page".
export function parseKbSlug(slug: string): ParsedKbSlug {
  const [category = "", topic = "", page = ""] = slug.split("/");
  return { category, topic, page };
}

export function getPublishedKbPages(): KnowledgeBase[] {
  return allKnowledgeBases.filter((doc) => !doc.draft);
}

export function getKbCategoriesWithContent(): {
  slug: string;
  label: string;
  description: string;
  count: number;
}[] {
  const pages = getPublishedKbPages();
  const counts = new Map<string, number>();
  pages.forEach((p) => {
    const { category } = parseKbSlug(p.slug);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([slug, count]) => {
    const category = getCategory(slug);
    return {
      slug,
      label: category?.label ?? formatSlugLabel(slug),
      description: category?.description ?? "",
      count,
    };
  });
}

export function getKbTopicsForCategory(categorySlug: string) {
  const pages = getPublishedKbPages().filter(
    (p) => parseKbSlug(p.slug).category === categorySlug
  );
  const topicMap = new Map<string, KnowledgeBase[]>();
  pages.forEach((p) => {
    const { topic } = parseKbSlug(p.slug);
    const list = topicMap.get(topic) ?? [];
    list.push(p);
    topicMap.set(topic, list);
  });

  return Array.from(topicMap.entries()).map(([slug, docs]) => ({
    slug,
    label: formatSlugLabel(slug),
    count: docs.length,
  }));
}

export function getKbPagesForTopic(
  categorySlug: string,
  topicSlug: string
): KnowledgeBase[] {
  return getPublishedKbPages()
    .filter((p) => {
      const parsed = parseKbSlug(p.slug);
      return parsed.category === categorySlug && parsed.topic === topicSlug;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
}

/**
 * Builds the full category → topic → page tree the KbSidebar renders,
 * from real content instead of the sample data Step 4 shipped with.
 */
export function buildKbTree(): KbSidebarCategory[] {
  const categories = getKbCategoriesWithContent();

  return categories.map((category) => {
    const topics = getKbTopicsForCategory(category.slug);
    return {
      slug: category.slug,
      label: category.label,
      topics: topics.map((topic) => {
        const pages = getKbPagesForTopic(category.slug, topic.slug);
        return {
          slug: topic.slug,
          label: topic.label,
          pages: pages.map((p) => ({
            slug: parseKbSlug(p.slug).page,
            label: p.title,
          })),
        };
      }),
    };
  });
}
