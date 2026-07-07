"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"
import { useStore } from "@/lib/store"
import {
  STATUS_LABELS,
  type Booking,
  type BookingStatus,
} from "@/lib/types"

const STATUS_OPTIONS: BookingStatus[] = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]

export function ManageBookingDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    users,
    vehicles,
    serviceTypes,
    mechanics,
    updateBookingStatus,
    assignMechanic,
  } = useStore()
  const [status, setStatus] = useState<BookingStatus>("pending")
  const [mechanicId, setMechanicId] = useState<string>("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (booking) {
      setStatus(booking.status)
      setMechanicId(booking.mechanicId ?? "")
      setNote("")
    }
  }, [booking])

  if (!booking) return null

  const customer = users.find((u) => u.id === booking.customerId)
  const vehicle = vehicles.find((v) => v.id === booking.vehicleId)
  const service = serviceTypes.find((s) => s.id === booking.serviceTypeId)

  function save() {
    if (!booking) return
    if (mechanicId && mechanicId !== booking.mechanicId) {
      assignMechanic(booking.id, mechanicId)
    }
    if (status !== booking.status || note) {
      updateBookingStatus(booking.id, status, note)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle>Manage {booking.id}</DialogTitle>
            <StatusBadge status={booking.status} />
          </div>
          <DialogDescription>
            {service?.name} · {customer?.name}
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-2 gap-4 py-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Vehicle</dt>
            <dd className="mt-0.5 font-medium">
              {vehicle?.make} {vehicle?.model}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Registration</dt>
            <dd className="mt-0.5 font-medium">{vehicle?.regNumber}</dd>
          </div>
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
          {booking.notes ? (
            <div className="col-span-2">
              <dt className="text-muted-foreground">Customer notes</dt>
              <dd className="mt-0.5">{booking.notes}</dd>
            </div>
          ) : null}
        </dl>

        <Separator />

        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as BookingStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Assigned mechanic</Label>
              <Select value={mechanicId} onValueChange={setMechanicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign mechanic" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics
                    .filter((m) => m.active)
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Progress note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add an update for the customer..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
