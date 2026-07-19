"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LogOut, Wrench, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import type { Role } from "@/lib/types"
import { cn } from "@/lib/utils"

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: Role
  title: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const { currentUser, logout, theme, toggleTheme } = useStore()

  useEffect(() => {
    if (!currentUser || currentUser.role !== role) {
      router.replace("/")
    }
  }, [currentUser, role, router])

  if (!currentUser || currentUser.role !== role) {
    return null
  }

  function handleLogout() {
    logout()
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <Wrench className="h-4.5 w-4.5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold tracking-tight">AutoCare Pro</span>
            <span className="text-[10px] text-muted-foreground">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-border p-1 outline-none">
              <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                {initials(currentUser.name)}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{currentUser.name}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{currentUser.email}</span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card px-4 py-6 text-foreground h-screen sticky top-0 shrink-0 justify-between select-none">
        <div className="flex flex-col gap-6">
          {/* Brand header */}
          <div className="flex items-center gap-2.5 px-2">
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Wrench className="h-5 w-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight">AutoCare Pro</span>
              <span className="text-xs text-muted-foreground font-semibold">Console Manager</span>
            </div>
          </div>

          {/* Role pill badge */}
          <div className="px-2">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
              role === "admin"
                ? "bg-primary/10 text-primary"
                : role === "mechanic"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                  : "bg-info/10 text-info",
            )}>
              {role === "admin" ? "Administrator" : role === "mechanic" ? "Mechanic" : "Client Portal"}
            </span>
          </div>



        </div>

        {/* User Card footer with Dropdown trigger */}
        <div className="border-t border-border pt-4 px-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center gap-2.5 text-left outline-none cursor-pointer group/user select-none">
              <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground shadow-sm group-hover/user:bg-primary group-hover/user:text-primary-foreground transition-colors">
                {initials(currentUser.name)}
              </span>
              <div className="flex flex-col leading-tight truncate flex-1">
                <span className="text-xs font-bold text-foreground truncate group-hover/user:text-primary transition-colors">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground truncate">{currentUser.email}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 mb-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{currentUser.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{currentUser.email}</span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Workspace Frame with grid backdrop pattern */}
      <div className="flex-1 flex flex-col min-w-0 bg-grid relative overflow-x-hidden">
        {/* Subtle radial fading grid mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/90 to-background pointer-events-none" />

        <main className="flex-1 relative z-10 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-gradient-to-br from-card to-muted/30 p-5 shadow-xs hover:shadow-md transition-all hover:border-primary/20 duration-300 group">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {hint ? (
        <p className="mt-1.5 text-sm text-muted-foreground font-medium">{hint}</p>
      ) : null}
    </div>
  )
}
