"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Extracts a tab label from a rehype-pretty-code figure's title figcaption
// (see docs/05-mdx-content.md for the exact HAST shape this depends on).
// Falls back to a numbered label if no `title="..."` meta was set on the
// fence, so CodeGroup degrades gracefully rather than breaking.
function getTabLabel(child: React.ReactNode, index: number): string {
  if (React.isValidElement(child)) {
    const kids = React.Children.toArray(
      (child.props as { children?: React.ReactNode }).children
    );
    for (const kid of kids) {
      if (
        React.isValidElement(kid) &&
        "data-rehype-pretty-code-title" in (kid.props as Record<string, unknown>)
      ) {
        const label = (kid.props as { children?: React.ReactNode }).children;
        if (typeof label === "string") return label;
      }
    }
  }
  return `Tab ${index + 1}`;
}

// Usable directly in MDX: wrap multiple titled code fences in <CodeGroup>.
export function CodeGroup({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  const [active, setActive] = React.useState(0);

  if (items.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border">
      <div role="tablist" className="flex border-b border-border bg-surface">
        {items.map((child, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-2 font-mono text-xs transition-colors",
              active === i
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {getTabLabel(child, i)}
          </button>
        ))}
      </div>
      {items.map((child, i) => (
        <div
          key={i}
          role="tabpanel"
          hidden={active !== i}
          className="[&>figure]:my-0 [&>figure]:rounded-none [&>figure]:border-none"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
