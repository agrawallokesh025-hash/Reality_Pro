"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, Home, DollarSign, ArrowRight, ShieldCheck } from "lucide-react"

export function Hero3D() {
  const router = useRouter()
  const [location, setLocation] = React.useState("")
  const [type, setType] = React.useState("")
  const [priceRange, setPriceRange] = React.useState("")
  const [InteractiveVilla, setInteractiveVilla] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    import("./interactive-villa").then((mod) => {
      setInteractiveVilla(() => mod.InteractiveVilla)
    })
  }, [])
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (type) params.set("type", type)
    
    if (priceRange) {
      if (priceRange === "1m") {
        params.set("maxPrice", "1000000")
      } else if (priceRange === "1m-5m") {
        params.set("minPrice", "1000000")
        params.set("maxPrice", "5000000")
      } else if (priceRange === "5m-10m") {
        params.set("minPrice", "5000000")
        params.set("maxPrice", "10000000")
      } else if (priceRange === "10m") {
        params.set("minPrice", "10000000")
      }
    }
    
    router.push(`/buy?${params.toString()}`)
  }

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden bg-background py-12 md:py-20 px-4 md:px-8 border-b border-border/40">
      {/* Background Soft Textures */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,169,126,0.04),transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Section: Content */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="inline-flex items-center gap-2 bg-secondary text-primary dark:bg-primary/40 dark:text-accent px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
            <ShieldCheck className="h-3.5 w-3.5 text-accent animate-pulse" />
            Bespoke Architectural Brokerage
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight leading-[1.05] text-foreground">
            Artfully Uniting <br />
            <span className="font-serif italic font-normal text-accent">Extraordinary Lives</span> <br />
            With Exceptional Homes.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl font-sans font-light leading-relaxed">
            Explore a refined global portfolio of signature estates, glass penthouses, and historical architectural masterpieces curated for discerning collectors.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-6 border-t border-b border-border/50 py-5 max-w-lg">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Curated Listings</span>
              <div className="text-xl md:text-2xl font-serif font-medium text-foreground">840+ Estates</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Volume Closed</span>
              <div className="text-xl md:text-2xl font-serif font-medium text-foreground">$1.86 Billion</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">Global Offices</span>
              <div className="text-xl md:text-2xl font-serif font-medium text-foreground">12 Capitals</div>
            </div>
          </div>

          {/* Luxury Search Engine Bar */}
          <form 
            onSubmit={handleSearch}
            className="bg-card/90 backdrop-blur-md border border-border shadow-lg p-3 rounded-2xl grid md:grid-cols-4 gap-2 items-center max-w-3xl"
          >
            {/* Location Input */}
            <div className="relative flex items-center px-2 py-1 border-b md:border-b-0 md:border-r border-border/80">
              <MapPin className="h-4 w-4 text-accent mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Type Selector */}
            <div className="relative flex items-center px-2 py-1 border-b md:border-b-0 md:border-r border-border/80">
              <Home className="h-4 w-4 text-accent mr-2 shrink-0" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                aria-label="Property Type"
                className="bg-transparent text-sm w-full outline-none text-foreground appearance-none cursor-pointer"
              >
                <option value="" className="bg-card text-foreground">All Estates</option>
                <option value="villa" className="bg-card text-foreground">Villas</option>
                <option value="apartment" className="bg-card text-foreground">Apartments</option>
                <option value="house" className="bg-card text-foreground">Houses</option>
              </select>
            </div>

            {/* Price Selector */}
            <div className="relative flex items-center px-2 py-1">
              <DollarSign className="h-4 w-4 text-accent mr-1 shrink-0" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                aria-label="Price Range"
                className="bg-transparent text-sm w-full outline-none text-foreground appearance-none cursor-pointer"
              >
                <option value="" className="bg-card text-foreground">Price Limit</option>
                <option value="1m" className="bg-card text-foreground">Under $1,000,000</option>
                <option value="1m-5m" className="bg-card text-foreground">$1M – $5M</option>
                <option value="5m-10m" className="bg-card text-foreground">$5M – $10M</option>
                <option value="10m" className="bg-card text-foreground">$10M+</option>
              </select>
            </div>

            {/* CTA Search Button */}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
            >
              <Search className="h-4 w-4 text-accent" />
              Search
            </Button>
          </form>

          {/* Premium CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-primary font-medium rounded-xl group px-6">
              <Link href="/buy" className="flex items-center gap-2">
                View Curated Portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border text-foreground hover:bg-muted rounded-xl px-6">
              <Link href="/contact">Arrange Consultation</Link>
            </Button>
          </div>
        </div>
        {/* Right Section: Interactive Villa Experience */}
        <div className="lg:col-span-5 flex justify-center items-center w-full">
          {InteractiveVilla ? (
            <InteractiveVilla />
          ) : (
            <div className="w-full max-w-[550px] aspect-square rounded-3xl border border-border bg-card/50 shadow-2xl p-6 flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/40">
                  Interactive Villa Experience
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/40">
                  Loading...
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

