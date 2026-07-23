import Link from "next/link";
import type { SearchDocument, SearchDocType } from "@/lib/search-index";
import { Badge } from "@/components/ui/badge";

const TYPE_LABEL: Record<SearchDocType, string> = {
  blog: "Blog",
  "knowledge-base": "Knowledge Base",
  project: "Project",
  architecture: "Architecture",
};

export function SearchResultsList({
  results,
  onNavigate,
}: {
  results: SearchDocument[];
  onNavigate?: () => void;
}) {
  if (results.length === 0) {
    return <p className="px-1 py-6 text-sm text-muted-foreground">No results.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {results.map((result) => (
        <li key={result.id}>
          <Link
            href={result.url}
            onClick={onNavigate}
            className="flex flex-col gap-1 px-1 py-3 transition-colors hover:bg-surface"
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline">{TYPE_LABEL[result.type]}</Badge>
              <span className="font-display text-sm">{result.title}</span>
            </div>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {result.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
