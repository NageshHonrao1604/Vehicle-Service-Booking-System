"use client"

import { useMemo, useState } from "react"
import {
  CalendarClock,
  Car,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AddVehicleDialog } from "@/components/add-vehicle-dialog"
import { BookServiceDialog } from "@/components/book-service-dialog"
import { BookingDetailDialog } from "@/components/booking-detail-dialog"
import { InvoiceDialog } from "@/components/invoice-dialog"
import { StatCard } from "@/components/dashboard-shell"
import { StatusBadge } from "@/components/status-badge"
import { useStore } from "@/lib/store"
import type { Booking } from "@/lib/types"

export function CustomerDashboard() {
  const {
    currentUser,
    vehicles,
    bookings,
    serviceTypes,
    mechanics,
    cancelBooking,
  } = useStore()
  const [selected, setSelected] = useState<Booking | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null)
  const [invoiceOpen, setInvoiceOpen] = useState(false)

  const userId = currentUser!.id
  const myVehicles = vehicles.filter((v) => v.customerId === userId)
  const myBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.customerId === userId)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [bookings, userId],
  )

  const active = myBookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed" || b.status === "in_progress",
  )
  const history = myBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  )

  function serviceName(id: string) {
    return serviceTypes.find((s) => s.id === id)?.name ?? "—"
  }
  function vehicleLabel(id: string) {
    const v = vehicles.find((x) => x.id === id)
    return v ? `${v.make} ${v.model}` : "—"
  }
  function mechanicName(id: string | null) {
    return id ? mechanics.find((m) => m.id === id)?.name ?? "—" : "Unassigned"
  }

  function view(b: Booking) {
    setSelected(b)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hello, {currentUser!.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your bookings, vehicles and service history.
          </p>
        </div>
        <BookServiceDialog customerId={userId} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active bookings" value={active.length} icon={Clock} />
        <StatCard
          label="In progress"
          value={myBookings.filter((b) => b.status === "in_progress").length}
          icon={Wrench}
        />
        <StatCard
          label="Completed"
          value={myBookings.filter((b) => b.status === "completed").length}
          icon={CheckCircle2}
        />
        <StatCard label="My vehicles" value={myVehicles.length} icon={Car} />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <BookingTable
            rows={active}
            empty="No active bookings. Book a service to get started."
            serviceName={serviceName}
            vehicleLabel={vehicleLabel}
            mechanicName={mechanicName}
            onView={view}
            onCancel={cancelBooking}
            onInvoice={(b) => {
              setSelectedInvoice(b)
              setInvoiceOpen(true)
            }}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <BookingTable
            rows={history}
            empty="No past bookings yet."
            serviceName={serviceName}
            vehicleLabel={vehicleLabel}
            mechanicName={mechanicName}
            onView={view}
            onInvoice={(b) => {
              setSelectedInvoice(b)
              setInvoiceOpen(true)
            }}
          />
        </TabsContent>

        <TabsContent value="vehicles" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My vehicles</CardTitle>
                <CardDescription>
                  Vehicles registered to your account.
                </CardDescription>
              </div>
              <AddVehicleDialog customerId={userId} />
            </CardHeader>
            <CardContent>
              {myVehicles.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No vehicles registered yet.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {myVehicles.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-4 rounded-xl border border-border/85 bg-gradient-to-br from-card to-muted/10 p-5 shadow-xs hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                        <Car className="h-6 w-6" />
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-foreground leading-tight text-sm">
                          {v.make} {v.model}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {v.year} · {v.type}
                        </p>
                        <div className="mt-2.5 inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 shadow-inner">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {v.regNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BookingDetailDialog
        booking={selected}
        open={open}
        onOpenChange={setOpen}
      />
      <InvoiceDialog
        booking={selectedInvoice}
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
      />
    </div>
  )
}

function BookingTable({
  rows,
  empty,
  serviceName,
  vehicleLabel,
  mechanicName,
  onView,
  onCancel,
  onInvoice,
}: {
  rows: Booking[]
  empty: string
  serviceName: (id: string) => string
  vehicleLabel: (id: string) => string
  mechanicName: (id: string | null) => string
  onView: (b: Booking) => void
  onCancel?: (id: string) => void
  onInvoice?: (b: Booking) => void
}) {
  if (rows.length === 0) {
    return (
      <Card className="border border-dashed border-border/85 bg-muted/5">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center select-none">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 border border-border/60">
            <CalendarClock className="h-8 w-8 text-muted-foreground/60" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/45 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
            </span>
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h4 className="font-bold text-foreground text-sm">No Booking Records Found</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{empty}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Mechanic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  {serviceName(b.serviceTypeId)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {vehicleLabel(b.vehicleId)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {b.date} · {b.time}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {mechanicName(b.mechanicId)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {onInvoice && (b.status === "completed" || b.status === "in_progress") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-primary hover:text-primary cursor-pointer"
                        onClick={() => onInvoice(b)}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Invoice</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 cursor-pointer"
                      onClick={() => onView(b)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Track</span>
                    </Button>
                    {onCancel &&
                    (b.status === "pending" || b.status === "confirmed") ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive cursor-pointer"
                        onClick={() => onCancel(b.id)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
