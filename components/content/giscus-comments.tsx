"use client";

import * as React from "react";
import { useTheme } from "next-themes";

const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

const isConfigured = Boolean(REPO && REPO_ID && CATEGORY && CATEGORY_ID);

// GitHub Discussions-backed comments — no database, matches the
// "everything is Git" philosophy (see docs/01-architecture-and-ia.md
// section 3). Renders a configuration notice instead of a broken widget
// until the real repo/category ids are set in .env — see .env.example.
export function GiscusComments({ term }: { term: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!isConfigured || !containerRef.current) return;

    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", REPO!);
    script.setAttribute("data-repo-id", REPO_ID!);
    script.setAttribute("data-category", CATEGORY!);
    script.setAttribute("data-category-id", CATEGORY_ID!);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light");

    containerRef.current.appendChild(script);
  }, [term, resolvedTheme]);

  if (!isConfigured) {
    return (
      <div className="mt-12 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        Comments (Giscus) aren&rsquo;t configured yet — set the{" "}
        <code className="font-mono">NEXT_PUBLIC_GISCUS_*</code> variables in{" "}
        <code className="font-mono">.env</code> (see{" "}
        <code className="font-mono">.env.example</code>).
      </div>
    );
  }

  return <div ref={containerRef} className="mt-12" />;
}
