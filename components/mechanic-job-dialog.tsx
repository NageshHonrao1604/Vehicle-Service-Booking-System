"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Wrench } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/status-badge"
import { useStore } from "@/lib/store"
import {
  STATUS_LABELS,
  type Booking,
  type BookingStatus,
  type InvoiceItem,
} from "@/lib/types"

const TECH_STATUS_OPTIONS: BookingStatus[] = [
  "confirmed",
  "in_progress",
  "completed",
]

export function MechanicJobDialog({
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
    updateBookingStatus,
    updateBookingInvoice,
  } = useStore()

  const [status, setStatus] = useState<BookingStatus>("in_progress")
  const [note, setNote] = useState("")
  
  // Invoice items state
  const [parts, setParts] = useState<InvoiceItem[]>([])
  const [laborHrs, setLaborHrs] = useState<number>(0)
  const [laborRate] = useState<number>(60) // $60/hr flat rate

  // Form for adding a new part
  const [partDesc, setPartDesc] = useState("")
  const [partCost, setPartCost] = useState("")
  const [partQty, setPartQty] = useState("1")
  const [formError, setFormError] = useState("")

  useEffect(() => {
    if (booking) {
      setStatus(booking.status)
      setNote("")
      setParts(booking.parts || [])
      setLaborHrs(booking.laborHrs || 0)
      setFormError("")
    }
  }, [booking])

  if (!booking) return null

  const customer = users.find((u) => u.id === booking.customerId)
  const vehicle = vehicles.find((v) => v.id === booking.vehicleId)
  const service = serviceTypes.find((s) => s.id === booking.serviceTypeId)
  const basePrice = service?.basePrice ?? 0

  // Calculate costs live
  const partsTotal = parts.reduce((sum, item) => sum + item.cost * item.quantity, 0)
  const laborTotal = laborHrs * laborRate
  const totalCost = basePrice + partsTotal + laborTotal

  function addPart() {
    setFormError("")
    if (!partDesc.trim()) {
      setFormError("Part description is required.")
      return
    }
    const costNum = parseFloat(partCost)
    if (isNaN(costNum) || costNum < 0) {
      setFormError("Please enter a valid part cost.")
      return
    }
    const qtyNum = parseInt(partQty)
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setFormError("Quantity must be at least 1.")
      return
    }

    const newPart: InvoiceItem = {
      id: `pt-${Math.random().toString(36).slice(2, 8)}`,
      description: partDesc.trim(),
      cost: costNum,
      quantity: qtyNum,
    }

    setParts((prev) => [...prev, newPart])
    setPartDesc("")
    setPartCost("")
    setPartQty("1")
  }

  function removePart(partId: string) {
    setParts((prev) => prev.filter((p) => p.id !== partId))
  }

  function save() {
    if (!booking) return
    
    // Update invoice parts & labor (which automatically recalculates totals)
    updateBookingInvoice(booking.id, parts, laborHrs, laborRate)

    // Update status & notes if they changed
    const finalNote = note.trim()
      ? note.trim()
      : status !== booking.status
        ? `Service status updated to ${STATUS_LABELS[status]} by mechanic.`
        : ""
    
    if (status !== booking.status || finalNote) {
      updateBookingStatus(booking.id, status, finalNote)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Manage Repair Job: {booking.id}
            </DialogTitle>
            <StatusBadge status={booking.status} />
          </div>
          <DialogDescription>
            {service?.name} · {vehicle?.make} {vehicle?.model} ({vehicle?.regNumber})
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Quick info */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-3 text-xs sm:grid-cols-4">
            <div>
              <span className="block text-muted-foreground font-medium">Customer</span>
              <span className="font-semibold text-foreground">{customer?.name}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium">Phone</span>
              <span className="font-semibold text-foreground">{customer?.phone}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium">Date</span>
              <span className="font-semibold text-foreground">{booking.date} at {booking.time}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium">Customer Notes</span>
              <span className="font-semibold text-foreground truncate block max-w-full" title={booking.notes || "None"}>
                {booking.notes || "None"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Status & notes */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">Job Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as BookingStatus)}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TECH_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <Label htmlFor="note" className="text-sm font-semibold">
                Progress Update / Customer Note
              </Label>
              <Textarea
                id="note"
                placeholder="Describe current status (e.g. Brake pads removed, inspecting rotors...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-10 min-h-[40px] resize-none"
              />
            </div>
          </div>

          <Separator />

          {/* Parts management */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Parts & Materials Used</h4>
              <p className="text-xs text-muted-foreground">Add any parts, fluids, or filters replaced during this job.</p>
            </div>

            {/* Add part form */}
            <div className="grid gap-3 sm:grid-cols-5 items-end rounded-lg border border-border p-3 bg-card">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="partDesc" className="text-xs">Part Description</Label>
                <Input
                  id="partDesc"
                  placeholder="e.g. Spark Plug"
                  value={partDesc}
                  onChange={(e) => setPartDesc(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="partCost" className="text-xs">Unit Cost (₹)</Label>
                <Input
                  id="partCost"
                  type="number"
                  placeholder="29.99"
                  value={partCost}
                  onChange={(e) => setPartCost(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="partQty" className="text-xs">Qty</Label>
                <Input
                  id="partQty"
                  type="number"
                  placeholder="1"
                  value={partQty}
                  onChange={(e) => setPartQty(e.target.value)}
                />
              </div>
              <div>
                <Button
                  type="button"
                  onClick={addPart}
                  variant="secondary"
                  className="w-full gap-1 text-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              {formError && (
                <p className="sm:col-span-5 text-xs text-destructive mt-1 font-medium">{formError}</p>
              )}
            </div>

            {/* Parts list */}
            {parts.length === 0 ? (
              <p className="text-xs text-center py-4 text-muted-foreground border border-dashed border-border rounded-md">
                No parts logged yet.
              </p>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2 h-auto text-xs">Description</TableHead>
                      <TableHead className="py-2 h-auto text-xs text-right">Cost</TableHead>
                      <TableHead className="py-2 h-auto text-xs text-center">Qty</TableHead>
                      <TableHead className="py-2 h-auto text-xs text-right">Subtotal</TableHead>
                      <TableHead className="py-2 h-auto text-xs text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parts.map((p) => (
                      <TableRow key={p.id} className="hover:bg-muted/50">
                        <TableCell className="py-2 font-medium text-xs">{p.description}</TableCell>
                        <TableCell className="py-2 text-xs text-right">₹{p.cost.toFixed(2)}</TableCell>
                        <TableCell className="py-2 text-xs text-center">{p.quantity}</TableCell>
                        <TableCell className="py-2 text-xs text-right font-medium">
                          ₹{(p.cost * p.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePart(p.id)}
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <Separator />

          {/* Labor management */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Labor Details</h4>
                <p className="text-xs text-muted-foreground">Log technician hours worked on this repair.</p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 flex flex-col gap-1.5">
                  <Label htmlFor="laborHrs" className="text-xs">Labor Hours</Label>
                  <Input
                    id="laborHrs"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={laborHrs || ""}
                    onChange={(e) => setLaborHrs(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <Label className="text-xs">Hourly Rate</Label>
                  <Input
                    disabled
                    value={`₹${laborRate}/hr`}
                    className="bg-muted text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Live totals card */}
            <div className="rounded-lg border border-border p-4 bg-muted/40 flex flex-col justify-between">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimated Summary</h5>
              <div className="flex flex-col gap-1.5 mt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Service Charge</span>
                  <span>₹{basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parts & Materials</span>
                  <span>₹{partsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Labor ({laborHrs} hrs)</span>
                  <span>₹{laborTotal.toFixed(2)}</span>
                </div>
                <Separator className="my-1.5" />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Grand Total</span>
                  <span className="text-primary">₹{totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={save} className="cursor-pointer">Save Job Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
