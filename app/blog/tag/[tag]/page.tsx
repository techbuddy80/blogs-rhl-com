import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ArticleCard } from "@/components/content/article-card";
import { Pagination } from "@/components/layout/pagination";
import { getAllTags, getPublishedBlogs, paginate } from "@/lib/blog";

export async function generateStaticParams() {
  const tags = getAllTags(getPublishedBlogs());
  return tags.map((tag) => ({ tag }));
}

export default async function BlogTagArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page } = await searchParams;

  const posts = getPublishedBlogs().filter((p) => p.tags.includes(tag));
  const { items, currentPage, totalPages } = paginate(posts, Number(page) || 1);

  return (
    <div className="container space-y-8 py-12">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: `#${tag}` }]} />

      {items.length === 0 ? (
        <p className="text-muted-foreground">No posts tagged #{tag} yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <ArticleCard key={post.slug} article={post} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/tag/${tag}`}
      />
    </div>
  );
}
