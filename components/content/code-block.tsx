"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Overrides the `pre` element produced by rehype-pretty-code. Adds a copy
 * button that reads the rendered text directly from the DOM — robust
 * regardless of how many syntax-highlighting spans are inside, since it
 * doesn't need to parse the AST, just `textContent` at click time.
 *
 * Line numbers are handled in pure CSS (counter-reset/counter-increment on
 * `[data-line]`, see styles/globals.css) driven by rehype-pretty-code's own
 * `data-line-numbers` attribute — no JS needed for that part.
 */
export function CodeBlockPre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          "absolute right-3 top-3 z-10 rounded-md border border-border bg-surface p-1.5",
          "text-muted-foreground opacity-0 transition-opacity hover:text-foreground",
          "focus-visible:opacity-100 group-hover:opacity-100"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}
