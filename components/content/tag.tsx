import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Deliberately neutral/monospace, not color-coded per taxonomy category —
// 12 category colors on one card grid reads as noisy. Color is reserved
// for status only (see StatusDot). See docs/03-design-system.md.
export function Tag({ tag }: { tag: string }) {
  return (
    <Link href={`/blog/tag/${tag}`}>
      <Badge variant="outline" className="hover:border-primary/50 hover:text-primary">
        #{tag}
      </Badge>
    </Link>
  );
}
