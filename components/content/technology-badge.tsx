import { Badge } from "@/components/ui/badge";

export function TechnologyBadge({ name }: { name: string }) {
  return <Badge variant="default">{name}</Badge>;
}
