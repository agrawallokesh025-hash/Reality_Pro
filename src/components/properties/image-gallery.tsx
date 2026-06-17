"use client"

import * as React from "react"
import { PropertyImage } from "@/actions/properties"
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageGalleryProps {
  images: PropertyImage[]
  imageIndex: number // fallback index for HUD design
}

export function ImageGallery({ images, imageIndex }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = React.useState(0)

  // Filter out any invalid or duplicate urls
  const validImages = React.useMemo(() => {
    return images.filter((img) => img.url)
  }, [images])

  const nextImage = () => {
    if (validImages.length === 0) return
    setActiveIdx((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    if (validImages.length === 0) return
    setActiveIdx((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  return (
    <div className="space-y-4 w-full">
      {/* Main image view container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group">
        
        {validImages.length > 0 ? (
          /* Render real image */
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={validImages[activeIdx].url}
              alt="Property visual asset"
              className="object-cover w-full h-full select-none"
            />

            {/* Navigation buttons for multiple images */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-white/10 hover:bg-slate-950/90 text-white transition duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-white/10 hover:bg-slate-950/90 text-white transition duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image counter pill */}
            <div className="absolute bottom-4 right-4 bg-slate-950/70 border border-slate-800 rounded-full px-3 py-1 text-[10px] font-mono text-slate-300">
              {activeIdx + 1} / {validImages.length}
            </div>
          </>
        ) : (
          /* Futuristic HUD visual blueprint if no images are loaded */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
            {/* Visual background grids */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/30 via-cyan-950/10 to-indigo-950/30" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(#0ea5e9 0.75px, transparent 0.75px)",
                backgroundSize: "12px 12px",
              }}
            />
            
            <ImageIcon className="h-10 w-10 text-sky-500/50 mb-3 relative z-10 animate-pulse" />
            <span className="text-sky-400 font-mono text-xs tracking-widest relative z-10 uppercase">
              [ HUD_VISUAL_FEED_ACTIVE ]
            </span>
            <span className="text-slate-500 font-mono text-[10px] tracking-widest mt-1 relative z-10">
              PROPERTY_ASSET_V{imageIndex}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails list */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          {validImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-16 w-24 rounded-lg overflow-hidden border transition shrink-0 bg-slate-900 ${
                activeIdx === idx
                  ? "border-sky-500 ring-1 ring-sky-500"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
