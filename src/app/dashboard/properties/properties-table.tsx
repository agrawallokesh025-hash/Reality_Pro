"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { deleteProperty } from "@/actions/properties"
import { togglePropertyFeature, updatePropertyStatus } from "@/actions/dashboard"
import {
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"

interface PropertiesTableProps {
  initialProperties: any[]
}

export function PropertiesTable({ initialProperties }: PropertiesTableProps) {
  const [properties, setProperties] = React.useState(initialProperties)
  const [filterPurpose, setFilterPurpose] = React.useState<string>("all")
  const [filterType, setFilterType] = React.useState<string>("all")
  const [isPending, startTransition] = React.useTransition()

  // Apply filters client-side for immediate responsiveness
  const filteredProperties = properties.filter((p) => {
    const matchPurpose = filterPurpose === "all" || p.purpose === filterPurpose
    const matchType = filterType === "all" || p.type === filterType
    return matchPurpose && matchType
  })

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured
    
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: nextFeatured } : p))
    )

    try {
      await togglePropertyFeature(id, nextFeatured)
      toast.success(nextFeatured ? "Listing set to featured!" : "Listing removed from featured.")
    } catch (err: any) {
      // Revert on error
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_featured: currentFeatured } : p))
      )
      toast.error(err.message || "Failed to update featured status.")
    }
  }

  const handleStatusChange = async (id: string, newStatus: "draft" | "available" | "under_offer" | "sold" | "rented") => {
    const oldStatus = properties.find((p) => p.id === id)?.status

    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    )

    try {
      await updatePropertyStatus(id, newStatus)
      toast.success(`Listing status updated to ${newStatus}.`)
    } catch (err: any) {
      // Revert on error
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: oldStatus } : p))
      )
      toast.error(err.message || "Failed to update listing status.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently index-delete this property listing? This action is irreversible.")) {
      return
    }

    startTransition(async () => {
      try {
        const res = await deleteProperty(id)
        if (res.success) {
          setProperties((prev) => prev.filter((p) => p.id !== id))
          toast.success("Listing index purged successfully.")
        } else {
          toast.error(res.message || "Failed to delete listing.")
        }
      } catch (err: any) {
        toast.error(err.message || "An error occurred during deletion.")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters HUD */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/15 border border-slate-900/80 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="h-4 w-4" />
          <span className="uppercase text-[10px] tracking-wider font-bold">Filters</span>
        </div>

        {/* Purpose filter */}
        <select
          value={filterPurpose}
          onChange={(e) => setFilterPurpose(e.target.value)}
          className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-300 outline-none focus:border-sky-500 transition"
        >
          <option value="all">Purpose: All</option>
          <option value="buy">For Sale (Buy)</option>
          <option value="rent">For Lease (Rent)</option>
        </select>

        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-300 outline-none focus:border-sky-500 transition"
        >
          <option value="all">Type: All</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>

        <span className="text-[10px] text-slate-500 ml-auto font-sans">
          Found {filteredProperties.length} listings in database.
        </span>
      </div>

      {/* Table grid */}
      <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/30 text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="py-4 px-6">Property</th>
                <th className="py-4 px-4">Type / Purpose</th>
                <th className="py-4 px-4">Price (USD)</th>
                <th className="py-4 px-4">Featured</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/10 transition group text-[11px] text-slate-300">
                    {/* Title & Info */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      {p.property_images && p.property_images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.property_images.find((img: any) => img.is_primary)?.url || p.property_images[0].url}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-850 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg border border-slate-850 bg-slate-950 shrink-0" />
                      )}
                      <div className="truncate max-w-[200px] md:max-w-[300px]">
                        <span className="font-extrabold text-slate-100 uppercase tracking-wide block truncate group-hover:text-sky-400 transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[9px] text-slate-500 font-sans block truncate mt-0.5">
                          {p.address}, {p.city}, {p.state}
                        </span>
                      </div>
                    </td>

                    {/* Type / Purpose */}
                    <td className="py-4 px-4 uppercase tracking-wider text-[9px] font-bold">
                      <span className="text-slate-400">{p.type}</span>
                      <span className="text-slate-650 mx-1.5">/</span>
                      <span className={p.purpose === "buy" ? "text-sky-400" : "text-indigo-400"}>
                        {p.purpose === "buy" ? "Sale" : "Lease"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-extrabold text-slate-200">
                      ${Number(p.price).toLocaleString()}
                    </td>

                    {/* Featured */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(p.id, p.is_featured)}
                        className="p-1 rounded hover:bg-slate-900/60 transition cursor-pointer"
                      >
                        <Star
                          className={`h-4 w-4 transition ${
                            p.is_featured ? "fill-amber-400 text-amber-400" : "text-slate-700 hover:text-slate-550"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                        className={`bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[9px] font-bold uppercase outline-none focus:border-sky-500 cursor-pointer ${
                          p.status === "available"
                            ? "text-emerald-400 border-emerald-950/40 bg-emerald-950/5"
                            : p.status === "under_offer"
                            ? "text-sky-400 border-sky-950/40 bg-sky-950/5"
                            : p.status === "sold"
                            ? "text-slate-500 border-slate-900"
                            : p.status === "draft"
                            ? "text-slate-400 border-slate-900 bg-slate-900/10"
                            : "text-amber-400 border-amber-950/40 bg-amber-950/5"
                        }`}
                      >
                        <option value="draft" className="text-slate-400 bg-slate-950">Draft</option>
                        <option value="available" className="text-emerald-400 bg-slate-950">Available</option>
                        <option value="under_offer" className="text-sky-400 bg-slate-950">Under Offer</option>
                        <option value="sold" className="text-slate-500 bg-slate-950">Sold</option>
                        <option value="rented" className="text-amber-400 bg-slate-950">Rented</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex gap-1">
                        <Link
                          href={`/properties/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded border border-slate-850 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white transition"
                          title="View live page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/dashboard/properties/${p.id}/edit`}
                          className="p-1.5 rounded border border-slate-850 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white transition"
                          title="Edit details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={isPending}
                          className="p-1.5 rounded border border-rose-950/20 bg-rose-950/5 hover:bg-rose-950/15 text-rose-500/70 hover:text-rose-400 disabled:opacity-50 transition cursor-pointer"
                          title="Purge catalog listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No properties cataloged matching the selected filter options.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
