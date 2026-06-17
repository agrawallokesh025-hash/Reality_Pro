import * as React from "react"
import { getProperties } from "@/actions/properties"
import { PropertiesTable } from "./properties-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const revalidate = 0

export default async function DashboardPropertiesPage() {
  // Fetch up to 100 properties to list in the dashboard console
  const { properties } = await getProperties({ pageSize: 100 })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white">
            Properties Catalog
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
            Add, update availability status, configure featured highlights, or delete listings.
          </p>
        </div>
        <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase rounded-xl shadow-lg shadow-sky-500/10 transition">
          <Link href="/dashboard/properties/new" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Deploy Listing
          </Link>
        </Button>
      </div>

      {/* Interactive table */}
      <PropertiesTable initialProperties={properties || []} />
    </div>
  )
}
