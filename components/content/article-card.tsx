import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryLabel } from "@/components/content/category-badge";

export interface ArticleCardData {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingTime: number;
}

// Meta row rendered in mono — the connective tissue between article
// metadata and code/terminal content elsewhere on the site.
export function ArticleCard({ article }: { article: ArticleCardData }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${article.slug}`} className="block h-full">
      <Card className="h-full">
        <CardHeader>
          <CategoryLabel slug={article.category} />
          <CardTitle className="mt-2">{article.title}</CardTitle>
          <CardDescription>{article.description}</CardDescription>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {date} · {article.readingTime} min read
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
