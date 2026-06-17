"use client"

import * as React from "react"
import { Compass, ExternalLink, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapPreviewProps {
  latitude: number | null
  longitude: number | null
  address: string
  city: string
  state: string
}

export function MapPreview({ latitude, longitude, address, city, state }: MapPreviewProps) {
  const [mapProvider, setMapProvider] = React.useState<"osm" | "google">("osm")
  
  // Default to New York City coordinates if not provided
  const lat = latitude !== null ? Number(latitude) : 40.7128
  const lng = longitude !== null ? Number(longitude) : -74.0060
  
  // Bounding box for OpenStreetMap iframe
  const delta = 0.005
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`
  
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
  const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className="space-y-4 font-mono">
      {/* Map Header / Provider selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-900">
        <div className="text-xs text-slate-400">
          LATITUDE: {latitude || "N/A"} | LONGITUDE: {longitude || "N/A"}
        </div>
        <div className="flex gap-1.5 text-[10px]">
          <button
            onClick={() => setMapProvider("osm")}
            className={`px-2 py-1 border rounded transition cursor-pointer ${
              mapProvider === "osm"
                ? "border-sky-500 bg-sky-950/20 text-sky-400"
                : "border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-350"
            }`}
          >
            OpenStreetMap (Default)
          </button>
          <button
            onClick={() => setMapProvider("google")}
            className={`px-2 py-1 border rounded transition cursor-pointer ${
              mapProvider === "google"
                ? "border-sky-500 bg-sky-950/20 text-sky-400"
                : "border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-350"
            }`}
          >
            Google Maps (Optional)
          </button>
        </div>
      </div>

      {/* Embedded Iframe Viewport */}
      <div className="relative aspect-[3/1.5] w-full rounded-2xl bg-slate-950 border border-slate-900 overflow-hidden">
        <iframe
          title="Property Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapProvider === "osm" ? osmUrl : googleMapsUrl}
          className="grayscale invert contrast-125 opacity-80"
        />
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-900 px-3 py-1.5 rounded-lg pointer-events-none max-w-[80%]">
          <p className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
            <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0 animate-bounce" />
            <span className="truncate">{address}, {city}</span>
          </p>
        </div>
      </div>

      {/* Action Trigger Directions */}
      <div className="flex justify-end pt-1">
        <Button variant="outline" size="xs" className="border-slate-800 text-slate-400 hover:text-white" asChild>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px]">
            <Compass className="h-3.5 w-3.5 text-sky-400" />
            GET DIRECTIONS MAP
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </Button>
      </div>
    </div>
  )
}
