import Link from "next/link";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/taxonomy";

// Renders as plain links to filtered URLs rather than client-side state —
// no JS needed to filter, and the filtered views are real, shareable,
// bookmarkable, indexable pages. Wired to real post counts in Step 6 (blog).
export function BlogFilterBar({ activeCategory }: { activeCategory?: string }) {
  return (
    <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-md border px-3 py-1 font-mono text-xs transition-colors",
          !activeCategory
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:text-foreground"
        )}
      >
        all
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/category/${c.slug}`}
          className={cn(
            "rounded-md border px-3 py-1 font-mono text-xs transition-colors",
            activeCategory === c.slug
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {c.slug}
        </Link>
      ))}
    </nav>
  );
}
