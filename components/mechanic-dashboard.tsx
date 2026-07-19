"use client"

import { useMemo, useState } from "react"
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Search,
  Settings2,
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
import { Input } from "@/components/ui/input"
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
import { MechanicJobDialog } from "@/components/mechanic-job-dialog"
import { StatCard } from "@/components/dashboard-shell"
import { StatusBadge } from "@/components/status-badge"
import { useStore } from "@/lib/store"
import type { Booking } from "@/lib/types"

export function MechanicDashboard() {
  const { currentUser, vehicles, bookings, serviceTypes } = useStore()
  const [selected, setSelected] = useState<Booking | null>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const mechanicId = currentUser!.id

  // Filter bookings assigned to this specific mechanic
  const myBookings = useMemo(() => {
    return bookings.filter((b) => b.mechanicId === mechanicId)
  }, [bookings, mechanicId])

  const activeJobs = useMemo(() => {
    return myBookings.filter(
      (b) =>
        b.status === "pending" ||
        b.status === "confirmed" ||
        b.status === "in_progress",
    )
  }, [myBookings])

  const completedJobs = useMemo(() => {
    return myBookings.filter(
      (b) => b.status === "completed" || b.status === "cancelled",
    )
  }, [myBookings])

  function customerName(id: string) {
    const { users } = useStore()
    return users.find((u) => u.id === id)?.name ?? "—"
  }
  function serviceName(id: string) {
    return serviceTypes.find((s) => s.id === id)?.name ?? "—"
  }
  function vehicleLabel(id: string) {
    const v = vehicles.find((x) => x.id === id)
    return v ? `${v.make} ${v.model}` : "—"
  }
  function regNumber(id: string) {
    const v = vehicles.find((x) => x.id === id)
    return v ? v.regNumber : "—"
  }

  // Filtered lists based on search query
  const filteredActive = useMemo(() => {
    return activeJobs.filter((b) => {
      if (!query) return true
      const q = query.toLowerCase()
      return (
        b.id.toLowerCase().includes(q) ||
        customerName(b.customerId).toLowerCase().includes(q) ||
        serviceName(b.serviceTypeId).toLowerCase().includes(q) ||
        vehicleLabel(b.vehicleId).toLowerCase().includes(q)
      )
    })
  }, [activeJobs, query])

  const filteredCompleted = useMemo(() => {
    return completedJobs.filter((b) => {
      if (!query) return true
      const q = query.toLowerCase()
      return (
        b.id.toLowerCase().includes(q) ||
        customerName(b.customerId).toLowerCase().includes(q) ||
        serviceName(b.serviceTypeId).toLowerCase().includes(q) ||
        vehicleLabel(b.vehicleId).toLowerCase().includes(q)
      )
    })
  }, [completedJobs, query])

  function manageJob(b: Booking) {
    setSelected(b)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {currentUser!.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your assigned work orders, update progress, and log repair items.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Jobs"
          value={activeJobs.length}
          icon={Clock}
        />
        <StatCard
          label="In Progress"
          value={activeJobs.filter((b) => b.status === "in_progress").length}
          icon={Wrench}
        />
        <StatCard
          label="Completed Jobs"
          value={completedJobs.filter((b) => b.status === "completed").length}
          icon={CheckCircle2}
        />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="active">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="history">Completed History</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle, client, ID..."
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Active Jobs Tab */}
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned active orders</CardTitle>
              <CardDescription>
                Select a job to update status or log parts and labor.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <JobTable
                rows={filteredActive}
                empty="No active jobs assigned to you right now."
                customerName={customerName}
                serviceName={serviceName}
                vehicleLabel={vehicleLabel}
                regNumber={regNumber}
                onManage={manageJob}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Repair history</CardTitle>
              <CardDescription>
                Review your completed maintenance records.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <JobTable
                rows={filteredCompleted}
                empty="No completed jobs in your history."
                customerName={customerName}
                serviceName={serviceName}
                vehicleLabel={vehicleLabel}
                regNumber={regNumber}
                onManage={manageJob}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MechanicJobDialog
        booking={selected}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}

function JobTable({
  rows,
  empty,
  customerName,
  serviceName,
  vehicleLabel,
  regNumber,
  onManage,
}: {
  rows: Booking[]
  empty: string
  customerName: (id: string) => string
  serviceName: (id: string) => string
  vehicleLabel: (id: string) => string
  regNumber: (id: string) => string
  onManage: (b: Booking) => void
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <CalendarClock className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{empty}</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead className="hidden md:table-cell">Service Required</TableHead>
          <TableHead className="hidden sm:table-cell">Date/Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{b.id}</TableCell>
            <TableCell className="font-medium">{customerName(b.customerId)}</TableCell>
            <TableCell>
              <div className="flex flex-col text-sm">
                <span>{vehicleLabel(b.vehicleId)}</span>
                <span className="text-xs text-muted-foreground font-mono">{regNumber(b.vehicleId)}</span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {serviceName(b.serviceTypeId)}
            </TableCell>
            <TableCell className="hidden sm:table-cell text-muted-foreground">
              {b.date} · {b.time}
            </TableCell>
            <TableCell>
              <StatusBadge status={b.status} />
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 cursor-pointer"
                onClick={() => onManage(b)}
              >
                <Settings2 className="h-4 w-4" />
                <span>Manage</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
