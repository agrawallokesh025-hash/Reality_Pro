import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hero3D } from "@/components/layout/hero-3d"
import { PropertyCard3D, PropertyItem } from "@/components/properties/property-card-3d"

const featuredProperties: PropertyItem[] = [
  {
    id: "1",
    title: "Skyline Luxury Penthouse",
    price: "$2,450,000",
    address: "725 5th Ave, New York, NY",
    bedrooms: 4,
    bathrooms: 4.5,
    area_sqft: 4200,
    type: "apartment",
    purpose: "buy",
    imageIndex: 1,
  },
  {
    id: "2",
    title: "Pacific View Modern Villa",
    price: "$6,800,000",
    address: "27405 Pacific Coast Hwy, Malibu, CA",
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 6500,
    type: "villa",
    purpose: "buy",
    imageIndex: 2,
  },
  {
    id: "3",
    title: "Neon Horizon Smart Space",
    price: "$8,500 / mo",
    address: "1000 S Hope St, Los Angeles, CA",
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1800,
    type: "apartment",
    purpose: "rent",
    imageIndex: 3,
  },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16 bg-black min-h-screen">
      {/* 3D Interactive Hero Section */}
      <Hero3D />

      {/* Featured Properties Section */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-white">Featured Blueprints</h2>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Selected next-gen listings</p>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/5" asChild>
            <Link href="/buy">View all &rarr;</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {featuredProperties.map((property) => (
            <PropertyCard3D key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  )
}
