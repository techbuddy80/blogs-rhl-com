import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCategory } from "@/lib/taxonomy";
import {
  formatSlugLabel,
  getKbCategoriesWithContent,
  getKbPagesForTopic,
  getKbTopicsForCategory,
} from "@/lib/knowledge-base";

export async function generateStaticParams() {
  return getKbCategoriesWithContent().flatMap((c) =>
    getKbTopicsForCategory(c.slug).map((t) => ({ category: c.slug, topic: t.slug }))
  );
}

export default async function KbTopicPage({
  params,
}: {
  params: Promise<{ category: string; topic: string }>;
}) {
  const { category, topic } = await params;
  const pages = getKbPagesForTopic(category, topic);

  if (pages.length === 0) notFound();

  const categoryLabel = getCategory(category)?.label ?? category;
  const topicLabel = formatSlugLabel(topic);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Knowledge Base", href: "/knowledge-base" },
          { label: categoryLabel, href: `/knowledge-base/${category}` },
          { label: topicLabel },
        ]}
      />
      <h1 className="mb-6 mt-6 font-display text-2xl font-medium tracking-tight">
        {topicLabel}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pages.map((page) => {
          const leafSlug = page.slug.split("/")[2];
          return (
            <Link
              key={page.slug}
              href={`/knowledge-base/${category}/${topic}/${leafSlug}`}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
