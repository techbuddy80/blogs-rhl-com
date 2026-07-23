"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useSearch } from "@/lib/use-search";
import { SearchResultsList } from "@/components/content/search-results-list";

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { results, loading } = useSearch(query);

  React.useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  React.useEffect(() => {
    if (open) {
      // Let the dialog mount before focusing.
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery("");
  }, [open]);

  const handleViewAll = () => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
      >
        <Search className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 p-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-border bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) handleViewAll();
                }}
                placeholder="Search articles, projects, docs..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto px-4">
              {loading ? (
                <p className="py-6 text-sm text-muted-foreground">Searching…</p>
              ) : (
                <SearchResultsList results={results} onNavigate={() => setOpen(false)} />
              )}
            </div>

            {query.trim() && (
              <div className="border-t border-border px-4 py-2">
                <button
                  onClick={handleViewAll}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  View all results for &ldquo;{query}&rdquo; →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
