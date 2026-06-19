"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { MapPin, BedDouble, Bath, Square, ArrowRight } from "lucide-react"
import { FavoriteToggle } from "@/components/properties/favorite-toggle"

export interface PropertyItem {
  id: string
  title: string
  price: string
  address: string
  bedrooms: number
  bathrooms: number
  area_sqft: number
  type: string
  purpose: string
  imageIndex: number
  slug: string
  imageUrl?: string
}

interface PropertyCard3DProps {
  property: PropertyItem
}

export function PropertyCard3D({ property }: PropertyCard3DProps) {
  // Static premium placeholder images based on index if no real image is provided
  const placeholderImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
  ]

  const displayImage = property.imageUrl || placeholderImages[(property.imageIndex - 1) % placeholderImages.length]

  return (
    <div
      className="animate-fade-in-up group relative w-full max-w-[360px] rounded-2xl bg-card border border-border/50 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(15,44,35,0.08)] dark:hover:shadow-[0_12px_40px_rgba(212,175,55,0.05)] transition-all duration-500 flex flex-col h-[480px]"
    >
      {/* 80% Visual Container */}
      <div className="relative w-full flex-1 overflow-hidden bg-muted">
        {/* Main Image with Zoom on Hover */}
        <Image
          src={displayImage}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Dark Vignette at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

        {/* Absolute Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="text-[10px] font-sans font-medium bg-primary text-primary-foreground px-3 py-1 rounded-md uppercase tracking-wider">
            {property.purpose === "buy" ? "For Sale" : "For Rent"}
          </span>
          {property.type === "villa" && (
            <span className="text-[10px] font-sans font-medium bg-accent text-accent-foreground px-3 py-1 rounded-md uppercase tracking-wider">
              Signature
            </span>
          )}
        </div>

        {/* Favorite Toggle Button */}
        <div className="absolute top-4 right-4 z-10">
          <FavoriteToggle propertyId={property.id} />
        </div>

        {/* Floating Price Indicator over the image bottom */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-2xl font-serif font-medium text-white drop-shadow-md">
            {property.price}
          </span>
        </div>
      </div>

      {/* 20% Info Container */}
      <div className="p-5 flex flex-col justify-between bg-card z-10 relative">
        <div className="space-y-1">
          <h3 className="font-serif font-light text-xl leading-tight text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 font-sans font-light">
            <MapPin className="h-3 w-3 text-accent shrink-0" />
            <span className="line-clamp-1">{property.address}</span>
          </p>
        </div>

        {/* Specifications Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans font-light">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-accent/80" /> {property.bedrooms} Beds
            </span>
            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-accent/80" /> {property.bathrooms} Baths
            </span>
            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
            <span className="flex items-center gap-1">
              <Square className="h-3.5 w-3.5 text-accent/80" /> {property.area_sqft} sqft
            </span>
          </div>

          {/* Details arrow */}
          <Link href={`/properties/${property.slug}`} className="text-accent hover:text-accent-foreground transition-colors p-1" aria-label={`View details of ${property.title}`}>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
