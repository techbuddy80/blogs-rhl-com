"use client";

import * as React from "react";
import { Document } from "flexsearch";
import type { SearchDocument } from "@/lib/search-index";

type SearchIndex = Document<SearchDocument, false, false>;

let cachedIndexPromise: Promise<{
  index: SearchIndex;
  docs: Map<string, SearchDocument>;
}> | null = null;

/**
 * Lazily fetches /search-index.json and builds an in-memory FlexSearch
 * index exactly once per page load (module-scoped cache), regardless of
 * how many times SearchDialog is opened or the /search page hook is used.
 */
function getSearchIndex() {
  if (!cachedIndexPromise) {
    cachedIndexPromise = fetch("/search-index.json")
      .then((res) => res.json() as Promise<SearchDocument[]>)
      .then((docs) => {
        const index: SearchIndex = new Document({
          document: {
            id: "id",
            index: ["title", "description", "tags"],
            store: true,
          },
        });
        const docMap = new Map<string, SearchDocument>();
        docs.forEach((doc) => {
          index.add(doc);
          docMap.set(doc.id, doc);
        });
        return { index, docs: docMap };
      });
  }
  return cachedIndexPromise;
}

export function useSearch(query: string, limit = 8) {
  const [results, setResults] = React.useState<SearchDocument[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    getSearchIndex().then(({ index }) => {
      if (cancelled) return;
      const found = index.search(query, { enrich: true, merge: true, limit });
      const docs = found
        .map((entry) => entry.doc)
        .filter((doc): doc is SearchDocument => Boolean(doc));
      setResults(docs);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [query, limit]);

  return { results, loading };
}
