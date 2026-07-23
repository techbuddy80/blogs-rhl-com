import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g. "/blog" — page N renders as `${basePath}?page=N`
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <PageLink
        href={hrefFor(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageLink>

      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            buttonVariants({
              variant: page === currentPage ? "default" : "ghost",
              size: "icon",
            }),
            "font-mono text-xs"
          )}
        >
          {page}
        </Link>
      ))}

      <PageLink
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { disabled?: boolean }) {
  if (disabled) {
    return (
      <span
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "opacity-40")}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={buttonVariants({ variant: "ghost", size: "icon" })}
      {...props}
    >
      {children}
    </Link>
  );
}
