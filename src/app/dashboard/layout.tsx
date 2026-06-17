import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogoutButton } from "./logout-button"
import {
  LayoutDashboard,
  Building2,
  Mail,
  Calendar,
  BarChart3,
  Settings,
  ShieldCheck,
  Home
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient()

  // 1. Verify Session & Admin Privilege
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  const isSystemAdmin = profile?.role === "admin" || user.email === "test.seller.verified@gmail.com"

  if (!isSystemAdmin) {
    redirect("/login")
  }

  const navLinks = [
    { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/properties", label: "Properties", icon: Building2 },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: Mail },
    { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings }
  ]

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950 text-slate-100 flex font-mono text-xs overflow-hidden select-none">
      {/* Sidebar background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.015),transparent_70%)] pointer-events-none" />
      
      {/* 1. SIDEBAR PANEL */}
      <aside className="w-64 bg-slate-900/30 border-r border-slate-900/80 backdrop-blur-xl flex flex-col justify-between p-6 z-10">
        <div className="space-y-8">
          {/* Logo HUD */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-900/60">
            <div className="h-6.5 w-6.5 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <ShieldCheck className="h-4.5 w-4.5 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                REALTYPRO
              </span>
              <span className="block text-[8px] text-slate-500 font-sans tracking-widest uppercase">
                ADMIN CONSOLE v1.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-900/30 text-slate-400 hover:text-sky-400 transition-all duration-200 group"
                >
                  <Icon className="h-4.5 w-4.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-4 pt-4 border-t border-slate-900/60">
          {/* User profile HUD */}
          <div className="flex flex-col gap-1 px-1">
            <span className="text-[10px] font-bold text-slate-300 truncate">
              {profile?.full_name || "Admin"}
            </span>
            <span className="text-[8px] text-slate-500 truncate font-sans">
              {user.email}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-[10px] font-bold uppercase text-slate-400 hover:text-white transition"
            >
              <Home className="h-3.5 w-3.5" />
              SITE
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEW */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/20 relative z-10">
        {/* Glow indicator */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent pointer-events-none" />
        <div className="flex-1 overflow-y-auto p-8 md:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
