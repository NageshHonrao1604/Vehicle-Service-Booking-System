"use client"

import { Printer, ShieldCheck, Wrench } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"
import type { Booking } from "@/lib/types"

export function InvoiceDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { vehicles, serviceTypes, users } = useStore()
  if (!booking) return null

  const vehicle = vehicles.find((v) => v.id === booking.vehicleId)
  const service = serviceTypes.find((s) => s.id === booking.serviceTypeId)
  const customer = users.find((u) => u.id === booking.customerId)

  const basePrice = service?.basePrice ?? 0
  const parts = booking.parts || []
  const partsTotal = parts.reduce((sum, p) => sum + p.cost * p.quantity, 0)
  
  const laborHrs = booking.laborHrs || 0
  const laborRate = booking.laborRate || 60
  const laborTotal = laborHrs * laborRate

  const subtotal = basePrice + partsTotal + laborTotal
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const isCompleted = booking.status === "completed"

  function handlePrint() {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
        {/* Scoped CSS to isolate printing to only the #print-invoice element */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #print-area, #print-area * {
              visibility: visible !important;
            }
            #print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              background: white !important;
              color: black !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        <DialogHeader className="no-print">
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            Service Invoice
          </DialogTitle>
          <DialogDescription>
            Invoice for service record {booking.id}
          </DialogDescription>
        </DialogHeader>

        {/* Invoice Container */}
        <div id="print-area" className="flex flex-col gap-6 p-4 rounded-lg bg-card text-foreground">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <Wrench className="h-6 w-6" />
                <span className="text-xl font-bold tracking-tight">AutoCare Centers</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                100 Main St, Tech City, TC 10101<br />
                billing@autocare.com · +1 555 0100
              </p>
            </div>
            <div className="flex flex-col sm:text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice</span>
              <span className="text-lg font-mono font-bold text-foreground">#INV-{booking.id.replace("b-", "")}</span>
              <p className="text-xs text-muted-foreground mt-1">
                Date: {booking.date}<br />
                Terms: Due Upon Receipt
              </p>
            </div>
          </div>

          <Separator />

          {/* Client & Vehicle Details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
            <div>
              <h5 className="font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Billed To:</h5>
              <p className="font-medium text-foreground">{customer?.name}</p>
              <p className="text-muted-foreground mt-0.5">
                {customer?.email}<br />
                {customer?.phone}
              </p>
            </div>
            <div>
              <h5 className="font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Vehicle Serviced:</h5>
              <p className="font-medium text-foreground">{vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
              <p className="text-muted-foreground mt-0.5">
                Registration: <span className="font-mono">{vehicle?.regNumber}</span><br />
                Type: {vehicle?.type}
              </p>
            </div>
          </div>

          {/* Table of Charges */}
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="py-2.5 h-auto text-xs">Service Description</TableHead>
                  <TableHead className="py-2.5 h-auto text-xs text-right">Unit Price</TableHead>
                  <TableHead className="py-2.5 h-auto text-xs text-center">Qty</TableHead>
                  <TableHead className="py-2.5 h-auto text-xs text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Base Service Fee */}
                <TableRow className="text-xs">
                  <TableCell className="py-2 font-medium">
                    {service?.name} (Base Service Fee)
                  </TableCell>
                  <TableCell className="py-2 text-right">₹{basePrice.toFixed(2)}</TableCell>
                  <TableCell className="py-2 text-center">1</TableCell>
                  <TableCell className="py-2 text-right font-medium">₹{basePrice.toFixed(2)}</TableCell>
                </TableRow>

                {/* Parts */}
                {parts.map((p) => (
                  <TableRow key={p.id} className="text-xs">
                    <TableCell className="py-2 pl-6 text-muted-foreground">
                      • {p.description} (Part)
                    </TableCell>
                    <TableCell className="py-2 text-right text-muted-foreground">₹{p.cost.toFixed(2)}</TableCell>
                    <TableCell className="py-2 text-center text-muted-foreground">{p.quantity}</TableCell>
                    <TableCell className="py-2 text-right font-medium text-muted-foreground">
                      ₹{(p.cost * p.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Labor */}
                {laborHrs > 0 && (
                  <TableRow className="text-xs">
                    <TableCell className="py-2 pl-6 text-muted-foreground">
                      • Technician Labor ({laborHrs} hrs @ ₹{laborRate}/hr)
                    </TableCell>
                    <TableCell className="py-2 text-right text-muted-foreground">₹{laborRate.toFixed(2)}</TableCell>
                    <TableCell className="py-2 text-center text-muted-foreground">{laborHrs}</TableCell>
                    <TableCell className="py-2 text-right font-medium text-muted-foreground">
                      ₹{laborTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Totals Section & PAID Watermark */}
          <div className="relative flex justify-between items-start gap-8 min-h-[110px] text-xs">
            {/* Status watermark */}
            <div className="flex items-center mt-2">
              {isCompleted ? (
                <div className="border-4 border-success/40 text-success/60 font-bold uppercase text-2xl tracking-widest px-4 py-1.5 rounded rotate-[-12deg] shadow-inner select-none font-mono">
                  PAID
                </div>
              ) : (
                <div className="border-4 border-warning/30 text-warning/50 font-bold uppercase text-xl tracking-widest px-3 py-1 rounded rotate-[-8deg] shadow-inner select-none font-mono">
                  DRAFT / PENDING
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="flex flex-col gap-1.5 w-52 sm:w-64">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10.0%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Grand Total</span>
                <span className="text-primary font-black">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 no-print border-t border-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Close
          </Button>
          <Button onClick={handlePrint} className="gap-1.5 cursor-pointer">
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
