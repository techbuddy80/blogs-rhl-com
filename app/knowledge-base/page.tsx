import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategoryCard } from "@/components/content/category-card";
import { getKbCategoriesWithContent } from "@/lib/knowledge-base";

export default function KnowledgeBaseIndexPage() {
  const categories = getKbCategoriesWithContent();

  return (
    <div>
      <Breadcrumb items={[{ label: "Knowledge Base" }]} />
      <div className="mt-6">
        <h1 className="font-display text-3xl font-medium tracking-tight">
          Knowledge Base
        </h1>
        <p className="mt-2 text-muted-foreground">
          Permanent, evergreen reference documentation — organized by category and topic,
          not by publish date.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No articles published yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              href={`/knowledge-base/${category.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
