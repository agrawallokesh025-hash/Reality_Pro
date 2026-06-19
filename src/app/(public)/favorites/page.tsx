import { getFavorites } from "@/actions/favorites"
import { PropertyCard3D } from "@/components/properties/property-card-3d"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function formatPrice(price: number, purpose: "buy" | "rent"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  const formatted = formatter.format(price)
  return purpose === "rent" ? `${formatted}/mo` : formatted
}

export const metadata = {
  title: "My Saved Listings | Realty Pro",
  description: "View and manage your bookmarked luxury properties and estates.",
}

export default async function FavoritesPage() {
  const supabase = await createClient()

  // Verify auth session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  const favoritedProperties = await getFavorites()

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-accent/30 pb-20">
      {/* Background soft glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,169,126,0.02),transparent_70%)] pointer-events-none" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Navigation */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-border text-muted-foreground hover:text-foreground rounded-xl"
          >
            <Link href="/buy" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4 text-accent" />
              Back to listings
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-primary dark:bg-primary/30 dark:text-accent text-xs uppercase tracking-widest font-semibold">
            <Heart className="h-3.5 w-3.5 fill-accent text-accent animate-pulse" />
            Curated Wishlist
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground tracking-tight leading-tight">
            Saved Properties
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-sans font-light leading-relaxed">
            Monitor and manage your bookmarked luxury architectural landmarks synchronized directly with your account.
          </p>
        </div>

        {/* Listings Grid */}
        {favoritedProperties.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 pt-2 justify-center">
            {favoritedProperties.map((property, idx) => {
              const propertyItem = {
                id: property.id,
                title: property.title,
                price: formatPrice(property.price, property.purpose),
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
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-accent">
              <Heart className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-serif font-light text-foreground">NO SAVED PROPERTIES</h3>
            <p className="text-xs text-muted-foreground font-sans font-light max-w-xs mx-auto">
              Your wishlist is currently empty. Explore our catalog of listings and click the heart icon on any card to add it here.
            </p>
            <Button variant="outline" asChild size="sm" className="border-border text-foreground hover:bg-muted">
              <Link href="/buy">Browse Properties</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
