import type { NavItem } from "@/types";

// Single source of truth for the global top nav — matches the sitemap in
// docs/01-architecture-and-ia.md section 4.
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Knowledge Base", href: "/knowledge-base" },
  { label: "Projects", href: "/projects" },
  { label: "Architecture", href: "/architecture" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
