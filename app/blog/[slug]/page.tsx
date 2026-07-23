import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { TableOfContents } from "@/components/layout/toc";
import { Mdx } from "@/components/content/mdx-content";
import { AuthorByline } from "@/components/content/author-byline";
import { ShareButtons } from "@/components/content/share-buttons";
import { RelatedArticles } from "@/components/content/related-articles";
import { PrevNextNav } from "@/components/content/prev-next-nav";
import { GiscusComments } from "@/components/content/giscus-comments";
import { CategoryBadge } from "@/components/content/category-badge";
import { Tag } from "@/components/content/tag";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBlogPostingSchema } from "@/lib/structured-data";
import { getAdjacentArticles, getPublishedBlogs, getRelatedArticles } from "@/lib/blog";

export async function generateStaticParams() {
  return getPublishedBlogs().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedBlogs().find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getPublishedBlogs(); // newest-first
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const related = getRelatedArticles(post, posts);
  const { older, newer } = getAdjacentArticles(post, posts);
  const url = `https://blogs.rhl.com/blog/${post.slug}`;

  return (
    <div className="container grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_200px]">
      <JsonLd
        data={buildBlogPostingSchema({
          title: post.title,
          description: post.description,
          url: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          author: post.author,
          tags: post.tags,
        })}
      />
      <article className="min-w-0">
        <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

        <div className="mt-6">
          <CategoryBadge slug={post.category} />
          <h1 className="mb-3 mt-3 font-display text-3xl font-medium tracking-tight">
            {post.title}
          </h1>
          <AuthorByline
            author={post.author}
            publishedAt={post.publishedAt}
            updatedAt={post.updatedAt}
            readingTime={post.readingTime}
          />
        </div>

        <div className="prose prose-invert mt-8 max-w-none">
          <Mdx code={post.mdx} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          <ShareButtons title={post.title} url={url} />
        </div>

        <PrevNextNav older={older} newer={newer} />
        <RelatedArticles articles={related} />
        <GiscusComments term={post.slug} />
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <TableOfContents headings={post.headings} />
        </div>
      </aside>
    </div>
  );
}
