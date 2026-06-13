import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/buy">&larr; Back to listings</Link>
        </Button>
      </div>
      
      <div className="grid gap-10 md:grid-cols-2">
        {/* Images Placeholder */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground text-lg">Main Property Image ({slug})</span>
        </div>
        
        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Luxury Villa</h1>
          <p className="text-muted-foreground mb-6">123 Example Street, NY</p>
          <div className="text-3xl font-extrabold text-primary mb-6">$1,200,000</div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border rounded-md p-4 text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">Bedrooms</div>
            </div>
            <div className="border rounded-md p-4 text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Bathrooms</div>
            </div>
            <div className="border rounded-md p-4 text-center">
              <div className="text-2xl font-bold">3,500</div>
              <div className="text-sm text-muted-foreground">Sq Ft</div>
            </div>
            <div className="border rounded-md p-4 text-center">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Garages</div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-4">Description</h3>
          <p className="text-muted-foreground mb-8">
            This is a beautiful placeholder description for the property. Once the database is connected, this will show the actual description fetched from Supabase.
          </p>
          
          <Button size="lg" className="w-full">Book a Visit</Button>
        </div>
      </div>
    </div>
  )
}
