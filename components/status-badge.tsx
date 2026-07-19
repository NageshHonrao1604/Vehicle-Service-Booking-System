import { cn } from "@/lib/utils"
import { STATUS_LABELS, type BookingStatus } from "@/lib/types"

const STYLES: Record<BookingStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground ring-1 ring-warning/30",
  confirmed: "bg-info/15 text-info ring-1 ring-info/30",
  in_progress: "bg-primary/10 text-primary ring-1 ring-primary/25",
  completed: "bg-success/15 text-success ring-1 ring-success/30",
  cancelled: "bg-destructive/10 text-destructive ring-1 ring-destructive/25",
}

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
