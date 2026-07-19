"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  CarFront,
  ChevronLeft,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  Wrench,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import type { User } from "@/lib/types"

export default function StaffGateway() {
  const router = useRouter()
  const { users, login, theme, toggleTheme } = useStore()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  function go(user: User) {
    router.push(user.role === "admin" ? "/admin" : "/mechanic")
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    
    const user = login(email)
    if (!user) {
      setError("No staff account found with that email. Please check your credentials or contact an administrator.")
      return
    }
    
    // Restrict to staff roles
    if (user.role !== "admin" && user.role !== "mechanic") {
      setError("Access denied. Customers must use the main portal to log in.")
      return
    }
    
    go(user)
  }

  function quickLogin(role: "admin" | "mechanic") {
    const user = users.find((u) => u.role === role)
    if (user) {
      login(user.email)
      go(user)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      {/* LEFT COLUMN: Premium Corporate Branding Panel (Desktop Only) */}
      <aside className="hidden md:flex md:w-[42%] bg-slate-950 dark:bg-black text-white relative p-12 flex-col justify-between border-r border-white/5 select-none overflow-hidden">
        {/* Abstract glowing background meshes */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        
        {/* Pixel grid pattern on dark background */}
        <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />

        {/* Top brand heading */}
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Wrench className="h-5 w-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight">AutoCare Pro</span>
            <span className="text-[10px] text-zinc-400 font-semibold">Console Manager</span>
          </div>
        </div>

        {/* Center brand statement */}
        <div className="relative z-10 max-w-md space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
            Employee Portal
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.1] text-white">
            Operations Terminal.<br />
            Built For Precision.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Direct interface for certified mechanics and console dispatchers. Log parts, update live repair pipelines, and manage invoice logs.
          </p>
        </div>

        {/* Bottom live stats mockup ticker */}
        <div className="relative z-10 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3 backdrop-blur-xs">
          <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Live Terminal Feeds</p>
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Priya Sharma (Admin)</span>
              <span className="text-zinc-500">Oversight Dispatch Online</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sofia Martins (Tech)</span>
              <span className="text-zinc-500">Bay 3 Active (Oil Service)</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT COLUMN: Interactive Login Container (With bg-grid pattern) */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 bg-grid relative min-h-screen md:min-h-0">
        {/* Fading gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />

        {/* Top utility row */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-bold transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Customer Site
          </a>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md relative z-10">
          <div className="relative rounded-2xl border border-border/80 bg-card/65 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
            {/* Accent top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-primary to-info" />

            <h2 className="text-2xl font-extrabold text-foreground mt-1">Welcome Back</h2>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Manage your vehicle services in one place.</p>

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
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground select-none">OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-border/80" />
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">Work Email</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-5 w-5 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@autocare.com"
                    className="pl-9.5 h-12 bg-slate-50 dark:bg-zinc-900 border-border/80 text-base focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary/50 transition-all duration-150"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 select-none">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded-md border-border bg-slate-50 accent-primary cursor-pointer" defaultChecked />
                <label htmlFor="remember" className="text-xs font-bold text-muted-foreground cursor-pointer">Remember me for 30 days</label>
              </div>
              
              {error ? <p className="text-xs text-destructive font-medium mt-1">{error}</p> : null}
              
              <button
                type="submit"
                className="w-full mt-3 h-12 rounded-lg bg-gradient-to-r from-purple-500 via-primary to-blue-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Sign In <ArrowRight className="h-4 w-4" />
              </button>
            </form>


          </div>
        </div>
      </main>
    </div>
  )
}
