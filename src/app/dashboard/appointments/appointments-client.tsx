"use client"

import * as React from "react"
import { updateAppointmentStatus } from "@/actions/dashboard"
import { toast } from "sonner"
import { Calendar, User, Phone, Check, X, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

interface AppointmentsClientProps {
  initialAppointments: any[]
}

export function AppointmentsClient({ initialAppointments }: AppointmentsClientProps) {
  const [appointments, setAppointments] = React.useState(initialAppointments)
  const [activeTab, setActiveTab] = React.useState<string>("upcoming")

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === "upcoming") {
      return appt.status === "scheduled" || appt.status === "pending"
    }
    return appt.status === activeTab
  })

  const handleStatusUpdate = async (id: string, newStatus: "completed" | "cancelled") => {
    const oldStatus = appointments.find((a) => a.id === id)?.status

    // Optimistic update
    setPropertiesState(id, newStatus)

    try {
      await updateAppointmentStatus(id, newStatus)
      toast.success(`Visit marked as ${newStatus}`)
    } catch (err: any) {
      // Revert on error
      setPropertiesState(id, oldStatus)
      toast.error(err.message || "Failed to update appointment status")
    }
  }

  const setPropertiesState = (id: string, status: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  const tabs = [
    { id: "upcoming", label: "Upcoming visits" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" }
  ]

  return (
    <div className="space-y-6 font-sans">
      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-1 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[10px] font-mono font-extrabold uppercase tracking-wider border-b-2 transition duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "border-sky-500 text-sky-400 font-black"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl border border-slate-900 bg-slate-900/5 hover:border-slate-850 hover:bg-slate-900/10 transition flex flex-col justify-between gap-4 text-xs text-slate-400"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex justify-between items-start gap-4 pb-2.5 border-b border-slate-900/60 font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Calendar className="h-4 w-4 text-sky-400" />
                    <span className="font-bold text-[10px]">
                      {new Date(appt.appointment_date).toLocaleDateString()} @{" "}
                      {new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status indicators */}
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded tracking-wide ${
                    appt.status === "completed"
                      ? "text-emerald-400 bg-emerald-950/20 border border-emerald-900/40"
                      : appt.status === "cancelled"
                      ? "text-rose-400 bg-rose-950/20 border border-rose-900/40"
                      : "text-amber-400 bg-amber-950/20 border border-amber-900/40"
                  }`}>
                    {appt.status}
                  </span>
                </div>

                {/* Client user */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-650" />
                  <div>
                    <span className="text-slate-200 font-bold block">
                      {appt.users?.full_name || "Guest Client"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans block truncate mt-0.5">
                      {appt.users?.email || appt.email || "No email provided"}
                    </span>
                  </div>
                </div>

                {/* Note message */}
                {appt.message && (
                  <div className="bg-slate-950/30 border border-slate-900/50 p-3 rounded-lg text-slate-400 leading-relaxed italic text-[10px]">
                    "{appt.message}"
                  </div>
                )}

                {/* Property related */}
                {appt.properties && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-slate-650 uppercase">Listing:</span>
                    <Link
                      href={`/properties/${appt.properties.slug}`}
                      target="_blank"
                      className="text-sky-400 hover:underline flex items-center gap-0.5 truncate uppercase font-bold"
                    >
                      {appt.properties.title}
                      <ExternalLink className="h-3 w-3 inline shrink-0" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Action buttons (only for upcoming visits) */}
              {(appt.status === "scheduled" || appt.status === "pending") && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900/40 font-mono">
                  <button
                    onClick={() => handleStatusUpdate(appt.id, "completed")}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-emerald-950/40 bg-emerald-950/5 hover:bg-emerald-950/15 text-[9px] font-bold uppercase text-emerald-400 cursor-pointer transition"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(appt.id, "cancelled")}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-950/40 bg-rose-950/5 hover:bg-rose-950/15 text-[9px] font-bold uppercase text-rose-400 cursor-pointer transition"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 py-16 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-900 rounded-3xl">
            No visits scheduled in this category.
          </div>
        )}
      </div>
    </div>
  )
}
