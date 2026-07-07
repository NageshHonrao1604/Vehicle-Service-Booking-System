"use client"

import { useState } from "react"
import { Plus, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"

const TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]

export function BookServiceDialog({ customerId }: { customerId: string }) {
  const { vehicles, serviceTypes, createBooking } = useStore()
  const myVehicles = vehicles.filter((v) => v.customerId === customerId)
  const [open, setOpen] = useState(false)
  const [vehicleId, setVehicleId] = useState("")
  const [serviceTypeId, setServiceTypeId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  const today = new Date().toISOString().slice(0, 10)

  function reset() {
    setVehicleId("")
    setServiceTypeId("")
    setDate("")
    setTime("")
    setNotes("")
    setError("")
  }

  function submit() {
    if (!vehicleId || !serviceTypeId || !date || !time) {
      setError("Please complete all required fields.")
      return
    }
    createBooking({ customerId, vehicleId, serviceTypeId, date, time, notes })
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Book a service
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a service appointment</DialogTitle>
          <DialogDescription>
            Choose your vehicle, the service required, and a preferred time.
          </DialogDescription>
        </DialogHeader>

        {myVehicles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center select-none">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Car className="h-6 w-6" />
            </span>
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-sm">No Vehicles Registered</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                You must add at least one vehicle to your profile in the "Vehicles" tab before you can book a service appointment.
              </p>
            </div>
            <Button onClick={() => setOpen(false)} className="mt-2 font-semibold cursor-pointer">
              Okay, I'll add one
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 py-4">
              {/* Section 1: Vehicle & Service */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">1. Vehicle & Service Selection</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Vehicle</Label>
                    <Select value={vehicleId} onValueChange={setVehicleId}>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {myVehicles.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.make} {v.model} ({v.regNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Service Type</Label>
                    <Select value={serviceTypeId} onValueChange={setServiceTypeId}>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} — ₹{s.basePrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/80 w-full" />

              {/* Section 2: Preferred Schedule */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">2. Preferred Schedule</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="date" className="text-xs font-semibold text-muted-foreground">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Preferred Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/80 w-full" />

              {/* Section 3: Additional Notes */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">3. Service Notes</h4>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="notes" className="text-xs font-semibold text-muted-foreground">Describe symptoms or requests (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Describe engine sounds, AC warning details, or specific replacement parts needed..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[70px] resize-none"
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-destructive font-medium">{error}</p> : null}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submit}>Confirm booking</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
