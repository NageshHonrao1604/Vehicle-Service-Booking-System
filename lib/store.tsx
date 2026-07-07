"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  BOOKINGS,
  MECHANICS,
  SERVICE_TYPES,
  USERS,
  VEHICLES,
} from "./mock-data"
import type {
  Booking,
  BookingStatus,
  InvoiceItem,
  Mechanic,
  ServiceType,
  User,
  Vehicle,
} from "./types"

interface NewBookingInput {
  customerId: string
  vehicleId: string
  serviceTypeId: string
  date: string
  time: string
  notes: string
}

interface NewVehicleInput {
  customerId: string
  make: string
  model: string
  year: number
  regNumber: string
  type: Vehicle["type"]
}

interface StoreValue {
  currentUser: User | null
  users: User[]
  vehicles: Vehicle[]
  bookings: Booking[]
  mechanics: Mechanic[]
  serviceTypes: ServiceType[]
  theme: "light" | "dark"
  toggleTheme: () => void
  login: (email: string) => User | null
  loginAs: (user: User) => void
  register: (input: Omit<User, "id" | "role">) => User
  logout: () => void
  addVehicle: (input: NewVehicleInput) => void
  createBooking: (input: NewBookingInput) => void
  cancelBooking: (id: string) => void
  updateBookingStatus: (id: string, status: BookingStatus, note: string) => void
  assignMechanic: (id: string, mechanicId: string) => void
  updateBookingInvoice: (
    id: string,
    parts: InvoiceItem[],
    laborHrs: number,
    laborRate: number,
  ) => void
  addStaff: (name: string, email: string, role: "admin" | "mechanic", specialization?: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(USERS)
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES)
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS)
  const [mechanics, setMechanics] = useState<Mechanic[]>(MECHANICS)
  const [serviceTypes] = useState<ServiceType[]>(SERVICE_TYPES)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
    document.documentElement.classList.toggle("light", initialTheme === "light")

    const savedUsers = localStorage.getItem("autocare_users")
    if (savedUsers) setUsers(JSON.parse(savedUsers))

    const savedVehicles = localStorage.getItem("autocare_vehicles")
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles))

    const savedBookings = localStorage.getItem("autocare_bookings")
    if (savedBookings) setBookings(JSON.parse(savedBookings))

    const savedMechanics = localStorage.getItem("autocare_mechanics")
    if (savedMechanics) setMechanics(JSON.parse(savedMechanics))

    setIsLoaded(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("autocare_users", JSON.stringify(users))
    }
  }, [users, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("autocare_vehicles", JSON.stringify(vehicles))
    }
  }, [vehicles, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("autocare_bookings", JSON.stringify(bookings))
    }
  }, [bookings, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("autocare_mechanics", JSON.stringify(mechanics))
    }
  }, [mechanics, isLoaded])

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light"
      localStorage.setItem("theme", next)
      document.documentElement.classList.toggle("dark", next === "dark")
      document.documentElement.classList.toggle("light", next === "light")
      return next
    })
  }, [])

  const login = useCallback(
    (email: string): User | null => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (found) setCurrentUser(found)
      return found ?? null
    },
    [users],
  )

  const loginAs = useCallback((user: User) => setCurrentUser(user), [])

  const register = useCallback((input: Omit<User, "id" | "role">): User => {
    const user: User = { ...input, id: uid("u"), role: "customer" }
    setUsers((prev) => [...prev, user])
    setCurrentUser(user)
    return user
  }, [])

  const logout = useCallback(() => setCurrentUser(null), [])

  const addVehicle = useCallback((input: NewVehicleInput) => {
    setVehicles((prev) => [...prev, { ...input, id: uid("v") }])
  }, [])

  const createBooking = useCallback(
    (input: NewBookingInput) => {
      const service = serviceTypes.find((s) => s.id === input.serviceTypeId)
      const booking: Booking = {
        ...input,
        id: uid("b"),
        status: "pending",
        mechanicId: null,
        cost: service?.basePrice ?? 0,
        createdAt: new Date().toISOString().slice(0, 10),
        progress: [],
      }
      setBookings((prev) => [booking, ...prev])
    },
    [serviceTypes],
  )

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "cancelled",
              progress: [
                ...b.progress,
                {
                  id: uid("p"),
                  status: "cancelled",
                  note: "Booking cancelled.",
                  at: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : b,
      ),
    )
  }, [])

  const updateBookingStatus = useCallback(
    (id: string, status: BookingStatus, note: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status,
                progress: [
                  ...b.progress,
                  {
                    id: uid("p"),
                    status,
                    note: note || `Status updated to ${status}.`,
                    at: new Date().toISOString().slice(0, 10),
                  },
                ],
              }
            : b,
        ),
      )
    },
    [],
  )

  const assignMechanic = useCallback((id: string, mechanicId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, mechanicId } : b)),
    )
  }, [])

  const updateBookingInvoice = useCallback(
    (id: string, parts: InvoiceItem[], laborHrs: number, laborRate: number) => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b
          const service = serviceTypes.find((s) => s.id === b.serviceTypeId)
          const basePrice = service?.basePrice ?? 0
          const partsCost = parts.reduce((sum, item) => sum + item.cost * item.quantity, 0)
          const laborCost = laborHrs * laborRate
          const newCost = basePrice + partsCost + laborCost
          return {
            ...b,
            parts,
            laborHrs,
            laborRate,
            cost: newCost,
          }
        }),
      )
    },
    [serviceTypes],
  )

  const addStaff = useCallback(
    (name: string, email: string, role: "admin" | "mechanic", specialization?: string) => {
      const newUserId = uid(role === "admin" ? "u-admin" : "m")
      const newUser: User = {
        id: newUserId,
        name,
        email,
        phone: "+1 555 0000",
        role,
      }
      setUsers((prev) => [...prev, newUser])
      if (role === "mechanic") {
        setMechanics((prev) => [
          ...prev,
          {
            id: newUserId,
            name,
            email,
            specialization: specialization || "General repairs",
            active: true,
          },
        ])
      }
    },
    [],
  )

  const value = useMemo<StoreValue>(
    () => ({
      currentUser,
      users,
      vehicles,
      bookings,
      mechanics,
      serviceTypes,
      theme,
      toggleTheme,
      login,
      loginAs,
      register,
      logout,
      addVehicle,
      createBooking,
      cancelBooking,
      updateBookingStatus,
      assignMechanic,
      updateBookingInvoice,
      addStaff,
    }),
    [
      currentUser,
      users,
      vehicles,
      bookings,
      mechanics,
      serviceTypes,
      theme,
      toggleTheme,
      login,
      loginAs,
      register,
      logout,
      addVehicle,
      createBooking,
      cancelBooking,
      updateBookingStatus,
      assignMechanic,
      updateBookingInvoice,
      addStaff,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
