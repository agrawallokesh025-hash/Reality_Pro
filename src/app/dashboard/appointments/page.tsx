import * as React from "react"
import { getAppointments } from "@/actions/dashboard"
import { AppointmentsClient } from "./appointments-client"

export const revalidate = 0

export default async function DashboardAppointmentsPage() {
  const appointments = await getAppointments()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white">
          Site Visits & Appointments
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
          Inspect upcoming scheduling windows, complete site tours, or cancel pending visits.
        </p>
      </div>

      {/* Appointments client table */}
      <AppointmentsClient initialAppointments={appointments} />
    </div>
  )
}
