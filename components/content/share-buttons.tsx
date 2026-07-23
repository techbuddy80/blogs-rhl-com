"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

// X (Twitter) glyph — lucide dropped the Twitter icon, so this is a small
// inline SVG rather than pulling in a whole icon just for one glyph.
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.5 8.65 23 11 23 15.05V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4V9Z" />
    </svg>
  );
}

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = React.useState(false);

  const shareUrl = url;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const iconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground";

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        Share
      </span>
      <a
        href={twitterHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on X"
        className={iconButtonClass}
      >
        <XIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on LinkedIn"
        className={iconButtonClass}
      >
        <LinkedInIcon className="h-3.5 w-3.5" />
      </a>
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className={cn(iconButtonClass, copied && "text-primary")}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
