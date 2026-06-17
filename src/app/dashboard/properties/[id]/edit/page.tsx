import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PropertyForm } from "@/app/(dashboards)/seller/properties/add/property-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const revalidate = 0

interface EditPropertyPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DashboardEditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch property details joined with images
  const { data: property, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("id", id)
    .single()

  if (error || !property) {
    notFound()
  }

  // Map database entity to form initial data structure
  const initialFormValues = {
    title: property.title,
    description: property.description || "",
    price: Number(property.price),
    type: property.type,
    purpose: property.purpose,
    bedrooms: property.bedrooms || undefined,
    bathrooms: property.bathrooms || undefined,
    area_sqft: Number(property.area_sqft),
    furnishing_status: property.furnishing_status || "unfurnished",
    address: property.address,
    city: property.city,
    state: property.state,
    zip_code: property.zip_code || "",
    latitude: property.latitude ? Number(property.latitude) : undefined,
    longitude: property.longitude ? Number(property.longitude) : undefined,
    features: property.features || [],
    property_age: property.property_age || 0,
    is_luxury: !!property.is_luxury,
    is_new_project: !!property.is_new_project,
    is_featured: !!property.is_featured,
    imageUrls: property.property_images ? property.property_images.map((img: any) => img.url) : []
  }

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
            Modify Listing
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
            Modify values or images for "{property.title}" and update the marketplace index.
          </p>
        </div>
      </div>

      {/* Property Form */}
      <PropertyForm propertyId={property.id} initialData={initialFormValues} />
    </div>
  )
}
