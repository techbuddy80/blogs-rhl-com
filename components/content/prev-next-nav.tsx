import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdjacentPost {
  slug: string;
  title: string;
}

export function PrevNextNav({
  older,
  newer,
}: {
  older: AdjacentPost | null;
  newer: AdjacentPost | null;
}) {
  if (!older && !newer) return null;

  return (
    <nav
      aria-label="More posts"
      className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {older ? (
        <Link
          href={`/blog/${older.slug}`}
          className="group rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
        >
          <p className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <ChevronLeft className="h-3.5 w-3.5" /> Older
          </p>
          <p className="mt-1 font-display text-sm group-hover:text-primary">
            {older.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {newer ? (
        <Link
          href={`/blog/${newer.slug}`}
          className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-primary/40"
        >
          <p className="flex items-center justify-end gap-1 font-mono text-xs text-muted-foreground">
            Newer <ChevronRight className="h-3.5 w-3.5" />
          </p>
          <p className="mt-1 font-display text-sm group-hover:text-primary">
            {newer.title}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
