"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useSearch } from "@/lib/use-search";
import { SearchResultsList } from "@/components/content/search-results-list";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const { results, loading } = useSearch(query, 30);

  // Keep the URL in sync so results stay shareable/bookmarkable, matching
  // the "filters are real links" pattern used elsewhere (blog/project
  // filter bars) — search here is the one case that genuinely needs
  // client state (live-as-you-type), but the resulting URL is still real.
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query);
    const next = params.toString() ? `/search?${params.toString()}` : "/search";
    router.replace(next, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, projects, docs..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Searching…</p>
        ) : query.trim() ? (
          <SearchResultsList results={results} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Start typing to search across all content.
          </p>
        )}
      </div>
    </div>
  );
}
