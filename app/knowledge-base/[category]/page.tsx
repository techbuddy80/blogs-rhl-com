import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCategory } from "@/lib/taxonomy";
import { getKbCategoriesWithContent, getKbTopicsForCategory } from "@/lib/knowledge-base";

export async function generateStaticParams() {
  return getKbCategoriesWithContent().map((c) => ({ category: c.slug }));
}

export default async function KbCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const topics = getKbTopicsForCategory(category);

  if (topics.length === 0) notFound();

  const label = getCategory(category)?.label ?? category;

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Knowledge Base", href: "/knowledge-base" }, { label }]}
      />
      <h1 className="mb-6 mt-6 font-display text-2xl font-medium tracking-tight">
        {label}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/knowledge-base/${category}/${topic.slug}`}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{topic.label}</CardTitle>
                <CardDescription>
                  {topic.count} {topic.count === 1 ? "article" : "articles"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
