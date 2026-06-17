import * as React from "react"
import { PropertyForm } from "@/app/(dashboards)/seller/properties/add/property-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardNewPropertyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-slate-800 text-slate-400 hover:text-white"
          >
            <Link href="/dashboard/properties" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              BACK TO PROPERTIES
            </Link>
          </Button>
        </div>

        <div className="space-y-1 mt-4">
          <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white">
            Deploy New Listing
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
            Populate location mappings, space specifications, and visual assets to catalog this property.
          </p>
        </div>
      </div>

      {/* Property Form */}
      <PropertyForm />
    </div>
  )
}
