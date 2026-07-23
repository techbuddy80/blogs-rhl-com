import { Breadcrumb } from "@/components/layout/breadcrumb";
import { BlogFilterBar } from "@/components/content/blog-filter-bar";
import { ArticleCard } from "@/components/content/article-card";
import { Pagination } from "@/components/layout/pagination";
import { getCategory, isValidCategory } from "@/lib/taxonomy";
import { getPublishedBlogs, paginate } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getPublishedBlogs();
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories).map((category) => ({ category }));
}

export default async function BlogCategoryArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page } = await searchParams;

  if (!isValidCategory(category)) {
    return (
      <div className="container py-12">
        <p className="text-muted-foreground">Unknown category.</p>
      </div>
    );
  }

  const label = getCategory(category)?.label ?? category;
  const posts = getPublishedBlogs().filter((p) => p.category === category);
  const { items, currentPage, totalPages } = paginate(posts, Number(page) || 1);

  return (
    <div className="container space-y-8 py-12">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label }]} />
      <BlogFilterBar activeCategory={category} />

      {items.length === 0 ? (
        <p className="text-muted-foreground">No posts in {label} yet.</p>
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
        basePath={`/blog/category/${category}`}
      />
    </div>
  );
}
