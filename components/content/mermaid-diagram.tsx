"use client";

import * as React from "react";

/**
 * Renders a mermaid code block as an SVG diagram client-side.
 *
 * Progressive enhancement: the raw mermaid source stays in the DOM (inside
 * a visually-hidden <pre>) until JS runs and replaces it with the rendered
 * SVG, reading the text via `textContent` rather than needing an AST hook
 * into the MDX compile pipeline — this is how the `pre` override in
 * mdx-components.tsx routes `language-mermaid` blocks here instead of
 * through CodeBlockPre.
 */
export function MermaidDiagram({ children }: { children: React.ReactNode }) {
  const sourceRef = React.useRef<HTMLPreElement>(null);
  const outputRef = React.useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function render() {
      const code = sourceRef.current?.textContent ?? "";
      if (!code.trim()) return;

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && outputRef.current) {
          outputRef.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="my-6 rounded-lg border border-border bg-surface p-4">
      <pre ref={sourceRef} className={rendered ? "sr-only" : "overflow-x-auto text-sm"}>
        {children}
      </pre>
      {error && (
        <p className="font-mono text-xs text-red-400">
          Diagram failed to render: {error}
        </p>
      )}
      <div ref={outputRef} className="flex justify-center [&_svg]:max-w-full" />
    </div>
  );
}
