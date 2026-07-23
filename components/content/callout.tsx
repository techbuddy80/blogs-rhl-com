import { Info, AlertTriangle, Lightbulb, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "tip" | "warning" | "danger";

const CONFIG: Record<CalloutType, { icon: typeof Info; className: string }> = {
  note: { icon: Info, className: "border-primary/30 bg-primary/5" },
  tip: { icon: Lightbulb, className: "border-status-completed/30 bg-status-completed/5" },
  warning: {
    icon: AlertTriangle,
    className: "border-status-planned/30 bg-status-planned/5",
  },
  danger: { icon: AlertOctagon, className: "border-red-500/30 bg-red-500/5" },
};

// Usable directly in MDX: <Callout type="warning">...</Callout>
export function Callout({
  type = "note",
  children,
}: {
  type?: CalloutType;
  children: React.ReactNode;
}) {
  const { icon: Icon, className } = CONFIG[type];

  return (
    <div className={cn("my-6 flex gap-3 rounded-lg border p-4", className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="text-sm [&>p]:m-0">{children}</div>
    </div>
  );
}
