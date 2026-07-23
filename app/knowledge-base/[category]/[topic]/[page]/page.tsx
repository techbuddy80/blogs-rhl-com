import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allKnowledgeBases } from "content-collections";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { TableOfContents } from "@/components/layout/toc";
import { Mdx } from "@/components/content/mdx-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildTechArticleSchema } from "@/lib/structured-data";
import { getCategory } from "@/lib/taxonomy";
import { formatSlugLabel, getPublishedKbPages, parseKbSlug } from "@/lib/knowledge-base";

export async function generateStaticParams() {
  return getPublishedKbPages().map((doc) => {
    const { category, topic, page } = parseKbSlug(doc.slug);
    return { category, topic, page };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; topic: string; page: string }>;
}): Promise<Metadata> {
  const { category, topic, page } = await params;
  const doc = allKnowledgeBases.find((d) => d.slug === `${category}/${topic}/${page}`);
  if (!doc) return {};
  const url = `/knowledge-base/${doc.slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    openGraph: { title: doc.title, description: doc.description, type: "article", url },
    twitter: { card: "summary", title: doc.title, description: doc.description },
  };
}

export default async function KbArticlePage({
  params,
}: {
  params: Promise<{ category: string; topic: string; page: string }>;
}) {
  const { category, topic, page } = await params;

  const doc = allKnowledgeBases.find((d) => d.slug === `${category}/${topic}/${page}`);

  if (!doc) notFound();

  const categoryLabel = getCategory(category)?.label ?? category;
  const topicLabel = formatSlugLabel(topic);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_200px]">
      <JsonLd
        data={buildTechArticleSchema({
          title: doc.title,
          description: doc.description,
          url: `/knowledge-base/${doc.slug}`,
          publishedAt: doc.publishedAt,
          updatedAt: doc.updatedAt,
        })}
      />
      <article className="prose prose-invert min-w-0 max-w-none">
        <Breadcrumb
          items={[
            { label: "Knowledge Base", href: "/knowledge-base" },
            { label: categoryLabel, href: `/knowledge-base/${category}` },
            { label: topicLabel, href: `/knowledge-base/${category}/${topic}` },
            { label: doc.title },
          ]}
        />
        <h1 className="mb-2 mt-6 font-display">{doc.title}</h1>
        <p className="lead text-muted-foreground">{doc.description}</p>
        <Mdx code={doc.mdx} />
      </article>
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <TableOfContents headings={doc.headings} />
        </div>
      </aside>
    </div>
  );
}
