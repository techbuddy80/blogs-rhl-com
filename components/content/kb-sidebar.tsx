"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface KbSidebarPage {
  slug: string;
  label: string;
}
export interface KbSidebarTopic {
  slug: string;
  label: string;
  pages: KbSidebarPage[];
}
export interface KbSidebarCategory {
  slug: string;
  label: string;
  topics: KbSidebarTopic[];
}

/**
 * Client component: derives the active category/topic/page from the real
 * URL via usePathname rather than requiring props threaded down from a
 * server layout — app/knowledge-base/layout.tsx sits above every KB route
 * but (as a non-dynamic segment layout) never actually receives the
 * [category]/[topic]/[page] params matched below it, so props-based
 * highlighting would have been silently wrong at every depth past the
 * category level. See docs/07-knowledge-base.md.
 */
export function KbSidebar({ tree }: { tree: KbSidebarCategory[] }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // ["knowledge-base", cat?, topic?, page?]
  const currentCategory = segments[1];
  const currentTopic = segments[2];
  const currentPage = segments[3];

  return (
    <nav aria-label="Knowledge base" className="text-sm">
      {tree.map((category) => (
        <details
          key={category.slug}
          open={category.slug === currentCategory}
          className="group border-b border-border py-2 last:border-none"
        >
          <summary className="cursor-pointer list-none py-1.5 font-medium">
            {category.label}
          </summary>
          <ul className="mt-1 space-y-1 pl-3">
            {category.topics.map((topic) => (
              <li key={topic.slug}>
                <p className="mt-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {topic.label}
                </p>
                <ul className="mt-1 space-y-1 border-l border-border pl-3">
                  {topic.pages.map((page) => {
                    const isActive =
                      category.slug === currentCategory &&
                      topic.slug === currentTopic &&
                      page.slug === currentPage;
                    return (
                      <li key={page.slug}>
                        <Link
                          href={`/knowledge-base/${category.slug}/${topic.slug}/${page.slug}`}
                          className={cn(
                            "block py-1 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {page.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}
