"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { toggleFavorite, isFavorited } from "@/actions/favorites"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface FavoriteToggleProps {
  propertyId: string
  initialFavorited?: boolean
  className?: string
}

export function FavoriteToggle({ propertyId, initialFavorited, className = "" }: FavoriteToggleProps) {
  const router = useRouter()
  const [favorited, setFavorited] = React.useState<boolean>(initialFavorited || false)
  const [loading, setLoading] = React.useState<boolean>(initialFavorited === undefined)

  React.useEffect(() => {
    if (initialFavorited !== undefined) return

    let active = true
    isFavorited(propertyId)
      .then((status) => {
        if (active) {
          setFavorited(status)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error("Failed to check favorite status:", err)
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [propertyId, initialFavorited])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    setLoading(true)
    try {
      const result = await toggleFavorite(propertyId)
      setFavorited(result.favorited)
      if (result.favorited) {
        toast.success("Listing saved to favorites.")
      } else {
        toast.success("Listing removed from favorites.")
      }
    } catch (err: any) {
      if (err.message?.includes("Unauthorized")) {
        toast.error("Please log in to save properties.")
        router.push("/login")
      } else {
        toast.error(err.message || "Failed to toggle favorite.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-rose-500 hover:border-rose-950/40 hover:bg-rose-950/5 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer group/fav ${className}`}
      title={favorited ? "Remove from Favorites" : "Add to Favorites"}
      aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Heart
        className={`h-4.5 w-4.5 transition-transform duration-300 group-hover/fav:scale-110 ${
          favorited
            ? "fill-rose-500 text-rose-500"
            : "text-slate-400"
        }`}
      />
    </button>
  )
}
