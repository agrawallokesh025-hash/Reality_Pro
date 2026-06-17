import { getPropertyBySlug, getSimilarProperties } from "@/actions/properties"
import { ImageGallery } from "@/components/properties/image-gallery"
import { ContactForm } from "@/components/properties/contact-form"
import { PropertyCard3D } from "@/components/properties/property-card-3d"
import { MortgageCalculator } from "@/components/properties/mortgage-calculator"
import { FavoriteToggle } from "@/components/properties/favorite-toggle"
import { MapPreview } from "@/components/properties/map-preview"
import { ViewTracker } from "@/components/properties/view-tracker"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Home,
  Check,
  Calendar,
  Compass,
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles,
  Calculator,
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatPrice(price: number, purpose: "buy" | "rent"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  const formatted = formatter.format(price)
  return purpose === "rent" ? `${formatted}/mo` : formatted
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    return {
      title: "Estate Not Found | Realty Pro",
      description: "The requested property listing could not be resolved.",
    }
  }

  const priceStr = formatPrice(property.price, property.purpose)

  return {
    title: `${property.title} | ${priceStr} | Realty Pro`,
    description:
      property.description ||
      `Explore this premium ${property.type} for ${property.purpose} in ${property.city}, ${property.state}.`,
    openGraph: {
      title: `${property.title} | ${priceStr} | Realty Pro`,
      description: property.description || undefined,
      type: "website",
    },
  }
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  // Fetch similar properties
  const similarRaw = await getSimilarProperties(
    property.id,
    property.type,
    property.purpose,
    3
  )

  // Fallback amenities if features column is null or empty
  const defaultAmenities = [
    "Smart Access Control",
    "Solar Power Vault Integration",
    "High-Speed Fiber Connect",
    "Energy Recovery System",
    "Smart Glass Insulation",
  ]
  const amenitiesList =
    Array.isArray(property.features) && property.features.length > 0
      ? property.features
      : defaultAmenities

  // Retrieve seller/agent details (joined as 'users')
  const seller = property.users
  const sellerName = seller?.full_name || "Premium Realty Agent"
  const sellerEmail = seller?.email || "agency@realtypro.com"
  const sellerPhone = seller?.phone || "+1 555-0199"

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-mono selection:bg-sky-500/30">
      <ViewTracker propertyId={property.id} />
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.02),transparent_60%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0ea5e9 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-10 space-y-10">
        
        {/* Back Link */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-slate-800 text-slate-400 hover:text-white"
          >
            <Link href={property.purpose === "buy" ? "/buy" : "/rent"} className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              BACK TO LISTINGS
            </Link>
          </Button>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          {/* Main Content Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery */}
            <ImageGallery
              images={property.property_images || []}
              imageIndex={3} // pseudo-index for HUD visual indicators
            />

            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold bg-sky-500 text-black px-2 py-0.5 rounded uppercase tracking-wider">
                  For {property.purpose}
                </span>
                <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded uppercase tracking-wider capitalize">
                  {property.type}
                </span>
                {property.is_luxury && (
                  <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    LUXURY EDITION
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {property.title}
                  </h1>
                  <FavoriteToggle propertyId={property.id} className="mt-1 shrink-0" />
                </div>
                <p className="text-sm text-slate-400 flex items-center gap-1.5 font-sans">
                  <MapPin className="h-4 w-4 text-sky-400" />
                  {property.address}, {property.city}, {property.state} {property.zip_code}
                </p>
              </div>

              {/* Price Banner */}
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 tracking-widest block mb-0.5">ESTATE VALUATION</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-sky-400 font-mono">
                    {formatPrice(property.price, property.purpose)}
                  </span>
                </div>
                {property.is_featured && (
                  <div className="text-right">
                    <span className="text-[10px] bg-slate-950 border border-slate-850 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-center space-y-1">
                <BedDouble className="h-5 w-5 text-sky-400 mx-auto" />
                <div className="text-lg font-bold font-mono">{property.bedrooms || 0}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Bedrooms</div>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-center space-y-1">
                <Bath className="h-5 w-5 text-sky-400 mx-auto" />
                <div className="text-lg font-bold font-mono">{property.bathrooms || 0}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Bathrooms</div>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-center space-y-1">
                <Square className="h-4.5 w-4.5 text-sky-400 mx-auto" />
                <div className="text-lg font-bold font-mono">{property.area_sqft || 0}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Area (sqft)</div>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-center space-y-1">
                <Calendar className="h-5 w-5 text-sky-400 mx-auto" />
                <div className="text-lg font-bold font-mono">{property.property_age || 0} yr</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Age</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Architectural Blueprint
              </h3>
              <p className="text-slate-300 font-sans text-sm leading-relaxed whitespace-pre-line">
                {property.description || "No description provided for this listing."}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
                <Check className="h-4.5 w-4.5" />
                Specifications & Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-sans text-xs">
                {amenitiesList.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300 font-mono">
                    <span className="h-1.5 w-1.5 bg-sky-400 rounded-full shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Mortgage Calculator Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
                <Calculator className="h-4.5 w-4.5 text-sky-400" />
                Mortgage calculator
              </h3>
              <MortgageCalculator initialPrincipal={property.price} />
            </div>

            {/* Location Section */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Location Mapping
              </h3>
              <MapPreview
                latitude={property.latitude !== null ? Number(property.latitude) : null}
                longitude={property.longitude !== null ? Number(property.longitude) : null}
                address={property.address}
                city={property.city}
                state={property.state}
              />
            </div>

          </div>

          {/* Sticky Sidebar / Contact Area (1 Col) */}
          <div className="lg:sticky lg:top-8 space-y-6">
            
            {/* Agent Info card */}
            <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-750 overflow-hidden flex items-center justify-center text-slate-400 font-bold">
                {sellerName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-white">{sellerName}</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3" />
                  {seller?.role || "Agent"}
                </p>
                <p className="text-[10px] text-slate-400">{sellerEmail}</p>
              </div>
            </div>

            {/* Form */}
            <ContactForm
              propertyId={property.id}
              propertyTitle={property.title}
              propertySlug={property.slug}
              sellerPhone={sellerPhone}
              sellerName={sellerName}
            />

          </div>

        </div>

        {/* Similar Properties Section */}
        {similarRaw.length > 0 && (
          <div className="space-y-6 border-t border-slate-900 pt-10">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-white">
                Similar Estates
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Comparable options in the same category matching similar parameters.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              {similarRaw.map((prop, idx) => {
                const similarItem = {
                  id: prop.id,
                  title: prop.title,
                  price: formatPrice(prop.price, prop.purpose),
                  address: `${prop.address}, ${prop.city}, ${prop.state}`,
                  bedrooms: prop.bedrooms || 0,
                  bathrooms: prop.bathrooms || 0,
                  area_sqft: prop.area_sqft || 0,
                  type: prop.type,
                  purpose: prop.purpose,
                  imageIndex: (idx % 5) + 1,
                }
                return (
                  <PropertyCard3D
                    key={prop.id}
                    property={similarItem}
                  />
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
