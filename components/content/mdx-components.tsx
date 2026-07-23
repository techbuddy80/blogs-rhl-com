import * as React from "react";
import { CodeBlockPre } from "@/components/content/code-block";
import { MermaidDiagram } from "@/components/content/mermaid-diagram";
import { Callout } from "@/components/content/callout";
import { CodeGroup } from "@/components/content/code-group";
import { cn } from "@/lib/utils";

type PropsWithChildren = { children?: React.ReactNode; [key: string]: unknown };

// rehype-pretty-code retags a fenced code block's outer element from `pre`
// to `figure` (with `data-rehype-pretty-code-figure`), nesting the real
// `pre`/`code` inside — confirmed by reading node_modules/rehype-pretty-code
// directly (see docs/05-mdx-content.md). So the *figure* override is where
// code-block container styling lives; the *pre* override is where the copy
// button and mermaid interception live.
function Figure({ children, ...props }: PropsWithChildren) {
  const isCodeFigure = "data-rehype-pretty-code-figure" in props;

  if (!isCodeFigure) {
    // A genuine content figure (used for image captions below).
    return <figure {...props}>{children}</figure>;
  }

  return (
    <figure
      {...props}
      className="my-6 overflow-hidden rounded-lg border border-border bg-surface text-sm [&_pre]:!bg-transparent"
    >
      {children}
    </figure>
  );
}

function Pre({ children, ...props }: PropsWithChildren) {
  // The nested `code` element carries `data-language` — check it to route
  // mermaid fences to the diagram renderer instead of syntax highlighting.
  const codeChild = React.isValidElement<Record<string, unknown>>(children)
    ? children
    : null;
  const language = codeChild?.props?.["data-language"];

  if (language === "mermaid") {
    return <MermaidDiagram>{children}</MermaidDiagram>;
  }

  return <CodeBlockPre {...props}>{children}</CodeBlockPre>;
}

function Img({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  // Plain <img>, not next/image — content images are arbitrary relative
  // paths from MDX files without known dimensions at compile time.
  // Optimizing this properly (blur placeholders, explicit width/height) is
  // a Step 13 (performance) follow-up once the image pipeline exists.
  if (!alt) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" loading="lazy" {...props} />;
  }
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} loading="lazy" className="rounded-lg" {...props} />
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        {alt}
      </figcaption>
    </figure>
  );
}

function Table({ children, ...props }: PropsWithChildren) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table {...props} className="w-full text-sm">
        {children}
      </table>
    </div>
  );
}

function Blockquote({ children, ...props }: PropsWithChildren) {
  return (
    <blockquote
      {...props}
      className={cn("border-l-2 border-primary/40 pl-4 italic text-muted-foreground")}
    >
      {children}
    </blockquote>
  );
}

export const mdxComponents = {
  figure: Figure,
  pre: Pre,
  img: Img,
  table: Table,
  blockquote: Blockquote,
  Callout,
  CodeGroup,
};
