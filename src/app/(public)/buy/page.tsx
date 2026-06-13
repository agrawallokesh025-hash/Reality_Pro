import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BuyPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Properties for Sale</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border bg-card shadow-sm">
            <div className="aspect-video w-full bg-muted rounded-t-lg flex items-center justify-center">
              <span className="text-muted-foreground">Property Image {i}</span>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-xl">Beautiful House {i}</h3>
              <p className="text-sm text-muted-foreground mt-2">123 Example Street, NY</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-lg">${1000000 + i * 50000}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/properties/property-${i}`}>Details</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
