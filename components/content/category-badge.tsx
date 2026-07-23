import Link from "next/link";
import { getCategory } from "@/lib/taxonomy";
import { Badge } from "@/components/ui/badge";

// Plain, non-interactive label — safe to nest inside another link (e.g.
// ArticleCard, ProjectCard), since HTML forbids nesting <a> inside <a>.
export function CategoryLabel({ slug }: { slug: string }) {
  const category = getCategory(slug);
  return <Badge variant="primary">{category?.label ?? slug}</Badge>;
}

// Linked variant — for standalone use (filter bars, breadcrumbs, article
// headers) where it isn't nested inside another clickable element.
export function CategoryBadge({ slug }: { slug: string }) {
  return (
    <Link href={`/blog/category/${slug}`}>
      <Badge variant="primary" className="hover:bg-primary/20">
        {getCategory(slug)?.label ?? slug}
      </Badge>
    </Link>
  );
}
