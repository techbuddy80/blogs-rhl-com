import { allBlogs, type Blog } from "content-collections";

export const BLOG_PAGE_SIZE = 9;

export function getPublishedBlogs(): Blog[] {
  return allBlogs
    .filter((post) => !post.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function paginate<T>(items: T[], page: number, pageSize: number = BLOG_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
  };
}

/**
 * Manual `relatedSlugs` (frontmatter) wins if present and resolves to at
 * least one real post; otherwise falls back to a tag-overlap + same-category
 * scoring algorithm. See docs/01-architecture-and-ia.md section 5 for why
 * this two-tier approach was chosen over either alone.
 */
export function getRelatedArticles(post: Blog, all: Blog[], limit = 3): Blog[] {
  const others = all.filter((p) => p.slug !== post.slug && !p.draft);

  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const manual = post.relatedSlugs
      .map((slug) => others.find((p) => p.slug === slug))
      .filter((p): p is Blog => Boolean(p));
    if (manual.length > 0) return manual.slice(0, limit);
  }

  const scored = others
    .map((p) => ({
      post: p,
      score:
        p.tags.filter((t) => post.tags.includes(t)).length +
        (p.category === post.category ? 1 : 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.post);
}

export function getAdjacentArticles(post: Blog, sortedNewestFirst: Blog[]) {
  const index = sortedNewestFirst.findIndex((p) => p.slug === post.slug);
  return {
    // "Newer" = appears earlier in the newest-first list (lower index)
    newer: index > 0 ? (sortedNewestFirst[index - 1] ?? null) : null,
    older:
      index >= 0 && index < sortedNewestFirst.length - 1
        ? (sortedNewestFirst[index + 1] ?? null)
        : null,
  };
}

export function getAllTags(posts: Blog[]): string[] {
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
