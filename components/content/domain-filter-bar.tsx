import Link from "next/link";
import { cn } from "@/lib/utils";

export function DomainFilterBar({
  domains,
  activeDomain,
}: {
  domains: { slug: string; label: string; count: number }[];
  activeDomain?: string;
}) {
  return (
    <nav aria-label="Filter by domain" className="flex flex-wrap gap-2">
      <Link
        href="/architecture"
        className={cn(
          "rounded-md border px-3 py-1 font-mono text-xs transition-colors",
          !activeDomain
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:text-foreground"
        )}
      >
        all
      </Link>
      {domains.map((domain) => (
        <Link
          key={domain.slug}
          href={`/architecture?domain=${domain.slug}`}
          className={cn(
            "rounded-md border px-3 py-1 font-mono text-xs transition-colors",
            activeDomain === domain.slug
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {domain.slug} ({domain.count})
        </Link>
      ))}
    </nav>
  );
}
