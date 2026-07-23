"use client";

import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/components/content/mdx-components";

// Thin wrapper so page components don't need to know about the
// content-collections/mdx import path or re-supply `components` every time.
export function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={mdxComponents} />;
}
