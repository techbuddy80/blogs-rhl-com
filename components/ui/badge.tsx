import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Monospace by default — badges carry metadata (categories, tags, tech
// stack, status), and mono is the visual thread tying that metadata
// together across the site. See docs/03-design-system.md.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
        primary: "border-primary/30 bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
