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
    <div className="relative min-h-screen bg-slate-950 text-white font-mono selection:bg-sky-500/30">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.02),transparent_60%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#f43f5e 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Navigation */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-slate-800 text-slate-400 hover:text-white"
          >
            <Link href="/buy" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              BACK TO LISTINGS
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-950/20 text-rose-400 text-xs uppercase tracking-widest">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            Personalized Wishlist
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-slate-400 bg-clip-text text-transparent">
            SAVED PROPERTIES
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-sans leading-relaxed">
            Monitor and access your bookmarked luxury and futuristic listings synchronized directly with your account.
          </p>
        </div>

        {/* Listings Grid */}
        {favoritedProperties.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 pt-2">
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
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-rose-500 border border-slate-800">
              <Heart className="h-5 w-5 text-rose-500" />
            </span>
            <h3 className="text-lg font-bold text-slate-300">NO SAVED PROPERTIES</h3>
            <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto">
              Your wishlist is currently empty. Explore our catalog of listings and tap the heart icon on any card to add it here.
            </p>
            <Button variant="outline" asChild size="sm" className="border-slate-800 text-slate-300">
              <Link href="/buy">Browse Properties</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
