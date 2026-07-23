import { BlogFilterBar } from "@/components/content/blog-filter-bar";
import { ArticleCard } from "@/components/content/article-card";
import { Pagination } from "@/components/layout/pagination";
import { getPublishedBlogs, paginate } from "@/lib/blog";

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const posts = getPublishedBlogs();
  const { items, currentPage, totalPages } = paginate(posts, Number(page) || 1);

  return (
    <div className="container space-y-8 py-12">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Notes on databases, cloud infrastructure, automation, and homelab engineering.
        </p>
      </div>

      <BlogFilterBar />

      {items.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <ArticleCard key={post.slug} article={post} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </div>
  );
}
