"use client"

import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"
import { useStore } from "@/lib/store"
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Booking,
} from "@/lib/types"
import { cn } from "@/lib/utils"

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { vehicles, serviceTypes, mechanics } = useStore()
  if (!booking) return null

  const vehicle = vehicles.find((v) => v.id === booking.vehicleId)
  const service = serviceTypes.find((s) => s.id === booking.serviceTypeId)
  const mechanic = mechanics.find((m) => m.id === booking.mechanicId)
  const cancelled = booking.status === "cancelled"
  const currentIndex = STATUS_ORDER.indexOf(booking.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle>Booking {booking.id}</DialogTitle>
            <StatusBadge status={booking.status} />
          </div>
          <DialogDescription>
            {service?.name} · {vehicle?.make} {vehicle?.model} ({vehicle?.regNumber})
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-2 gap-4 py-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Appointment</dt>
            <dd className="mt-0.5 font-medium">
              {booking.date} at {booking.time}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estimated cost</dt>
            <dd className="mt-0.5 font-medium">₹{booking.cost}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Assigned mechanic</dt>
            <dd className="mt-0.5 font-medium">
              {mechanic ? mechanic.name : "Not yet assigned"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Booked on</dt>
            <dd className="mt-0.5 font-medium">{booking.createdAt}</dd>
          </div>
          {booking.notes ? (
            <div className="col-span-2">
              <dt className="text-muted-foreground">Customer notes</dt>
              <dd className="mt-0.5">{booking.notes}</dd>
            </div>
          ) : null}
        </dl>

        <Separator />

        {/* Progress stepper */}
        {!cancelled ? (
          <div className="py-2">
            <p className="mb-4 text-sm font-medium">Service progress</p>
            <ol className="flex items-center">
              {STATUS_ORDER.map((s, i) => {
                const done = i <= currentIndex
                const isLast = i === STATUS_ORDER.length - 1
                return (
                  <li
                    key={s}
                    className={cn("flex items-center", !isLast && "flex-1")}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                          done
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          "whitespace-nowrap text-[11px]",
                          done
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {STATUS_LABELS[s]}
                      </span>
                    </div>
                    {!isLast ? (
                      <span
                        className={cn(
                          "mx-1 mb-5 h-0.5 flex-1",
                          i < currentIndex ? "bg-primary" : "bg-border",
                        )}
                      />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>
        ) : (
          <p className="py-2 text-sm text-destructive">
            This booking was cancelled.
          </p>
        )}

        <Separator />

        {/* Activity log */}
        <div className="py-2">
          <p className="mb-3 text-sm font-medium">Activity</p>
          {booking.progress.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No updates yet. We&apos;ll notify you as work progresses.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {booking.progress
                .slice()
                .reverse()
                .map((p) => (
                  <li key={p.id} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={p.status} />
                        <span className="text-xs text-muted-foreground">
                          {p.at}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{p.note}</p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
