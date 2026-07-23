import { ArticleCard, type ArticleCardData } from "@/components/content/article-card";

export function RelatedArticles({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="font-display text-xl font-medium tracking-tight">
        Related articles
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
