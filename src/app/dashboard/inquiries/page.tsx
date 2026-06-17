import * as React from "react"
import { getInquiries } from "@/actions/dashboard"
import { InquiriesClient } from "./inquiries-client"

export const revalidate = 0

export default async function DashboardInquiriesPage() {
  const inquiries = await getInquiries()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white">
          Client Inquiries
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
          Review customer messages, contact info, and track followup status (Pending, Contacted, Closed).
        </p>
      </div>

      {/* Inquiries table client */}
      <InquiriesClient initialInquiries={inquiries} />
    </div>
  )
}
