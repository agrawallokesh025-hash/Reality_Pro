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
  Calendar,
  Compass,
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles,
  Calculator,
  Check,
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
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-accent/30 pb-20">
      <ViewTracker propertyId={property.id} />
      
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,169,126,0.03),transparent_60%)] pointer-events-none" />

      {/* Main Container */}
      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-10">
        
        {/* Back Link */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-border text-muted-foreground hover:text-foreground rounded-xl"
          >
            <Link href={property.purpose === "buy" ? "/buy" : "/rent"} className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4 text-accent" />
              Back to listings
            </Link>
          </Button>
        </div>

        {/* Title, Badges, and Price Header Section */}
        <div className="border-b border-border/40 pb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-sans font-medium bg-primary text-primary-foreground px-3 py-1 rounded-md uppercase tracking-wider">
              For {property.purpose}
            </span>
            <span className="text-[10px] font-sans font-medium bg-muted text-foreground border border-border px-3 py-1 rounded-md uppercase tracking-wider capitalize">
              {property.type}
            </span>
            {property.is_luxury && (
              <span className="text-[10px] font-sans font-medium bg-accent text-accent-foreground px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Signature Edition
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-serif font-light text-foreground leading-tight tracking-tight">
                {property.title}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-sans font-light">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                {property.address}, {property.city}, {property.state} {property.zip_code}
              </p>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right md:text-right">
                <span className="text-[9px] uppercase text-muted-foreground tracking-widest block font-medium">Bespoke Valuation</span>
                <span className="text-2xl md:text-4xl font-serif font-medium text-accent">
                  {formatPrice(property.price, property.purpose)}
                </span>
              </div>
              <FavoriteToggle propertyId={property.id} className="border border-border/60 hover:bg-muted" />
            </div>
          </div>
        </div>

        {/* Editorial Layout */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Gallery Component */}
            <ImageGallery
              images={property.property_images || []}
              imageIndex={1}
            />

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card border border-border/50 rounded-2xl p-5 text-center space-y-1.5 shadow-sm">
                <BedDouble className="h-5 w-5 text-accent mx-auto" />
                <div className="text-xl font-serif font-medium text-foreground">{property.bedrooms || 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-light">Bedrooms</div>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-5 text-center space-y-1.5 shadow-sm">
                <Bath className="h-5 w-5 text-accent mx-auto" />
                <div className="text-xl font-serif font-medium text-foreground">{property.bathrooms || 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-light">Bathrooms</div>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-5 text-center space-y-1.5 shadow-sm">
                <Square className="h-4.5 w-4.5 text-accent mx-auto" />
                <div className="text-xl font-serif font-medium text-foreground">{property.area_sqft || 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-light">Area (sqft)</div>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-5 text-center space-y-1.5 shadow-sm">
                <Calendar className="h-5 w-5 text-accent mx-auto" />
                <div className="text-xl font-serif font-medium text-foreground">{property.property_age || 0} yr</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-light">Est. Age</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
                <Layers className="h-4 w-4 text-accent" />
                The Architectural Narrative
              </h3>
              <p className="text-muted-foreground font-sans font-light text-sm md:text-base leading-relaxed whitespace-pre-line">
                {property.description || "No narrative details provided for this estate."}
              </p>
            </div>

            {/* Specifications & Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-accent" />
                Features &amp; Finishes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans font-light text-sm">
                {amenitiesList.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 text-muted-foreground">
                    <span className="h-1.5 w-1.5 bg-accent rounded-full shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Mortgage Planner Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
                <Calculator className="h-4.5 w-4.5 text-accent" />
                Bespoke Mortgage Planner
              </h3>
              <MortgageCalculator initialPrincipal={property.price} />
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
                <Compass className="h-4 w-4 text-accent" />
                Geographical Mapping
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

          {/* Sticky Sidebar / Contact Area (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Private Advisor Card */}
            <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground overflow-hidden flex items-center justify-center font-serif text-lg font-medium border border-accent/20">
                {sellerName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-medium text-sm text-foreground">{sellerName}</h4>
                <p className="text-[10px] text-accent uppercase tracking-wider flex items-center gap-1 font-medium">
                  <Briefcase className="h-3 w-3" />
                  {seller?.role || "Private Advisor"}
                </p>
                <p className="text-[10px] text-muted-foreground font-sans font-light">{sellerEmail}</p>
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
          <div className="space-y-6 border-t border-border/40 pt-16">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-light text-foreground">
                Comparable Estates
              </h3>
              <p className="text-xs text-muted-foreground font-sans font-light">
                Explore comparable placements matching similar design categories and specifications.
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
                  slug: prop.slug,
                  imageUrl: prop.property_images?.find(img => img.is_primary)?.url || prop.property_images?.[0]?.url
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
