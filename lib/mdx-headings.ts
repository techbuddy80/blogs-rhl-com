import GithubSlugger from "github-slugger";

// Defined here (not in the client TOC component) so content-collections.ts
// can import this type without pulling in a "use client" module boundary.
// A type alias (not interface) — see docs/05-mdx-content.md for why this
// mattered for content-collections' return-type serialization check.
export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

/**
 * Extracts H2/H3 headings from raw markdown for the TableOfContents,
 * without needing to hook into the MDX compile pipeline's AST.
 *
 * Uses `github-slugger` — the same library rehype-slug uses internally —
 * so the ids generated here match the actual heading ids rehype-slug
 * assigns in the compiled HTML. Keep this in sync with the rehypePlugins
 * list in `content-collections.ts` if that ever changes.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];

  const withoutCodeFences = markdown.replace(/```[\s\S]*?```/g, "");

  const headingPattern = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(withoutCodeFences)) !== null) {
    const hashes = match[1] ?? "";
    const rawText = match[2] ?? "";
    const level = hashes.length === 2 ? 2 : 3;
    const text = rawText.trim().replace(/\s*\{#.*\}\s*$/, "");
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}
