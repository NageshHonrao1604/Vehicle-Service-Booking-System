import type {
  Booking,
  Mechanic,
  ServiceType,
  User,
  Vehicle,
} from "./types"

export const SERVICE_TYPES: ServiceType[] = [
  { id: "st-1", name: "General Service", basePrice: 120, durationHrs: 3 },
  { id: "st-2", name: "Oil & Filter Change", basePrice: 60, durationHrs: 1 },
  { id: "st-3", name: "Brake Inspection & Repair", basePrice: 180, durationHrs: 2 },
  { id: "st-4", name: "Tyre Replacement", basePrice: 320, durationHrs: 1 },
  { id: "st-5", name: "AC Service", basePrice: 140, durationHrs: 2 },
  { id: "st-6", name: "Battery Replacement", basePrice: 150, durationHrs: 1 },
  { id: "st-7", name: "Wheel Alignment", basePrice: 90, durationHrs: 1 },
  { id: "st-8", name: "Engine Diagnostics", basePrice: 110, durationHrs: 2 },
]

export const USERS: User[] = [
  {
    id: "u-admin",
    name: "Priya Sharma",
    email: "admin@autocare.com",
    phone: "+1 555 0100",
    role: "admin",
  },
  {
    id: "u-1",
    name: "James Carter",
    email: "james@example.com",
    phone: "+1 555 0111",
    role: "customer",
  },
  {
    id: "u-2",
    name: "Maria Gonzalez",
    email: "maria@example.com",
    phone: "+1 555 0122",
    role: "customer",
  },
  {
    id: "u-3",
    name: "David Lee",
    email: "david@example.com",
    phone: "+1 555 0133",
    role: "customer",
  },
  {
    id: "m-1",
    name: "Robert Hughes",
    email: "robert@autocare.com",
    phone: "+1 555 0211",
    role: "mechanic",
  },
  {
    id: "m-2",
    name: "Sofia Martins",
    email: "sofia@autocare.com",
    phone: "+1 555 0222",
    role: "mechanic",
  },
  {
    id: "m-3",
    name: "Aaron Walsh",
    email: "aaron@autocare.com",
    phone: "+1 555 0233",
    role: "mechanic",
  },
  {
    id: "m-4",
    name: "Nina Patel",
    email: "nina@autocare.com",
    phone: "+1 555 0244",
    role: "mechanic",
  },
]

export const MECHANICS: Mechanic[] = [
  { id: "m-1", name: "Robert Hughes", specialization: "Engine & Diagnostics", active: true, email: "robert@autocare.com" },
  { id: "m-2", name: "Sofia Martins", specialization: "Brakes & Suspension", active: true, email: "sofia@autocare.com" },
  { id: "m-3", name: "Aaron Walsh", specialization: "Electrical & AC", active: true, email: "aaron@autocare.com" },
  { id: "m-4", name: "Nina Patel", specialization: "General Maintenance", active: false, email: "nina@autocare.com" },
]

export const VEHICLES: Vehicle[] = [
  { id: "v-1", customerId: "u-1", make: "Toyota", model: "Camry", year: 2021, regNumber: "KA-01-AB-1234", type: "Sedan" },
  { id: "v-2", customerId: "u-1", make: "Honda", model: "CR-V", year: 2019, regNumber: "KA-01-CD-5678", type: "SUV" },
  { id: "v-3", customerId: "u-2", make: "Ford", model: "Focus", year: 2020, regNumber: "KA-02-EF-9012", type: "Hatchback" },
  { id: "v-4", customerId: "u-3", make: "Tesla", model: "Model 3", year: 2022, regNumber: "KA-03-GH-3456", type: "Sedan" },
]

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const BOOKINGS: Booking[] = [
  {
    id: "b-1001",
    customerId: "u-1",
    vehicleId: "v-1",
    serviceTypeId: "st-1",
    date: daysFromNow(-6),
    time: "09:00",
    status: "completed",
    mechanicId: "m-1",
    cost: 135,
    notes: "Routine annual service.",
    createdAt: daysFromNow(-10),
    progress: [
      { id: "p1", status: "confirmed", note: "Booking confirmed.", at: daysFromNow(-9) },
      { id: "p2", status: "in_progress", note: "Vehicle received, work started.", at: daysFromNow(-6) },
      { id: "p3", status: "completed", note: "Service completed, ready for pickup.", at: daysFromNow(-6) },
    ],
    parts: [
      { id: "pt-1", description: "Synthetic Engine Oil", cost: 15, quantity: 1 }
    ],
    laborHrs: 0,
    laborRate: 50,
  },
  {
    id: "b-1002",
    customerId: "u-1",
    vehicleId: "v-2",
    serviceTypeId: "st-3",
    date: daysFromNow(1),
    time: "11:30",
    status: "in_progress",
    mechanicId: "m-2",
    cost: 372,
    notes: "Front brake pads worn.",
    createdAt: daysFromNow(-2),
    progress: [
      { id: "p1", status: "confirmed", note: "Booking confirmed.", at: daysFromNow(-1) },
      { id: "p2", status: "in_progress", note: "Inspection underway.", at: daysFromNow(0) },
    ],
    parts: [
      { id: "pt-2", description: "Front Brake Pads Set", cost: 46, quantity: 2 },
      { id: "pt-3", description: "Dot 4 Brake Fluid", cost: 10, quantity: 1 }
    ],
    laborHrs: 1.5,
    laborRate: 60,
  },
  {
    id: "b-1003",
    customerId: "u-2",
    vehicleId: "v-3",
    serviceTypeId: "st-2",
    date: daysFromNow(2),
    time: "14:00",
    status: "confirmed",
    mechanicId: "m-4",
    cost: 60,
    notes: "",
    createdAt: daysFromNow(-1),
    progress: [
      { id: "p1", status: "confirmed", note: "Booking confirmed.", at: daysFromNow(-1) },
    ],
  },
  {
    id: "b-1004",
    customerId: "u-3",
    vehicleId: "v-4",
    serviceTypeId: "st-5",
    date: daysFromNow(3),
    time: "10:00",
    status: "pending",
    mechanicId: null,
    cost: 140,
    notes: "AC not cooling well.",
    createdAt: daysFromNow(0),
    progress: [],
  },
  {
    id: "b-1005",
    customerId: "u-2",
    vehicleId: "v-3",
    serviceTypeId: "st-7",
    date: daysFromNow(-15),
    time: "16:00",
    status: "completed",
    mechanicId: "m-2",
    cost: 90,
    notes: "Pulling to the left.",
    createdAt: daysFromNow(-18),
    progress: [
      { id: "p1", status: "confirmed", note: "Booking confirmed.", at: daysFromNow(-17) },
      { id: "p2", status: "completed", note: "Alignment corrected.", at: daysFromNow(-15) },
    ],
  },
]
