import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-muted">
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your Dream Home
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Discover luxury apartments, beautiful houses, and premium commercial properties with RealtyPro.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/buy">Browse Properties</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/rent">Rent a Home</Link>
            </Button>
          </div>
        </div>
        {/* Placeholder for background image */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/90" />
      </section>

      {/* Featured Properties */}
      <section className="container">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Properties</h2>
          <Button variant="ghost" asChild>
            <Link href="/buy">View all &rarr;</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder Property Cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="aspect-video w-full bg-muted rounded-t-lg flex items-center justify-center">
                <span className="text-muted-foreground">Property Image {i}</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl">Luxury Villa {i}</h3>
                <p className="text-sm text-muted-foreground mt-2">123 Example Street, NY</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-lg">$1,200,000</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/buy/property-${i}`}>Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
