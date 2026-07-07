"use client"

import { useMemo, useState } from "react"
import {
  CalendarClock,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Search,
  Settings2,
  Users,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ManageBookingDialog } from "@/components/manage-booking-dialog"
import { InvoiceDialog } from "@/components/invoice-dialog"
import { StatCard } from "@/components/dashboard-shell"
import { StatusBadge } from "@/components/status-badge"
import { useStore } from "@/lib/store"
import {
  STATUS_LABELS,
  type Booking,
  type BookingStatus,
} from "@/lib/types"

const FILTERS: (BookingStatus | "all")[] = [
  "all",
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]

export function AdminDashboard() {
  const { users, vehicles, bookings, mechanics, serviceTypes, addStaff } = useStore()
  const [selected, setSelected] = useState<Booking | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null)
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<BookingStatus | "all">("all")

  // Create Staff Form state
  const [staffName, setStaffName] = useState("")
  const [staffEmail, setStaffEmail] = useState("")
  const [staffRole, setStaffRole] = useState<"admin" | "mechanic">("mechanic")
  const [staffSpec, setStaffSpec] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  function handleCreateStaff(e: React.FormEvent) {
    e.preventDefault()
    setSuccessMsg("")
    if (!staffName || !staffEmail) return
    addStaff(staffName, staffEmail, staffRole, staffRole === "mechanic" ? staffSpec : undefined)
    setSuccessMsg(`Success! ${staffName} has been registered as ${staffRole === "admin" ? "an Administrator" : "a Mechanic"}. They can now sign in at the Staff Gateway using "${staffEmail}".`)
    setStaffName("")
    setStaffEmail("")
    setStaffSpec("")
  }

  function viewInvoice(b: Booking) {
    setSelectedInvoice(b)
    setInvoiceOpen(true)
  }

  const customers = users.filter((u) => u.role === "customer")

  function customerName(id: string) {
    return users.find((u) => u.id === id)?.name ?? "—"
  }
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

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => (filter === "all" ? true : b.status === filter))
      .filter((b) => {
        if (!query) return true
        const q = query.toLowerCase()
        return (
          b.id.toLowerCase().includes(q) ||
          customerName(b.customerId).toLowerCase().includes(q) ||
          serviceName(b.serviceTypeId).toLowerCase().includes(q)
        )
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, filter, query])

  const revenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.cost, 0)

  function manage(b: Booking) {
    setSelected(b)
    setOpen(true)
  }

  // Report aggregation: bookings per service type
  const serviceReport = serviceTypes
    .map((s) => {
      const list = bookings.filter((b) => b.serviceTypeId === s.id)
      const completed = list.filter((b) => b.status === "completed")
      return {
        name: s.name,
        total: list.length,
        completed: completed.length,
        revenue: completed.reduce((sum, b) => sum + b.cost, 0),
      }
    })
    .sort((a, b) => b.total - a.total)
  const maxTotal = Math.max(1, ...serviceReport.map((r) => r.total))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Service operations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage bookings, assign mechanics and review performance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={bookings.length}
          icon={ClipboardList}
        />
        <StatCard
          label="Pending"
          value={bookings.filter((b) => b.status === "pending").length}
          icon={CalendarClock}
          hint="Awaiting confirmation"
        />
        <StatCard
          label="Active jobs"
          value={bookings.filter((b) => b.status === "in_progress").length}
          icon={Wrench}
        />
        <StatCard
          label="Revenue"
          value={`₹${revenue.toLocaleString()}`}
          icon={CircleDollarSign}
          hint="From completed jobs"
        />
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="create-staff">Create Staff</TabsTrigger>
        </TabsList>

        {/* Bookings */}
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>All bookings</CardTitle>
                  <CardDescription>
                    Update status and assign mechanics.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="w-44 pl-8"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={filter}
                    onValueChange={(v) =>
                      setFilter(v as BookingStatus | "all")
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FILTERS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f === "all" ? "All statuses" : STATUS_LABELS[f]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Service
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Mechanic
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        No bookings match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {b.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {customerName(b.customerId)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {serviceName(b.serviceTypeId)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {b.date}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {mechanicName(b.mechanicId)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={b.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {(b.status === "completed" || b.status === "in_progress") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-primary hover:text-primary cursor-pointer"
                                onClick={() => viewInvoice(b)}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="hidden sm:inline">Invoice</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 cursor-pointer"
                              onClick={() => manage(b)}
                            >
                              <Settings2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Manage</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers */}
        <TabsContent value="customers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Registered customers and their vehicles.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Contact
                    </TableHead>
                    <TableHead>Vehicles</TableHead>
                    <TableHead className="text-right">Bookings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        <div className="flex flex-col">
                          <span>{c.email}</span>
                          <span className="text-xs">{c.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {vehicles.filter((v) => v.customerId === c.id).length}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {bookings.filter((b) => b.customerId === c.id).length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mechanics */}
        <TabsContent value="mechanics" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {mechanics.map((m) => {
              const jobs = bookings.filter(
                (b) =>
                  b.mechanicId === m.id &&
                  (b.status === "in_progress" || b.status === "confirmed"),
              ).length
              return (
                <Card key={m.id}>
                  <CardContent className="flex items-center gap-4 py-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <Wrench className="h-5 w-5 text-secondary-foreground" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{m.name}</p>
                        <span
                          className={
                            m.active
                              ? "inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"
                              : "inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {m.active ? "Available" : "Off duty"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {m.specialization}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold tracking-tight">
                        {jobs}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        active jobs
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Bookings by service type</CardTitle>
                <CardDescription>
                  Demand across all service categories.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {serviceReport.map((r) => (
                  <div key={r.name} className="flex flex-col gap-1.5 group">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium group-hover:text-primary transition-colors">{r.name}</span>
                      <span className="text-muted-foreground text-xs font-semibold">
                        {r.total} booking{r.total === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-info transition-all duration-500 ease-out group-hover:brightness-110"
                        style={{ width: `${(r.total / maxTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue breakdown</CardTitle>
                <CardDescription>Contribution by service type.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                {revenue === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No completed revenue yet.</p>
                ) : (
                  <>
                    <div className="relative h-48 w-48 flex items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
                        {/* Background track guide */}
                        <circle
                          cx="100"
                          cy="100"
                          r="65"
                          fill="transparent"
                          className="stroke-muted/65 stroke-[16]"
                        />
                        {serviceReport
                          .filter((r) => r.revenue > 0)
                          .reduce<{
                            elements: React.ReactNode[]
                            offset: number
                          }>(
                            (acc, r, idx) => {
                              const percent = r.revenue / revenue
                              const circumference = 2 * Math.PI * 65 // ~408.4
                              const dashArray = `${percent * circumference} ${circumference}`
                              const dashOffset = -acc.offset * circumference
                              const strokeColorClass = [
                                "stroke-primary",
                                "stroke-info",
                                "stroke-success",
                                "stroke-warning",
                                "stroke-indigo-500",
                                "stroke-purple-500",
                                "stroke-teal-500",
                              ][idx % 7]
                              
                              acc.elements.push(
                                <circle
                                  key={r.name}
                                  cx="100"
                                  cy="100"
                                  r="65"
                                  fill="transparent"
                                  className={`stroke-[16] ${strokeColorClass} transition-all duration-300 hover:stroke-[20]`}
                                  strokeDasharray={dashArray}
                                  strokeDashoffset={dashOffset}
                                />
                              )
                              acc.offset += percent
                              return acc
                            },
                            { elements: [], offset: 0 }
                          ).elements}
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Revenue</span>
                        <span className="text-xl font-bold tracking-tight text-foreground">${revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    {/* Donut chart legend */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-xs">
                      {serviceReport
                        .filter((r) => r.revenue > 0)
                        .map((r, idx) => {
                          const bgColors = [
                            "bg-primary",
                            "bg-info",
                            "bg-success",
                            "bg-warning",
                            "bg-indigo-500",
                            "bg-purple-500",
                            "bg-teal-500",
                          ]
                          return (
                            <div key={r.name} className="flex items-center gap-1.5">
                              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${bgColors[idx % 7]}`} />
                              <span className="truncate text-muted-foreground font-medium" title={r.name}>{r.name}</span>
                              <span className="font-semibold ml-auto">${r.revenue}</span>
                            </div>
                          )
                        })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue by service</CardTitle>
                <CardDescription>
                  Earnings from completed jobs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceReport
                      .filter((r) => r.completed > 0)
                      .map((r) => (
                        <TableRow key={r.name}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {r.completed}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{r.revenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status breakdown</CardTitle>
                <CardDescription>Current booking pipeline.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {(
                  [
                    "pending",
                    "confirmed",
                    "in_progress",
                    "completed",
                    "cancelled",
                  ] as BookingStatus[]
                ).map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 bg-card hover:bg-muted/40 transition-colors"
                  >
                    <StatusBadge status={s} />
                    <span className="text-sm font-bold text-foreground">
                      {bookings.filter((b) => b.status === s).length}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Create Staff */}
        <TabsContent value="create-staff" className="mt-6">
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Staff Account</CardTitle>
                <CardDescription>
                  Register a new technician or administrator account to grant them system console privileges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStaff} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="staff-name">Full Name</Label>
                    <Input
                      id="staff-name"
                      placeholder="Jane Doe"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="staff-email">Work Email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="jane@autocare.com"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="staff-role">System Role</Label>
                    <select
                      id="staff-role"
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value as "admin" | "mechanic")}
                      className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="mechanic">Mechanic / Technician (Bay Access)</option>
                      <option value="admin">Administrator / Dispatch Manager (Operations Access)</option>
                    </select>
                  </div>

                  {staffRole === "mechanic" && (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="staff-spec">Specialization</Label>
                      <Input
                        id="staff-spec"
                        placeholder="e.g. Brake Diagnostics & Repair"
                        value={staffSpec}
                        onChange={(e) => setStaffSpec(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs border border-emerald-500/20 leading-relaxed font-semibold">
                      {successMsg}
                    </div>
                  )}

                  <Button type="submit" className="w-full cursor-pointer bg-primary text-primary-foreground font-semibold hover:opacity-95 shadow-md">
                    Register Staff Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ManageBookingDialog
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
