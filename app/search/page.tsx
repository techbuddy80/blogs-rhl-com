import { Suspense } from "react";
import { SearchPageContent } from "@/components/content/search-page-content";

export default function SearchPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-display text-3xl font-medium tracking-tight">Search</h1>
      <p className="mt-2 text-muted-foreground">
        Search across the blog, knowledge base, projects, and architecture references.
      </p>
      {/* useSearchParams requires a Suspense boundary in the App Router */}
      <Suspense fallback={<p className="mt-8 text-muted-foreground">Loading…</p>}>
        <SearchPageContent />
      </Suspense>
    </div>
  );
}
