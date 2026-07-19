"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  CalendarClock,
  CarFront,
  ClipboardList,
  Gauge,
  Moon,
  ShieldCheck,
  Sun,
  Wrench,
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Activity,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import type { User } from "@/lib/types"

const SERVICES = [
  { id: "st-1", name: "General Service", price: 120, time: "3 hrs", desc: "Routine oil change, fluid top-up, filter check, and 40-point safety inspection." },
  { id: "st-2", name: "Oil & Filter Change", price: 60, time: "1 hr", desc: "Premium synthetic oil replacement and new OEM filter installation." },
  { id: "st-3", name: "Brake Diagnostics & Repair", price: 180, time: "2 hrs", desc: "Full inspection of pads, rotors, and calipers. Fluid flush and replacement." },
  { id: "st-4", name: "Tyre Replacement & Balance", price: 320, time: "1 hr", desc: "Mounting, balancing, and alignment check for 4 premium tyres." },
  { id: "st-5", name: "AC Service & Recharge", price: 140, time: "2 hrs", desc: "Refrigerant recharge, leak inspection, and cabin filter replacement." },
  { id: "st-6", name: "Battery Replacement", price: 150, time: "1 hr", desc: "High-performance battery installation and charging system check." },
]

const FAQS = [
  { q: "How does the live status tracking work?", a: "Once your vehicle is admitted, our technicians log progress directly from the garage floor. You can view diagnostic details, see parts being replaced, and review labor hours in real-time." },
  { q: "Are quotes finalized before service begins?", a: "Yes. After inspection, the mechanic uploads an itemized list of parts and labor. We require client authorization inside the portal before beginning any work." },
  { q: "Can I register multiple vehicles to one account?", a: "Absolutely. You can add your entire fleet or family lineup under your Customer Dashboard with monospace license plate tags for unified billing." },
  { q: "Who performs the diagnostic evaluations?", a: "Every service is assigned to ASE Certified Technicians with specialized training in electrical diagnostics, mechanical repairs, and software recalibrations." }
]

