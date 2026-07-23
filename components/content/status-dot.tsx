import { cn } from "@/lib/utils";

export type ProjectStatus = "active" | "completed" | "archived" | "planned";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "active",
  completed: "completed",
  archived: "archived",
  planned: "planned",
};

const STATUS_COLOR: Record<ProjectStatus, string> = {
  active: "bg-status-active",
  completed: "bg-status-completed",
  archived: "bg-status-archived",
  planned: "bg-status-planned",
};

/**
 * Signature element (see docs/03-design-system.md). Borrowed directly from
 * Kubernetes pod status / Grafana panel indicators — the actual monitoring
 * vocabulary of this site's subject matter, not decorative color.
 * Only "active" pulses — reserved for the one state that's genuinely live.
 */
export function StatusDot({
  status,
  showLabel = true,
  className,
}: {
  status: ProjectStatus;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-xs", className)}>
      <span className="relative flex h-2 w-2">
        {status === "active" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-pulse-dot rounded-full",
              STATUS_COLOR[status]
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            STATUS_COLOR[status]
          )}
        />
      </span>
      {showLabel && <span className="text-muted-foreground">{STATUS_LABEL[status]}</span>}
    </span>
  );
}
