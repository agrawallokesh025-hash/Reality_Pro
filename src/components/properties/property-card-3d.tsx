"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, BedDouble, Bath, Square, FlipHorizontal, ArrowRight, Phone } from "lucide-react"
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
}

interface PropertyCard3DProps {
  property: PropertyItem
}

export function PropertyCard3D({ property }: PropertyCard3DProps) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  // Motion values for tracking cursor position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Map coordinate offset to 3D rotation angles (-15 to 15 degrees)
  // Disabled when the card is flipped to prevent interference with the flip rotation
  const rotateX = useTransform(y, [-150, 150], isFlipped ? [0, 0] : [15, -15])
  const rotateYOffset = useTransform(x, [-150, 150], isFlipped ? [0, 0] : [-15, 15])

  // Combine baseline flip rotation (0 or 180) with mouse hover tilt
  const rotateY = useTransform(rotateYOffset, (val) => {
    return isFlipped ? 180 + val : val
  })

  // Glare overlay coordinates
  const glareX = useTransform(x, [-100, 100], [100, 0])
  const glareY = useTransform(y, [-100, 100], [100, 0])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    // Get mouse position relative to center of the card
    const mouseX = event.clientX - rect.left - width / 2
    const mouseY = event.clientY - rect.top - height / 2
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const toggleFlip = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Reset mouse positions on flip
    x.set(0)
    y.set(0)
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="relative w-full max-w-[360px] h-[450px] perspective-1000 mx-auto select-none">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 15,
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative duration-500 rounded-2xl border border-border bg-card text-card-foreground shadow-md hover:shadow-xl hover:border-white/10 dark:hover:bg-slate-900/40"
      >
        {/* ==================== FRONT FACE ==================== */}
        <div
          className="absolute inset-0 w-full h-full p-5 flex flex-col justify-between backface-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Card Top: Visual Viewport */}
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border/50">
              {/* Image Placeholder with Futuristic Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/20 via-cyan-950/10 to-indigo-950/20" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(#0ea5e9 0.75px, transparent 0.75px)",
                  backgroundSize: "12px 12px",
                }}
              />
              <span className="text-muted-foreground text-xs font-mono tracking-widest relative z-10">
                [ PROPERTY_IMAGE_V{property.imageIndex} ]
              </span>

              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="text-[10px] font-mono font-bold bg-sky-500 text-black px-2 py-0.5 rounded uppercase tracking-wider">
                  {property.purpose === "buy" ? "For Sale" : "For Rent"}
                </span>
                {property.imageIndex % 3 === 0 && (
                  <span className="text-[10px] font-mono font-bold bg-indigo-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                    Luxury
                  </span>
                )}
              </div>

              {/* Favorite Toggle Overlay */}
              <div className="absolute top-3 right-3 z-10">
                <FavoriteToggle propertyId={property.id} />
              </div>

              {/* Flip Trigger Button */}
              <Button
                size="icon-xs"
                variant="secondary"
                onClick={toggleFlip}
                aria-label="Flip card for blueprint details"
                className="absolute bottom-3 right-3 z-10 bg-slate-950/60 hover:bg-slate-950/90 text-white border border-white/10 rounded-full h-8 w-8"
              >
                <FlipHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Title & Location */}
            <div className="space-y-1">
              <h3 className="font-bold text-lg leading-tight tracking-tight text-foreground line-clamp-1">
                {property.title}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 text-sky-400" />
                {property.address}
              </p>
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-3 gap-2 border-t border-b border-border/60 py-3 text-xs text-muted-foreground font-mono">
            <div className="flex flex-col items-center gap-1">
              <BedDouble className="h-4 w-4 text-sky-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bath className="h-4 w-4 text-sky-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Square className="h-3.5 w-3.5 text-sky-400" />
              <span>{property.area_sqft} sqft</span>
            </div>
          </div>

          {/* Card Footer: Price & Details CTA */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Price</span>
              <span className="font-extrabold text-lg text-sky-400 font-mono">{property.price}</span>
            </div>
            <Button size="sm" asChild className="group">
              <Link href={`/properties/property-${property.id}`}>
                View Details
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* ==================== BACK FACE (180deg Rotate) ==================== */}
        <div
          className="absolute inset-0 w-full h-full p-5 flex flex-col justify-between backface-hidden"
          style={{ transform: "rotateY(180deg) translateZ(0px)" }}
        >
          {/* Card Top: Details list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">[ Blueprint Info ]</span>
              <Button
                size="icon-xs"
                variant="secondary"
                onClick={toggleFlip}
                aria-label="Flip card back to blueprint image"
                className="bg-slate-950/60 hover:bg-slate-950/90 text-white border border-white/10 rounded-full h-8 w-8"
              >
                <FlipHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 font-mono text-xs text-muted-foreground">
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>PROPERTY ID:</span>
                <span className="text-foreground font-semibold">{property.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>SPACE TYPE:</span>
                <span className="text-foreground font-semibold uppercase">{property.type}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>FURNISHING:</span>
                <span className="text-foreground font-semibold">Semi-Furnished</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>YEAR BUILT:</span>
                <span className="text-foreground font-semibold">2023 (Age: 3y)</span>
              </div>
              <div className="flex justify-between">
                <span>ENERGY INDEX:</span>
                <span className="text-sky-400 font-bold">A+ [Green Certification]</span>
              </div>
            </div>

            {/* Mock Map Preview Box */}
            <div className="relative aspect-[2.2/1] w-full rounded-lg bg-slate-950 overflow-hidden border border-border/50 flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(rgba(14, 165, 233, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.2) 1px, transparent 1px)",
                  backgroundSize: "15px 15px",
                }}
              />
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                [ HUD_GPS_RADAR_MAP ]
              </span>
            </div>
          </div>

          {/* Card Footer: Quick Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full text-xs font-mono border-sky-500/30 text-sky-400 hover:bg-sky-500/5 group" asChild>
              <Link href={`tel:+1234567890`}>
                <Phone className="h-3.5 w-3.5 mr-1" />
                Initialize WhatsApp Connect
              </Link>
            </Button>
            <Button className="w-full text-xs font-mono" asChild>
              <Link href={`/properties/property-${property.id}`}>
                Access Digital Vault &rarr;
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
