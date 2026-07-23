import Link from "next/link";
import { cn } from "@/lib/utils";

const STATUSES = ["active", "completed", "archived", "planned"] as const;

export function ProjectFilterBar({
  activeStatus,
  basePath,
}: {
  activeStatus?: string;
  basePath: string; // "/projects" or "/architecture"
}) {
  return (
    <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={cn(
          "rounded-md border px-3 py-1 font-mono text-xs transition-colors",
          !activeStatus
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:text-foreground"
        )}
      >
        all
      </Link>
      {STATUSES.map((status) => (
        <Link
          key={status}
          href={`${basePath}?status=${status}`}
          className={cn(
            "rounded-md border px-3 py-1 font-mono text-xs transition-colors",
            activeStatus === status
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {status}
        </Link>
      ))}
    </nav>
  );
}
