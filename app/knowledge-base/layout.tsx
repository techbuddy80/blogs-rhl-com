import { KbSidebar } from "@/components/content/kb-sidebar";
import { buildKbTree } from "@/lib/knowledge-base";

export default function KnowledgeBaseLayout({ children }: { children: React.ReactNode }) {
  const tree = buildKbTree();

  return (
    <div className="container grid grid-cols-1 gap-8 py-12 md:grid-cols-[240px_1fr]">
      <aside className="md:sticky md:top-20 md:h-[calc(100vh-6rem)] md:overflow-y-auto">
        <KbSidebar tree={tree} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