export default function CorporateLandingPage() {
  const router = useRouter()
  const { users, login, register, theme, toggleTheme } = useStore()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [reg, setReg] = useState({ name: "", email: "", phone: "" })

  const [activeSandboxTab, setActiveSandboxTab] = useState<"client" | "mechanic" | "dispatcher">("client")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function go(user: User) {
    router.push(
      user.role === "admin"
        ? "/admin"
        : user.role === "mechanic"
          ? "/mechanic"
          : "/customer",
    )
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const user = login(email)
    if (!user) {
      setError("No account found with that email. Try a demo account below.")
      return
    }
    if (user.role === "admin" || user.role === "mechanic") {
      setError("Access denied. Staff members must use the Staff Portal to log in.")
      return
    }
    go(user)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!reg.name || !reg.email) {
      setError("Name and email are required.")
      return
    }
    const user = register(reg)
    go(user)
  }

  function quickLogin(role: "customer") {
    const user = users.find((u) => u.role === "customer" && u.id === "u-1")
    if (user) {
      login(user.email)
      go(user)
    }
  }

  function scrollToSection(id: string) {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col bg-grid relative">
      {/* Grid mask overlay for fade-out */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <CarFront className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                AutoCare Pro
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-lg font-bold text-slate-800 dark:text-zinc-200">
              <button onClick={() => scrollToSection("services")} className="hover:text-foreground transition-colors cursor-pointer">Services</button>
              <button onClick={() => scrollToSection("pricing")} className="hover:text-foreground transition-colors cursor-pointer">Pricing</button>
              <button onClick={() => scrollToSection("why-us")} className="hover:text-foreground transition-colors cursor-pointer">Why Choose Us</button>
              <button onClick={() => scrollToSection("booking")} className="hover:text-foreground transition-colors cursor-pointer">Client Portal</button>
            </nav>

            <div className="flex items-center gap-3">
              <Button onClick={() => scrollToSection("booking")} variant="outline" className="text-base h-11 px-5 cursor-pointer md:flex">
                Sign In
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            {/* Ambient glows */}
            <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-info/5 blur-3xl" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Heading and CTAs */}
                <div className="lg:col-span-7 text-left space-y-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-xs shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Certified Automotive Specialists
                  </span>
                  <h1 className="text-pretty text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.1] sm:leading-[1.1]">
                    Precision Auto Care,<br />
                    <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                      Scheduled In Seconds.
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl leading-relaxed text-slate-800 dark:text-zinc-200 font-semibold max-w-xl">
                    AutoCare Pro makes maintenance hassle-free. Book certified technicians online, track service status in real-time, and download complete digital invoices.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button onClick={() => scrollToSection("booking")} size="lg" className="gap-2 cursor-pointer bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200">
                      Book Appointment <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => scrollToSection("services")} variant="outline" size="lg" className="cursor-pointer hover:bg-muted/65 border-border/80 shadow-xs backdrop-blur-xs">
                      Explore Services
                    </Button>
                  </div>
                </div>

                {/* Right Column: Premium Hero Image Frame */}
                <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                  {/* Decorative glowing backdrops */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/35 to-info/20 blur-xl opacity-75" />
                  
                  <div className="relative rounded-2xl border border-border/80 bg-card p-2 shadow-2xl overflow-hidden group max-w-md lg:max-w-full">
                    <img 
                      src="/hero-garage.jpg" 
                      alt="State of the art AutoCare Pro garage bay" 
                      className="rounded-xl object-cover w-full h-[280px] lg:h-[340px] shadow-inner group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Brand Highlights Bar */}
        <section className="border-y border-border bg-card/50 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-y-4 md:grid-cols-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">15,000+</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-zinc-200">Vehicles Serviced</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-zinc-200">ASE Certified Techs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4.9 ★</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-zinc-200">Customer Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Live</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-zinc-200">Status Progress Tracker</p>
            </div>
          </div>
        </section>

        {/* AI Operations Section */}
        <section className="py-24 bg-card/5 border-b border-border relative select-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/10 to-info/5 blur-2xl opacity-60 pointer-events-none" />
                <div className="relative rounded-2xl border border-border/80 bg-card p-5 shadow-xl w-full max-w-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">DISPATCH STATUS</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-muted-foreground font-semibold">Matched Tech</span>
                      <span className="font-bold text-foreground">Sofia Martins</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-muted-foreground font-semibold">Bay Allocation</span>
                      <span className="font-bold text-foreground">Bay 3 (Diagnostics)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-muted-foreground font-semibold">Pre-Staged Parts</span>
                      <span className="font-bold text-emerald-500">Gaskets Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 text-left space-y-6">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">Automated Scheduling</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Intelligent Dispatcher Engine
                </h2>
                <p className="text-lg leading-relaxed text-slate-800 dark:text-zinc-200 font-semibold max-w-2xl">
                  Our system doesn't just record bookings. It orchestrates garage flow to keep diagnostics, parts staging, and technician workloads balanced.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div>
                    <h4 className="font-extrabold text-foreground text-base tracking-tight flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">01</span>
                      Predictive Durations
                    </h4>
                    <p className="text-base text-slate-800 dark:text-zinc-200 mt-2 leading-relaxed font-semibold">
                      Calculates exact repair time estimates by cross-referencing vehicle history logs, model years, and active mechanic queues.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-foreground text-base tracking-tight flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">02</span>
                      Pre-Staged Parts Staging
                    </h4>
                    <p className="text-base text-slate-800 dark:text-zinc-200 mt-2 leading-relaxed font-semibold">
                      Predicts which gaskets, pads, or fluids will be needed based on system diagnostics, pulling parts ahead of vehicle admission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Modules Showcase Section */}
        <section id="modules" className="py-24 bg-slate-950 text-white border-y border-white/5 relative overflow-hidden select-none">
          {/* Neon ambient glows */}
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">System Suite</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">One Connected Operations Suite</h2>
              <p className="mt-3 text-base text-zinc-400 max-w-xl mx-auto">
                Our platform synchronizes customer schedules, technician job cards, and dispatcher records in a single cloud pipeline.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* Module 1: Customer Portal */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 shadow-xs flex flex-col justify-between hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 group/module">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover/module:bg-primary group-hover/module:text-white transition-all">
                    <CarFront className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">Customer Portal</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    A self-service workspace allowing clients to register profiles, book repair slots, and track maintenance without phone calls.
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm text-zinc-400 border-t border-white/[0.08] pt-4">
                    <li className="flex items-center gap-2"><span className="text-primary font-bold">✓</span> Multi-vehicle registration profiles</li>
                    <li className="flex items-center gap-2"><span className="text-primary font-bold">✓</span> Live booking calendar & scheduler</li>
                    <li className="flex items-center gap-2"><span className="text-primary font-bold">✓</span> Complete digital invoice receipts</li>
                  </ul>
                </div>
              </div>

              {/* Module 2: Mechanic Bay Console */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 shadow-xs flex flex-col justify-between hover:-translate-y-1 hover:border-amber-500/30 hover:bg-white/[0.04] transition-all duration-300 group/module">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover/module:bg-amber-500 group-hover/module:text-black transition-all">
                    <Wrench className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">Technician Workspace</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    A garage floor terminal for mechanics to claim active job cards, log parts usage, and update repair progress.
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm text-zinc-400 border-t border-white/[0.08] pt-4">
                    <li className="flex items-center gap-2"><span className="text-amber-500 font-bold">✓</span> Step-by-step repair status pipelines</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500 font-bold">✓</span> Itemized parts logging & calculations</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500 font-bold">✓</span> Direct dispatcher queue integration</li>
                  </ul>
                </div>
              </div>

              {/* Module 3: Admin Operations Console */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 shadow-xs flex flex-col justify-between hover:-translate-y-1 hover:border-teal-500/30 hover:bg-white/[0.04] transition-all duration-300 group/module">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 group-hover/module:bg-teal-500 group-hover/module:text-white transition-all">
                    <ShieldCheck className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">Operations Control Center</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    An administrative hub for service managers to assign technician jobs, manage customer profiles, and review financials.
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm text-zinc-400 border-t border-white/[0.08] pt-4">
                    <li className="flex items-center gap-2"><span className="text-teal-500 font-bold">✓</span> Interactive central dispatcher logs</li>
                    <li className="flex items-center gap-2"><span className="text-teal-500 font-bold">✓</span> Real-time status pipeline control</li>
                    <li className="flex items-center gap-2"><span className="text-teal-500 font-bold">✓</span> SVG category analytics & revenue reports</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Interactive Sandbox Demo (Flagship Visual Widget) */}
        <section id="sandbox" className="py-24 bg-background border-b border-border relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Interactive Sandbox</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Preview The Operations Console</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Select a console role below to test out interactive layout previews of the connected portal screens.
              </p>
            </div>

            {/* Interactive Tabs Menu */}
            <div className="flex justify-center gap-3 mb-8">
              <button 
                onClick={() => setActiveSandboxTab("client")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${activeSandboxTab === "client" ? "bg-primary border-primary text-primary-foreground shadow-md" : "bg-card border-border hover:bg-muted text-muted-foreground"}`}
              >
                Customer App Preview
              </button>
              <button 
                onClick={() => setActiveSandboxTab("mechanic")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${activeSandboxTab === "mechanic" ? "bg-primary border-primary text-primary-foreground shadow-md" : "bg-card border-border hover:bg-muted text-muted-foreground"}`}
              >
                Technician Terminal
              </button>
              <button 
                onClick={() => setActiveSandboxTab("dispatcher")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${activeSandboxTab === "dispatcher" ? "bg-primary border-primary text-primary-foreground shadow-md" : "bg-card border-border hover:bg-muted text-muted-foreground"}`}
              >
                Operations Hub (Admin)
              </button>
            </div>

            {/* Browser Mockup Frame */}
            <div className="mx-auto max-w-4xl relative rounded-2xl border border-border/80 bg-card p-1 shadow-2xl overflow-hidden">
              {/* Header controls */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-muted/40">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="h-5 bg-muted border border-border/60 rounded-md flex-1 text-[9px] font-bold text-zinc-500 flex items-center justify-center select-none ml-3">
                  {activeSandboxTab === "client" ? "autocarepro.com/customer/james_carter" : activeSandboxTab === "mechanic" ? "autocarepro.com/mechanic/sofia_martins" : "autocarepro.com/admin/dispatcher"}
                </div>
              </div>

              {/* Simulated Screen Body */}
              <div className="bg-slate-50 dark:bg-zinc-950 p-6 min-h-[300px] flex flex-col justify-between text-foreground">
                {activeSandboxTab === "client" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border/60 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-foreground">Hello, James Carter</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Manage your active vehicle services and quotes.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-[9px] border border-primary/20">Client Access</span>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">REGISTERED VEHICLE</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold">Honda CR-V (2021)</span>
                          <span className="font-mono text-[9px] bg-muted px-2 py-0.5 rounded-md border border-border text-foreground font-semibold">MH-12-PQ-990</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">ACTIVE REPAIR</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-primary">Brake Pad Replacement</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">Parts Replacement</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSandboxTab === "mechanic" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border/60 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-foreground">Technician Queue — Sofia Martins</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Logging repair check sheets at Bay 3.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-bold text-[9px] border border-amber-500/20">Mechanic terminal</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="rounded-xl border border-border/80 bg-card p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <span className="font-bold text-foreground">Oil Leak Diagnostics</span>
                        </div>
                        <span className="text-[8px] font-bold text-zinc-400">Toyota RAV4 · Assigned by Priya</span>
                      </div>

                      <div className="rounded-xl border border-border/80 bg-card p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-foreground">AC Evaporator Recharge</span>
                        </div>
                        <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Completed</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSandboxTab === "dispatcher" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border/60 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-foreground">Operations dispatch Control</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Pairing customer booking schedulers with active bays.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-500 font-bold text-[9px] border border-teal-500/20">dispatcher Panel</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-border/80 bg-card p-3.5 text-center">
                        <span className="text-[9px] font-bold uppercase text-zinc-400">Total Bookings</span>
                        <p className="text-xl font-black text-foreground mt-1">12</p>
                      </div>
                      <div className="rounded-xl border border-border/80 bg-card p-3.5 text-center">
                        <span className="text-[9px] font-bold uppercase text-zinc-400">Active Bays</span>
                        <p className="text-xl font-black text-foreground mt-1">3 / 4</p>
                      </div>
                      <div className="rounded-xl border border-border/80 bg-card p-3.5 text-center">
                        <span className="text-[9px] font-bold uppercase text-zinc-400">Revenue Today</span>
                        <p className="text-xl font-black text-emerald-500 mt-1">₹1,240</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 border-t border-border/60 pt-4 flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                  <span>Press 'Launch Portal' to run the live database sync.</span>
                  <span className="text-primary hover:underline cursor-pointer inline-flex items-center gap-0.5" onClick={() => scrollToSection("booking")}>Go to gateway <ArrowRight className="h-3 w-3" /></span>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Services Showcase Section */}
        <section id="services" className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Service Offerings</h2>
              <p className="mt-3 text-lg text-slate-800 dark:text-zinc-200 font-semibold">
                We handle everything from simple preventative maintenance to complex engine repairs. Transparent pricing with OEM parts.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <div key={s.id} className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-350 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 flex flex-col justify-between overflow-hidden">
                  {/* Subtle hover gradient backdrop glow */}
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-primary/3 blur-2xl group-hover:bg-primary/10 transition-all duration-350 pointer-events-none" />

                  <div className="relative z-10">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/10 to-info/5 border border-primary/15 text-primary group-hover:from-primary group-hover:to-blue-600 group-hover:text-white transition-all duration-350 shadow-xs">
                      <Wrench className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-350">{s.name}</h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-800 dark:text-zinc-200 font-semibold">{s.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-sm font-semibold text-foreground relative z-10">
                    <span className="text-slate-800 dark:text-zinc-200 font-extrabold inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-800 dark:text-zinc-300" /> {s.time}
                    </span>
                    <span className="text-primary text-base font-black tracking-tight">from ₹{s.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us" className="py-20 bg-card/30 border-y border-border relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Precision Care</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Engineered for Transparency</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-800 dark:text-zinc-200 font-semibold">
                Traditional workshops lack clear updates, resulting in customer anxiety. AutoCare Pro bridges the gap with a fully digital pipeline, allowing customers to view status changes logged directly by mechanics.
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                <li className="flex gap-3 text-base">
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Digital Status Pipeline</span>
                    <p className="text-base text-slate-800 dark:text-zinc-200 mt-0.5 font-medium">Follow inspection, diagnostic, and collection phases live.</p>
                  </div>
                </li>
                <li className="flex gap-3 text-base">
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Itemized Receipts</span>
                    <p className="text-base text-slate-800 dark:text-zinc-200 mt-0.5 font-medium">Full breakdown of parts, lubricants, taxes, and labor hours.</p>
                  </div>
                </li>
                <li className="flex gap-3 text-base">
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Certified Mechanic Logins</span>
                    <p className="text-base text-slate-800 dark:text-zinc-200 mt-0.5 font-medium">Notes, fluids, and parts are logged straight from the garage floor.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative flex justify-center">
              {/* Glowing shadow background */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 to-info/10 blur-2xl opacity-70 pointer-events-none" />

              {/* Smartphone Frame Container */}
              <div className="relative w-[280px] sm:w-[310px] rounded-[36px] border-8 border-slate-900 bg-slate-950 p-3 shadow-2xl select-none text-white ring-4 ring-slate-800">
                {/* Smartphone Speaker/Camera Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-slate-900 z-30 flex items-center justify-center">
                  <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                </div>

                {/* Smartphone Inner Screen Canvas */}
                <div className="rounded-[26px] bg-slate-900 p-4 pt-6 overflow-hidden relative min-h-[380px] flex flex-col justify-between">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 px-1 mb-4 select-none">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1">
                      <span>5G</span>
                      <div className="w-4 h-2 rounded-xs border border-zinc-500 p-0.5 flex items-center">
                        <div className="w-full h-full bg-zinc-400 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* App Branding Top Header */}
                  <div className="flex items-center gap-1.5 border-b border-white/5 pb-3">
                    <span className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                      <Wrench className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-black tracking-tight text-white leading-none">AutoCare Pro</span>
                      <span className="text-[9px] text-zinc-400 font-semibold leading-none mt-0.5">Live Repair Tracker</span>
                    </div>
                  </div>

                  {/* Mock Content: Service Progress Block */}
                  <div className="flex-1 mt-4 space-y-4">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400">
                        <span>ESTIMATE PRICE</span>
                        <span className="text-zinc-500">REF: #AC-8890</span>
                      </div>
                      <p className="text-base font-black text-white mt-1">₹240.00</p>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex gap-2.5">
                        <span className="h-4.5 w-4.5 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">Booking Confirmed</span>
                          <span className="text-[10px] text-zinc-400">James Carter · Honda CR-V</span>
                        </div>
                      </div>

                      <div className="flex gap-2.5">
                        <span className="h-4.5 w-4.5 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">Diagnostics & Disassembly</span>
                          <span className="text-[10px] text-zinc-400">Sofia Martins checking brake rotors.</span>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <span className="h-4.5 w-4.5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">●</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">Parts Replacement</span>
                          <span className="text-[10px] text-zinc-300 leading-normal font-normal">Fitting high-performance carbon-ceramic brake pads.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Home Indicator Bar */}
                  <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mt-4 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / CTA section */}
        <section id="pricing" className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Clear Pricing. No Hidden Surcharges.</h2>
            <p className="mt-3 text-base text-slate-800 dark:text-zinc-200 font-semibold">
              All quotes are generated using standardized flat rates. Before work begins, mechanics present itemized parts costs for authorization.
            </p>
          </div>
        </section>

        {/* Booking Portal & Login Section */}
        <section id="booking" className="py-20 bg-gradient-to-t from-primary/5 via-transparent to-transparent border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready to Experience<br />AutoCare Pro?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-800 dark:text-zinc-200 font-semibold max-w-md">
                Register your vehicle and pick a convenient time slot. Our mechanics will handle the rest. Check progress updates via SMS or log in at any time to review.
              </p>

              <div className="mt-8 flex flex-col gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-foreground">Book appointments 24/7 online</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ClipboardList className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-foreground">Access complete repair logs instantly</span>
                </div>
              </div>
            </div>

            {/* Login Dialog Box */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl" />
              <div className="relative rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
                {/* Accent top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-info to-teal-500" />
                
                <h3 className="text-xl font-extrabold text-foreground mt-1">Welcome Back</h3>
                <p className="text-sm text-slate-800 dark:text-zinc-200 mt-1.5 font-medium">Manage your vehicle services in one place.</p>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button type="button" className="flex items-center justify-center h-12 border border-border/80 bg-slate-50 dark:bg-zinc-900 rounded-xl hover:bg-muted font-bold text-sm cursor-pointer transition-colors">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.92 3.04c.97-2.91 3.7-5.56 6.69-5.56z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z" />
                      <path fill="#FBBC05" d="M5.31 10.6A7.16 7.16 0 0 1 12 7.04c.03 0 .07 0 .1.01V2.51C10.74 2.5 9.38 2.5 8 2.5 3.35 2.5.58 5.75.58 5.75l4.73 3.65c0 .4.4 1 .4 1.2z" />
                      <path fill="#34A853" d="M12 18.96c-2.99 0-5.72-2.65-6.69-5.56L1.39 16.44C3.37 20.33 7.35 23 12 23c2.98 0 5.68-.99 7.64-2.69l-3.73-2.89c-1.07.72-2.44 1.54-3.91 1.54z" />
                    </svg>
                    Google
                  </button>
                  <button type="button" className="flex items-center justify-center h-12 border border-border/80 bg-slate-50 dark:bg-zinc-900 rounded-xl hover:bg-muted font-bold text-sm cursor-pointer transition-colors">
                    <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.22.694.825.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </button>
                </div>

                <div className="flex items-center gap-3 my-5">
                  <div className="h-px flex-1 bg-border/80" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-slate-800 dark:text-zinc-200 select-none">OR CONTINUE WITH</span>
                  <div className="h-px flex-1 bg-border/80" />
                </div>

                <Tabs defaultValue="signin">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-1 rounded-xl h-12">
                    <TabsTrigger value="signin" className="cursor-pointer py-2 text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">Sign In</TabsTrigger>
                    <TabsTrigger value="register" className="cursor-pointer py-2 text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="mt-5 space-y-4">
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email" className="text-sm font-bold text-slate-800 dark:text-zinc-200">Email Address</Label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3 h-5 w-5 text-muted-foreground/70" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="james@example.com"
                            className="pl-9.5 h-12 bg-slate-50 dark:bg-zinc-900 border-border/80 text-base focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/50 transition-all duration-150"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="text-sm font-bold text-slate-800 dark:text-zinc-200">Password</Label>
                          <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative flex items-center">
                          <ShieldCheck className="absolute left-3 h-5 w-5 text-muted-foreground/70" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9.5 h-12 bg-slate-50 dark:bg-zinc-900 border-border/80 text-base focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/50 transition-all duration-150"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 select-none">
                        <input type="checkbox" id="remember" className="h-4 w-4 rounded-md border-border bg-slate-50 accent-primary cursor-pointer" defaultChecked />
                        <label htmlFor="remember" className="text-sm font-bold text-slate-800 dark:text-zinc-200 cursor-pointer">Remember me for 30 days</label>
                      </div>

                      {error ? <p className="text-xs text-destructive font-medium mt-1">{error}</p> : null}
                      <button
                        type="submit"
                        className="w-full mt-3 h-12 rounded-lg bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        Sign In <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="mt-5 space-y-4">
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-name" className="text-sm font-bold text-slate-800 dark:text-zinc-200">Full Name</Label>
                        <div className="relative flex items-center">
                          <CarFront className="absolute left-3 h-5 w-5 text-muted-foreground/70" />
                          <Input
                            id="reg-name"
                            placeholder="Jane Doe"
                            className="pl-9.5 h-12 bg-slate-50 dark:bg-zinc-900 border-border/80 text-base focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/50 transition-all duration-150"
                            value={reg.name}
                            onChange={(e) => setReg({ ...reg, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-email" className="text-sm font-bold text-slate-800 dark:text-zinc-200">Email Address</Label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3 h-5 w-5 text-muted-foreground/70" />
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-9.5 h-12 bg-slate-50 dark:bg-zinc-900 border-border/80 text-base focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/50 transition-all duration-150"
                            value={reg.email}
                            onChange={(e) => setReg({ ...reg, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-phone" className="text-sm font-bold text-slate-800 dark:text-zinc-200">Phone Number</Label>
                        <div className="relative flex items-center">
                          <Phone className="absolute left-3 h-5 w-5 text-muted-foreground/70" />
                          <Input
                            id="reg-phone"
                            placeholder="+1 555 0000"
                            className="pl-9.5 h-12 bg-slate-50 dark:bg-zinc-900 border-border/80 text-base focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/50 transition-all duration-150"
                            value={reg.phone}
                            onChange={(e) => setReg({ ...reg, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reg-password" className="text-sm font-bold text-slate-800 dark:text-zinc-200">Create Password</Label>
                        <div className="relative flex items-center">
                          <ShieldCheck className="absolute left-3 h-5 w-5 text-muted-foreground/70" />
                          <Input
                            id="reg-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9.5 h-12 bg-slate-50 dark:bg-zinc-900 border-border/80 text-base focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/50 transition-all duration-150"
                          />
                        </div>
                      </div>
                      {error ? <p className="text-xs text-destructive font-medium mt-1">{error}</p> : null}
                      <button
                        type="submit"
                        className="w-full mt-3 h-12 rounded-lg bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        Create Account <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Staff Gateway Portal Link */}
                <div className="mt-8 border-t border-border/85 pt-6 flex flex-col gap-4">
                  <div className="text-center">
                    <p className="text-base text-slate-800 dark:text-zinc-200">
                      Are you an employee?{" "}
                      <a href="/staff" className="text-primary hover:underline font-bold inline-flex items-center gap-0.5">
                        Staff Gateway <ChevronRight className="h-4 w-4" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section (Accordion Cards) */}
        <section id="faq" className="py-24 bg-card/25 border-t border-border relative">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Support</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card p-5 transition-all hover:shadow-md hover:border-primary/30 select-none">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)} 
                    className="w-full flex justify-between items-center text-left cursor-pointer outline-none font-bold text-foreground text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${openFaq === idx ? "rotate-180 text-foreground" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-200 ease-in-out ${openFaq === idx ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Call To Action (Last Push) */}
        <section className="py-24 bg-slate-950 text-white border-t border-white/5 relative overflow-hidden select-none">
          {/* Neon ambient glows */}
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Upgrade Your Vehicle Care?
            </h2>
            <p className="text-lg text-zinc-300 max-w-xl mx-auto font-medium leading-relaxed">
              Join thousands of drivers booking services in seconds. Access real-time diagnostic trackers, transparent billing invoices, and certified mechanics.
            </p>
            <div className="pt-2">
              <Button onClick={() => scrollToSection("booking")} size="lg" className="gap-2 cursor-pointer bg-white text-slate-950 hover:bg-zinc-200 transition-all font-bold rounded-xl shadow-lg shadow-white/10 active:scale-[0.99]">
                Launch System Demo <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-border bg-card py-12 text-xs text-muted-foreground mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Wrench className="h-4 w-4" />
              </span>
              <span className="font-extrabold tracking-tight">AutoCare Pro</span>
            </div>
            <p className="leading-relaxed">
              Standardized diagnostics, transparent invoice reports, and real-time maintenance logs straight from our bays to your phone.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-foreground uppercase tracking-wider mb-3">Service Hours</h5>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Mon - Fri: 8:00 AM - 6:00 PM</li>
              <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Saturday: 9:00 AM - 3:00 PM</li>
              <li className="text-destructive font-bold">Sunday: Closed</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-foreground uppercase tracking-wider mb-3">Contact Support</h5>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +1 555 0100</li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@autocare.com</li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> billing@autocare.com</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-foreground uppercase tracking-wider mb-3">Location</h5>
            <p className="flex gap-2 leading-relaxed">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              100 Main St,<br />
              Downtown Tech City,<br />
              TC 10101
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-center">
          <p>© {new Date().getFullYear()} AutoCare Pro Centers. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
