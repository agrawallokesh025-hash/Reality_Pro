import { getProperties } from "@/actions/properties"
import { PropertyCard3D } from "@/components/properties/property-card-3d"
import { SearchBar } from "@/components/properties/search-bar"
import { FilterPanel } from "@/components/properties/filter-panel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function formatPrice(price: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  return formatter.format(price)
}

export default async function BuyPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  const location = typeof resolvedParams.location === "string" ? resolvedParams.location : undefined
  const type = typeof resolvedParams.type === "string" ? resolvedParams.type as any : undefined
  const minPrice = typeof resolvedParams.minPrice === "string" ? parseInt(resolvedParams.minPrice) : undefined
  const maxPrice = typeof resolvedParams.maxPrice === "string" ? parseInt(resolvedParams.maxPrice) : undefined
  const bedrooms = typeof resolvedParams.bedrooms === "string" ? parseInt(resolvedParams.bedrooms) : undefined
  const bathrooms = typeof resolvedParams.bathrooms === "string" ? parseInt(resolvedParams.bathrooms) : undefined
  const furnishingStatus = typeof resolvedParams.furnishingStatus === "string" ? resolvedParams.furnishingStatus as any : undefined
  const minArea = typeof resolvedParams.minArea === "string" ? parseInt(resolvedParams.minArea) : undefined
  const maxArea = typeof resolvedParams.maxArea === "string" ? parseInt(resolvedParams.maxArea) : undefined
  const readyToMove = resolvedParams.readyToMove === "true"
  const sortBy = typeof resolvedParams.sortBy === "string" ? resolvedParams.sortBy as any : undefined
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1

  const { properties, totalCount, totalPages, currentPage } = await getProperties({
    purpose: "buy",
    location,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    furnishingStatus,
    minArea,
    maxArea,
    readyToMove,
    sortBy,
    page,
    pageSize: 12,
  })

  // Helper to generate pagination links
  const createPageLink = (pageNumber: number) => {
    const params = new URLSearchParams()
    Object.entries(resolvedParams).forEach(([key, val]) => {
      if (val !== undefined && key !== "page") {
        params.set(key, String(val))
      }
    })
    params.set("page", String(pageNumber))
    return `/buy?${params.toString()}`
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-accent/30 pb-20">
      {/* Background Soft Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,169,126,0.02),transparent_70%)] pointer-events-none" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-primary dark:bg-primary/30 dark:text-accent text-xs uppercase tracking-widest font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-accent animate-pulse" />
            Curated Acquisition Portfolio
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground tracking-tight leading-tight">
            Properties For Sale
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-sans font-light leading-relaxed">
            Acquire curated, premium architecture landmarks directly from our live private portfolio. Filter by your parameters.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="space-y-6">
          <SearchBar />
          <FilterPanel />
        </div>

        {/* Search results banner */}
        <div className="flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest border-b border-border/40 pb-3">
          <span>Search Results: {totalCount} Properties Found</span>
          <span>Page {currentPage} of {totalPages || 1}</span>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 pt-2 justify-center">
            {properties.map((property, idx) => {
              // Convert DB property structure to PropertyItem structure expected by PropertyCard3D
              const propertyItem = {
                id: property.id,
                title: property.title,
                price: formatPrice(property.price),
                address: `${property.address}, ${property.city}, ${property.state}`,
                bedrooms: property.bedrooms || 0,
                bathrooms: property.bathrooms || 0,
                area_sqft: property.area_sqft || 0,
                type: property.type,
                purpose: property.purpose,
                imageIndex: (idx % 5) + 1,
                slug: property.slug,
                imageUrl: property.property_images?.find((img: any) => img.is_primary)?.url || property.property_images?.[0]?.url
              }
              return (
                <PropertyCard3D
                  key={property.id}
                  property={propertyItem}
                />
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-card border border-border/60 rounded-3xl p-8 max-w-xl mx-auto space-y-4 shadow-sm">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-accent font-serif text-lg border border-border">
              ?
            </span>
            <h3 className="text-lg font-serif font-light text-foreground">NO ESTATES FOUND</h3>
            <p className="text-xs text-muted-foreground font-sans font-light max-w-xs mx-auto">
              No results match your criteria. Try loosening your filters or changing your location search term.
            </p>
            {activeFiltersCount(resolvedParams) > 0 && (
              <Button variant="outline" asChild size="sm" className="border-border text-foreground hover:bg-muted">
                <Link href="/buy">Clear All Filters</Link>
              </Button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 pt-10">
            {currentPage > 1 ? (
              <Button variant="outline" size="sm" asChild className="border-border text-foreground hover:bg-muted rounded-xl">
                <Link href={createPageLink(currentPage - 1)} className="flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4 text-accent" />
                  PREV
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="border-border/40 text-muted-foreground/40 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                PREV
              </Button>
            )}

            <span className="text-xs text-muted-foreground font-semibold">
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Button variant="outline" size="sm" asChild className="border-border text-foreground hover:bg-muted rounded-xl">
                <Link href={createPageLink(currentPage + 1)} className="flex items-center gap-1.5">
                  NEXT
                  <ArrowRight className="h-4 w-4 text-accent" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="border-border/40 text-muted-foreground/40 rounded-xl">
                NEXT
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function activeFiltersCount(params: any): number {
  const keys = ["location", "type", "minPrice", "maxPrice", "bedrooms", "bathrooms", "furnishingStatus", "minArea", "maxArea", "readyToMove"]
  return keys.filter((key) => params[key] !== undefined).length
}
