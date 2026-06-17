import { getProperties } from "@/actions/properties"
import { PropertyCard3D } from "@/components/properties/property-card-3d"
import { SearchBar } from "@/components/properties/search-bar"
import { FilterPanel } from "@/components/properties/filter-panel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Database } from "lucide-react"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function formatPrice(price: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  return `${formatter.format(price)}/mo`
}

export default async function RentPage({ searchParams }: PageProps) {
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
    purpose: "rent",
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
    return `/rent?${params.toString()}`
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-mono selection:bg-sky-500/30">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.03),transparent_60%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0ea5e9 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-950/20 text-sky-400 text-xs uppercase tracking-widest">
            <Database className="h-3.5 w-3.5 animate-pulse" />
            Supabase Live Query Active
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-100 to-slate-400 bg-clip-text text-transparent">
            PROPERTIES FOR RENT
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-sans leading-relaxed">
            Rent premium, modern spaces synced directly from our database. Filter by budget, spacing requirements, or location.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4">
          <SearchBar />
          <FilterPanel />
        </div>

        {/* Search results banner */}
        <div className="flex justify-between items-center text-xs text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-3">
          <span>Search Results: {totalCount} Properties Found</span>
          <span>Page {currentPage} of {totalPages || 1}</span>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 pt-2">
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
                imageIndex: (idx % 5) + 1, // pseudo-index for HUD visual indicators
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
          <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-500 border border-slate-800">
              ?
            </span>
            <h3 className="text-lg font-bold text-slate-300">NO RENTALS FOUND</h3>
            <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto">
              No results match your criteria. Try loosening your filters or changing your location search term.
            </p>
            {activeFiltersCount(resolvedParams) > 0 && (
              <Button variant="outline" asChild size="sm" className="border-slate-800 text-slate-300">
                <Link href="/rent">Clear All Filters</Link>
              </Button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 pt-10">
            {currentPage > 1 ? (
              <Button variant="outline" size="sm" asChild className="border-slate-800 text-slate-300">
                <Link href={createPageLink(currentPage - 1)} className="flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4" />
                  PREV
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="border-slate-900 text-slate-600">
                <ArrowLeft className="h-4 w-4" />
                PREV
              </Button>
            )}

            <span className="text-xs text-slate-400 font-bold">
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Button variant="outline" size="sm" asChild className="border-slate-800 text-slate-300">
                <Link href={createPageLink(currentPage + 1)} className="flex items-center gap-1.5">
                  NEXT
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="border-slate-900 text-slate-600">
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
