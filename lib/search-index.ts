import {
  allArchitectures,
  allBlogs,
  allKnowledgeBases,
  allProjects,
} from "content-collections";

export type SearchDocType = "blog" | "knowledge-base" | "project" | "architecture";

export interface SearchDocument {
  id: string;
  type: SearchDocType;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  // FlexSearch's Document<D> generic requires D extends DocumentData, which
  // is itself `{ [key: string]: DocumentValue | DocumentValue[] }` — an
  // index signature is genuinely required here, not just permitted.
  [key: string]: string | string[] | SearchDocType;
}

/**
 * One flat index across all four content types, built from whatever is
 * already published at build time — no separate crawl step, no external
 * service (per the original brief). Served as static JSON via
 * app/search-index.json/route.ts and consumed client-side by FlexSearch.
 */
export function buildSearchDocuments(): SearchDocument[] {
  const blogDocs: SearchDocument[] = allBlogs
    .filter((d) => !d.draft)
    .map((d) => ({
      id: `blog:${d.slug}`,
      type: "blog",
      title: d.title,
      description: d.description,
      url: `/blog/${d.slug}`,
      category: d.category,
      tags: d.tags,
    }));

  const kbDocs: SearchDocument[] = allKnowledgeBases
    .filter((d) => !d.draft)
    .map((d) => ({
      id: `kb:${d.slug}`,
      type: "knowledge-base",
      title: d.title,
      description: d.description,
      url: `/knowledge-base/${d.slug}`,
      category: d.category,
      tags: d.tags,
    }));

  const projectDocs: SearchDocument[] = allProjects
    .filter((d) => !d.draft)
    .map((d) => ({
      id: `project:${d.slug}`,
      type: "project",
      title: d.title,
      description: d.description,
      url: `/projects/${d.slug}`,
      category: d.category,
      tags: d.tags,
    }));

  const architectureDocs: SearchDocument[] = allArchitectures
    .filter((d) => !d.draft)
    .map((d) => ({
      id: `architecture:${d.slug}`,
      type: "architecture",
      title: d.title,
      description: d.description,
      url: `/architecture/${d.slug}`,
      category: d.category,
      tags: d.tags,
    }));

  return [...blogDocs, ...kbDocs, ...projectDocs, ...architectureDocs];
}
