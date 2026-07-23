"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/nav";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SearchDialog } from "@/components/content/search-dialog";
import { SITE_NAME } from "@/lib/site-config";

// GitHub/LinkedIn URLs are placeholders — swap in Step 12 (deployment) or
// whenever real profile links are finalized.
const GITHUB_URL = "https://github.com";
const LINKEDIN_URL = "https://linkedin.com";

const iconButton = buttonVariants({ variant: "ghost", size: "icon" });

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={cn(iconButton, "hidden sm:inline-flex")}
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={cn(iconButton, "hidden sm:inline-flex")}
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            className={cn(iconButton, "md:hidden")}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border md:hidden" aria-label="Mobile">
          <div className="container flex flex-col py-2">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "border-b border-border py-3 text-sm last:border-none",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
