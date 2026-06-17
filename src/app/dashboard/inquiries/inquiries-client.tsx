"use client"

import * as React from "react"
import { updateInquiryStatus } from "@/actions/dashboard"
import { toast } from "sonner"
import { Mail, Phone, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

interface InquiriesClientProps {
  initialInquiries: any[]
}

export function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const [inquiries, setInquiries] = React.useState(initialInquiries)
  const [filter, setFilter] = React.useState<string>("all")

  const filteredInquiries = inquiries.filter((inq) => {
    return filter === "all" || inq.status === filter
  })

  const handleStatusChange = async (id: string, newStatus: string) => {
    const oldStatus = inquiries.find((i) => i.id === id)?.status

    // Optimistic update
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    )

    try {
      await updateInquiryStatus(id, newStatus)
      toast.success(`Inquiry status updated to ${newStatus}`)
    } catch (err: any) {
      // Revert on error
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: oldStatus } : i))
      )
      toast.error(err.message || "Failed to update inquiry status")
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters HUD */}
      <div className="flex items-center gap-4 bg-slate-900/15 border border-slate-900/80 p-4 rounded-2xl backdrop-blur-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-300 outline-none focus:border-sky-500 transition"
        >
          <option value="all">Status: All</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <span className="text-[10px] text-slate-500 ml-auto font-sans">
          Total {filteredInquiries.length} inquiries found.
        </span>
      </div>

      {/* Grid of inquiries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-5 rounded-2xl border border-slate-900 bg-slate-900/5 hover:border-slate-850 hover:bg-slate-900/10 transition relative group font-sans text-xs text-slate-400 space-y-4"
            >
              {/* Header block */}
              <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-900/60 font-mono">
                <div>
                  <span className="font-extrabold text-[11px] text-slate-100 uppercase tracking-wide block">
                    {inq.name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-sans block mt-0.5">
                    Received {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Status select */}
                <select
                  value={inq.status || "pending"}
                  onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                  className={`bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[9px] font-bold uppercase outline-none focus:border-sky-500 cursor-pointer ${
                    inq.status === "closed"
                      ? "text-slate-500 border-slate-900"
                      : inq.status === "contacted"
                      ? "text-sky-400 border-sky-950/40 bg-sky-950/5"
                      : "text-amber-400 border-amber-950/40 bg-amber-950/5"
                  }`}
                >
                  <option value="pending" className="text-amber-400 bg-slate-950">Pending</option>
                  <option value="contacted" className="text-sky-400 bg-slate-950">Contacted</option>
                  <option value="closed" className="text-slate-500 bg-slate-950">Closed</option>
                </select>
              </div>

              {/* Message */}
              <div className="bg-slate-950/40 border border-slate-900/50 p-3.5 rounded-xl text-slate-300 italic leading-relaxed text-[11px]">
                "{inq.message}"
              </div>

              {/* Footer specs & contact */}
              <div className="space-y-2 pt-1">
                {/* Related property */}
                {inq.properties && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-slate-650 uppercase">Listing:</span>
                    <Link
                      href={`/properties/${inq.properties.slug}`}
                      target="_blank"
                      className="text-sky-400 hover:underline flex items-center gap-0.5 truncate uppercase font-bold"
                    >
                      {inq.properties.title}
                      <ExternalLink className="h-3 w-3 inline shrink-0" />
                    </Link>
                  </div>
                )}

                {/* Contact details */}
                <div className="flex flex-wrap gap-4 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-600" />
                    <a href={`mailto:${inq.email}`} className="hover:text-slate-300 transition">{inq.email}</a>
                  </div>
                  {inq.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-600" />
                      <a href={`tel:${inq.phone}`} className="hover:text-slate-300 transition">{inq.phone}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-16 text-center text-slate-500 font-sans border border-dashed border-slate-900 rounded-3xl">
            No inquiries recorded matching the selected filter state.
          </div>
        )}
      </div>
    </div>
  )
}
