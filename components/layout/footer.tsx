import Link from "next/link";
import { Github, Linkedin, Mail, Rss } from "lucide-react";
import { mainNav } from "@/lib/nav";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME } from "@/lib/site-config";

const GITHUB_URL = "https://github.com";
const LINKEDIN_URL = "https://linkedin.com";
const EMAIL = `hello@${SITE_NAME.replace(/^blogs\./, "")}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-mono text-sm font-medium">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Engineering portfolio, technical blog, and knowledge base — Oracle,
            PostgreSQL, cloud infrastructure, and homelab engineering.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">Explore</p>
          <ul className="mt-3 space-y-2">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium">Connect</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
            </li>
            <li>
              <Link
                href="/rss.xml"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Rss className="h-3.5 w-3.5" /> RSS
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Separator />

      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {year} {SITE_NAME}. All rights reserved.
        </p>
        <p className="font-mono">Next.js · TypeScript · Tailwind · MDX</p>
      </div>
    </footer>
  );
}
