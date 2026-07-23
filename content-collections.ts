import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { categories } from "./lib/taxonomy";
import { extractHeadings } from "./lib/mdx-headings";

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];

// Shared MDX pipeline for all four content types — one compiler, not four
// bespoke ones (see docs/01-architecture-and-ia.md section 2).
const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [
  // Must run before rehype-pretty-code so heading ids exist for the TOC
  // links extractHeadings() generates independently to match.
  rehypeSlug,
  rehypeKatex,
  [
    rehypePrettyCode,
    {
      theme: { dark: "github-dark", light: "github-light" },
      keepBackground: false, // let our own surface/background tokens show through
    },
  ],
] as any;

const mdxOptions = { remarkPlugins, rehypePlugins };

/**
 * Shared base fields, present on every content type.
 * See architecture doc, Step 1, section 5.
 */
const base = {
  title: z.string(),
  description: z.string(),
  publishedAt: z.string().date(),
  updatedAt: z.string().date().optional(),
  draft: z.boolean().default(false),
  category: z.enum(categorySlugs),
  tags: z.array(z.string()).default([]),
};

const blog = defineCollection({
  name: "blog",
  directory: "content/blog",
  include: "**/*.mdx",
  schema: (z) => ({
    ...base,
    author: z.string().default("Author"),
    coverImage: z.string().optional(),
    relatedSlugs: z.array(z.string()).optional(),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, mdxOptions);
    const readingTime = Math.max(1, Math.round(doc.content.split(/\s+/).length / 200));
    const headings = extractHeadings(doc.content);
    return { ...doc, mdx, readingTime, headings, slug: doc._meta.path };
  },
});

const knowledgeBase = defineCollection({
  name: "knowledgeBase",
  directory: "content/knowledge-base",
  // Fixed 3-level depth: content/knowledge-base/<category>/<topic>/<page>.mdx
  include: "**/*/**/*.mdx",
  schema: (z) => ({
    ...base,
    topic: z.string(),
    order: z.number().optional(),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, mdxOptions);
    const headings = extractHeadings(doc.content);
    return { ...doc, mdx, headings, slug: doc._meta.path };
  },
});

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.mdx",
  schema: (z) => ({
    ...base,
    status: z.enum(["active", "completed", "archived", "planned"]),
    stack: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    architectureDiagram: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, mdxOptions);
    const headings = extractHeadings(doc.content);
    return { ...doc, mdx, headings, slug: doc._meta.path };
  },
});

const architecture = defineCollection({
  name: "architecture",
  directory: "content/architecture",
  include: "**/*.mdx",
  schema: (z) => ({
    ...base,
    domain: z.string(),
    diagramType: z.enum(["mermaid", "image"]).default("mermaid"),
    relatedProjects: z.array(z.string()).default([]),
    relatedKbArticles: z.array(z.string()).default([]),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, mdxOptions);
    const headings = extractHeadings(doc.content);
    return { ...doc, mdx, headings, slug: doc._meta.path };
  },
});

export default defineConfig({
  collections: [blog, knowledgeBase, projects, architecture],
});
