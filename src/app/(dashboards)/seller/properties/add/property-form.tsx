"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PropertyFormSchema, PropertyFormValues } from "@/lib/validations/property"
import { createProperty, updateProperty } from "@/actions/properties"
import { ImageUploader } from "@/components/properties/image-uploader"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Sparkles, MapPin, ListPlus, Image as ImageIcon } from "lucide-react"

const availableAmenities = [
  "Smart Access",
  "Solar Power Integration",
  "High-speed Fiber Connect",
  "Smart Climate Insulation",
  "Rainwater Recovery system",
  "Swimming Pool",
  "Private Garage",
  "EV Charging Station",
  "Security Surveillance",
  "Gym & Fitness Suite",
]

interface PropertyFormProps {
  propertyId?: string
  initialData?: PropertyFormValues & { imageUrls: string[] }
}

export function PropertyForm({ propertyId, initialData }: PropertyFormProps) {
  const router = useRouter()
  const [imageUrls, setImageUrls] = React.useState<string[]>(initialData?.imageUrls || [])
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          price: initialData.price,
          type: initialData.type,
          purpose: initialData.purpose,
          bedrooms: initialData.bedrooms,
          bathrooms: initialData.bathrooms,
          area_sqft: initialData.area_sqft,
          furnishing_status: initialData.furnishing_status,
          address: initialData.address,
          city: initialData.city,
          state: initialData.state,
          zip_code: initialData.zip_code,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          features: initialData.features,
          property_age: initialData.property_age,
          is_luxury: initialData.is_luxury,
          is_new_project: initialData.is_new_project,
          is_featured: initialData.is_featured,
        }
      : {
          title: "",
          description: "",
          price: 0,
          type: "apartment",
          purpose: "buy",
          bedrooms: undefined,
          bathrooms: undefined,
          area_sqft: 0,
          furnishing_status: "unfurnished",
          address: "",
          city: "",
          state: "",
          zip_code: "",
          latitude: undefined,
          longitude: undefined,
          features: [],
          property_age: 0,
          is_luxury: false,
          is_new_project: false,
          is_featured: false,
        },
  })

  const selectedFeatures = watch("features") || []

  const toggleFeature = (featureName: string) => {
    if (selectedFeatures.includes(featureName)) {
      setValue(
        "features",
        selectedFeatures.filter((f) => f !== featureName)
      )
    } else {
      setValue("features", [...selectedFeatures, featureName])
    }
  }

  const onSubmit = async (values: PropertyFormValues) => {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = propertyId
        ? await updateProperty(propertyId, values, imageUrls)
        : await createProperty(values, imageUrls)

      if (result.success && result.slug) {
        router.push(`/properties/${result.slug}`)
      } else {
        setSubmitError(result.message || "Failed to save listing.")
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-900 backdrop-blur-md font-mono text-xs text-slate-300"
    >
      {submitError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-bold">
          {submitError}
        </div>
      )}

      {/* ================= SECTION 1: BASIC DETAILS ================= */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
          <ListPlus className="h-4 w-4" />
          1. Basic Details
        </h3>
        
        {/* Title */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider">Listing Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
            placeholder="e.g. Minimalist Neo-Tokyo Penthouse"
          />
          {errors.title && <p className="text-rose-400 text-[10px] mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider">Architectural Description</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition resize-none"
            placeholder="Provide architectural concepts, energy certifications, smart features details..."
          />
          {errors.description && (
            <p className="text-rose-400 text-[10px] mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* ================= SECTION 2: CATEGORIZATION & PRICING ================= */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          2. Categorization & Pricing
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Purpose */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Purpose</label>
            <select
              {...register("purpose")}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            >
              <option value="buy">For Sale (Buy)</option>
              <option value="rent">For Lease (Rent)</option>
            </select>
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Property Type</label>
            <select
              {...register("type")}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Price (USD)</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
              placeholder="e.g. 1250000"
            />
            {errors.price && <p className="text-rose-400 text-[10px] mt-1">{errors.price.message}</p>}
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: SPACE SPECIFICATIONS ================= */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          3. Space Specifications
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Bedrooms */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Bedrooms</label>
            <input
              type="number"
              {...register("bedrooms", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
              placeholder="e.g. 3"
            />
            {errors.bedrooms && <p className="text-rose-400 text-[10px] mt-1">{errors.bedrooms.message}</p>}
          </div>

          {/* Bathrooms */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Bathrooms</label>
            <input
              type="number"
              {...register("bathrooms", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
              placeholder="e.g. 2"
            />
            {errors.bathrooms && <p className="text-rose-400 text-[10px] mt-1">{errors.bathrooms.message}</p>}
          </div>

          {/* Area */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Area (sqft)</label>
            <input
              type="number"
              {...register("area_sqft", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
              placeholder="e.g. 1850"
            />
            {errors.area_sqft && <p className="text-rose-400 text-[10px] mt-1">{errors.area_sqft.message}</p>}
          </div>

          {/* Age */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Property Age (yrs)</label>
            <input
              type="number"
              {...register("property_age", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
              placeholder="e.g. 0"
            />
            {errors.property_age && (
              <p className="text-rose-400 text-[10px] mt-1">{errors.property_age.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Furnishing */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Furnishing Status</label>
            <select
              {...register("furnishing_status")}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            >
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Boolean Options */}
          <div className="flex flex-wrap items-center gap-4 justify-between bg-slate-950/40 p-3 rounded-lg border border-slate-850">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" {...register("is_luxury")} className="accent-sky-500 cursor-pointer" />
              <span>Luxury Edition</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" {...register("is_new_project")} className="accent-sky-500 cursor-pointer" />
              <span>New Launch</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" {...register("is_featured")} className="accent-sky-500 cursor-pointer" />
              <span>Market Feature</span>
            </label>
          </div>
        </div>
      </div>

      {/* ================= SECTION 4: LOCATION MAPPING ================= */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          4. Location Mapping
        </h3>

        <div className="space-y-4">
          {/* Address */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider">Street Address</label>
            <input
              type="text"
              {...register("address")}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
              placeholder="e.g. 505 Cyberpunk Lane"
            />
            {errors.address && <p className="text-rose-400 text-[10px] mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* City */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">City</label>
              <input
                type="text"
                {...register("city")}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. San Francisco"
              />
              {errors.city && <p className="text-rose-400 text-[10px] mt-1">{errors.city.message}</p>}
            </div>

            {/* State */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">State</label>
              <input
                type="text"
                {...register("state")}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. CA"
              />
              {errors.state && <p className="text-rose-400 text-[10px] mt-1">{errors.state.message}</p>}
            </div>

            {/* Zip */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Zip / Pincode</label>
              <input
                type="text"
                {...register("zip_code")}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. 94103"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Latitude */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Latitude (Optional)</label>
              <input
                type="number"
                step="any"
                {...register("latitude", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. 37.7749"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Longitude (Optional)</label>
              <input
                type="number"
                step="any"
                {...register("longitude", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. -122.4194"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 5: AMENITIES / FEATURES ================= */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          5. Specifications & Amenities
        </h3>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {availableAmenities.map((amenity) => {
            const isActive = selectedFeatures.includes(amenity)
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleFeature(amenity)}
                className={`px-3 py-2 rounded-lg border text-[10px] transition uppercase tracking-wider ${
                  isActive
                    ? "bg-sky-500/15 border-sky-400 text-sky-300 font-bold"
                    : "bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-700"
                }`}
              >
                {amenity}
              </button>
            )
          })}
        </div>
      </div>

      {/* ================= SECTION 6: MEDIA UPLOADER ================= */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          6. Media Uploads
        </h3>

        <ImageUploader value={imageUrls} onChange={setImageUrls} maxFiles={5} />
      </div>

      {/* Submit */}
      <div className="border-t border-slate-900 pt-6">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold uppercase py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl transition"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {propertyId ? "Updating Estate..." : "Indexing Estate Vault..."}
            </>
          ) : (
            <>
              <Plus className="h-4.5 w-4.5" />
              {propertyId ? "Update Property" : "Index Property"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
