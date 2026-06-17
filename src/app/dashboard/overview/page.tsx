import * as React from "react"
import { getDashboardOverviewStats } from "@/actions/dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Building2,
  CheckCircle2,
  Star,
  Mail,
  Calendar,
  Activity,
  Plus,
  ArrowUpRight
} from "lucide-react"

export const revalidate = 0

export default async function DashboardOverviewPage() {
  const stats = await getDashboardOverviewStats()

  const cardItems = [
    { label: "Total Properties", value: stats.totalProperties, icon: Building2, color: "text-sky-400", bg: "bg-sky-500/5" },
    { label: "Active Listings", value: stats.activeProperties, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/5" },
    { label: "Featured Listings", value: stats.featuredProperties, icon: Star, color: "text-amber-400", bg: "bg-amber-500/5" },
    { label: "Total Inquiries", value: stats.totalInquiries, icon: Mail, color: "text-indigo-400", bg: "bg-indigo-500/5" },
    { label: "Total Appointments", value: stats.totalAppointments, icon: Calendar, color: "text-rose-400", bg: "bg-rose-500/5" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white">
            Operational Overview
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
            System performance, inventory counters, and real-time operations activity.
          </p>
        </div>
        <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase rounded-xl shadow-lg shadow-sky-500/10 transition">
          <Link href="/dashboard/properties/new" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Deploy Listing
          </Link>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cardItems.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className={`p-4 md:p-5 rounded-2xl border border-slate-900 ${card.bg} hover:border-slate-800 transition duration-300 relative group`}
            >
              <div className="absolute top-4 right-4 text-slate-700 group-hover:text-slate-500 transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                {card.label}
              </span>
              <span className={`text-2xl md:text-3xl font-black ${card.color} tracking-tight block mt-2`}>
                {card.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Section Split: Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-400" />
            System Live Log
          </h3>

          <div className="space-y-3 pt-2">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="flex gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-900/60 hover:border-slate-850/60 transition"
                >
                  <div className="text-[10px] text-slate-600 shrink-0 font-sans pt-0.5">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-200 uppercase tracking-wide">
                      {act.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans leading-relaxed">
                      {act.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-600 font-sans">
                No recent system logs recorded.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Console */}
        <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">
            Quick Actions Console
          </h3>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/dashboard/properties"
              className="flex justify-between items-center px-4 py-3 bg-slate-950/40 hover:bg-slate-900/30 rounded-xl border border-slate-900 hover:border-slate-800 transition group"
            >
              <span className="font-bold uppercase tracking-wide">Manage Catalog</span>
              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>

            <Link
              href="/dashboard/inquiries"
              className="flex justify-between items-center px-4 py-3 bg-slate-950/40 hover:bg-slate-900/30 rounded-xl border border-slate-900 hover:border-slate-800 transition group"
            >
              <span className="font-bold uppercase tracking-wide">Review Inquiries</span>
              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>

            <Link
              href="/dashboard/appointments"
              className="flex justify-between items-center px-4 py-3 bg-slate-950/40 hover:bg-slate-900/30 rounded-xl border border-slate-900 hover:border-slate-800 transition group"
            >
              <span className="font-bold uppercase tracking-wide">Inspect Schedules</span>
              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex justify-between items-center px-4 py-3 bg-slate-950/40 hover:bg-slate-900/30 rounded-xl border border-slate-900 hover:border-slate-800 transition group"
            >
              <span className="font-bold uppercase tracking-wide">Portal Settings</span>
              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
