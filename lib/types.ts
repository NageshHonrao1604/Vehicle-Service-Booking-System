export type Role = "customer" | "admin" | "mechanic"

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
}

export interface Vehicle {
  id: string
  customerId: string
  make: string
  model: string
  year: number
  regNumber: string
  type: "Sedan" | "SUV" | "Hatchback" | "Truck" | "Van"
}

export interface Mechanic {
  id: string
  name: string
  specialization: string
  active: boolean
  email?: string
}

export interface ServiceType {
  id: string
  name: string
  basePrice: number
  durationHrs: number
}

export interface ProgressNote {
  id: string
  status: BookingStatus
  note: string
  at: string
}

export interface InvoiceItem {
  id: string
  description: string
  cost: number
  quantity: number
}

export interface Booking {
  id: string
  customerId: string
  vehicleId: string
  serviceTypeId: string
  date: string
  time: string
  status: BookingStatus
  mechanicId: string | null
  cost: number
  notes: string
  createdAt: string
  progress: ProgressNote[]
  parts?: InvoiceItem[]
  laborHrs?: number
  laborRate?: number
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export const STATUS_ORDER: BookingStatus[] = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
]
