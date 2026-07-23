import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Category } from "@/lib/taxonomy";

export function CategoryCard({ category, href }: { category: Category; href: string }) {
  return (
    <Link href={href} className="block">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{category.label}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
