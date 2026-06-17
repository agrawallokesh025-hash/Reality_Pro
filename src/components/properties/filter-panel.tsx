"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { SlidersHorizontal, RotateCcw, ChevronDown, Check, Home, DollarSign, Bed, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

export function FilterPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state initialized from URL params
  const [type, setType] = React.useState(searchParams.get("type") || "")
  const [minPrice, setMinPrice] = React.useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get("maxPrice") || "")
  const [bedrooms, setBedrooms] = React.useState(searchParams.get("bedrooms") || "")
  const [bathrooms, setBathrooms] = React.useState(searchParams.get("bathrooms") || "")
  const [furnishingStatus, setFurnishingStatus] = React.useState(searchParams.get("furnishingStatus") || "")
  const [minArea, setMinArea] = React.useState(searchParams.get("minArea") || "")
  const [maxArea, setMaxArea] = React.useState(searchParams.get("maxArea") || "")
  const [readyToMove, setReadyToMove] = React.useState(searchParams.get("readyToMove") === "true")
  const [sortBy, setSortBy] = React.useState(searchParams.get("sortBy") || "newest")

  // Sync state when URL parameters change externally
  React.useEffect(() => {
    setType(searchParams.get("type") || "")
    setMinPrice(searchParams.get("minPrice") || "")
    setMaxPrice(searchParams.get("maxPrice") || "")
    setBedrooms(searchParams.get("bedrooms") || "")
    setBathrooms(searchParams.get("bathrooms") || "")
    setFurnishingStatus(searchParams.get("furnishingStatus") || "")
    setMinArea(searchParams.get("minArea") || "")
    setMaxArea(searchParams.get("maxArea") || "")
    setReadyToMove(searchParams.get("readyToMove") === "true")
    setSortBy(searchParams.get("sortBy") || "newest")
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (type) params.set("type", type)
    else params.delete("type")

    if (minPrice) params.set("minPrice", minPrice)
    else params.delete("minPrice")

    if (maxPrice) params.set("maxPrice", maxPrice)
    else params.delete("maxPrice")

    if (bedrooms) params.set("bedrooms", bedrooms)
    else params.delete("bedrooms")

    if (bathrooms) params.set("bathrooms", bathrooms)
    else params.delete("bathrooms")

    if (furnishingStatus) params.set("furnishingStatus", furnishingStatus)
    else params.delete("furnishingStatus")

    if (minArea) params.set("minArea", minArea)
    else params.delete("minArea")

    if (maxArea) params.set("maxArea", maxArea)
    else params.delete("maxArea")

    if (readyToMove) params.set("readyToMove", "true")
    else params.delete("readyToMove")

    if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy)
    else params.delete("sortBy")

    params.set("page", "1") // reset to page 1 when filters are updated

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    // Preserve only location or page search type if applicable
    const params = new URLSearchParams()
    const loc = searchParams.get("location")
    if (loc) params.set("location", loc)

    router.push(`${pathname}?${params.toString()}`)
  }

  const activeFiltersCount = [
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    furnishingStatus,
    minArea,
    maxArea,
    readyToMove,
  ].filter(Boolean).length

  return (
    <div className="w-full max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-md font-mono text-sm z-20">
      
      {/* Desktop Inline Fast Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort By Select */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              const params = new URLSearchParams(searchParams.toString())
              if (e.target.value && e.target.value !== "newest") {
                params.set("sortBy", e.target.value)
              } else {
                params.delete("sortBy")
              }
              params.set("page", "1")
              router.push(`${pathname}?${params.toString()}`)
            }}
            className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 focus:border-sky-500 outline-none text-xs"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="area_desc">Area: Large → Small</option>
          </select>
        </div>

        {/* Quick Type Select */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            const params = new URLSearchParams(searchParams.toString())
            if (e.target.value) {
              params.set("type", e.target.value)
            } else {
              params.delete("type")
            }
            params.set("page", "1")
            router.push(`${pathname}?${params.toString()}`)
          }}
          className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 focus:border-sky-500 outline-none text-xs"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>

        {/* Ready to Move Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer bg-slate-950/40 border border-slate-800 px-3 py-1.5 rounded-lg select-none text-xs hover:border-sky-500/50 transition-colors">
          <input
            type="checkbox"
            checked={readyToMove}
            onChange={(e) => {
              setReadyToMove(e.target.checked)
              const params = new URLSearchParams(searchParams.toString())
              if (e.target.checked) {
                params.set("readyToMove", "true")
              } else {
                params.delete("readyToMove")
              }
              params.set("page", "1")
              router.push(`${pathname}?${params.toString()}`)
            }}
            className="accent-sky-500 rounded cursor-pointer"
          />
          <span className="text-slate-300">Ready to Move</span>
        </label>
      </div>

      {/* Advanced Drawer Trigger + Reset */}
      <div className="flex items-center gap-3 justify-end">
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset ({activeFiltersCount})
          </Button>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="text-xs bg-slate-950 hover:bg-slate-900 border-slate-800 text-white flex items-center gap-2 relative"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Advanced Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent className="w-full max-w-md bg-slate-950 border-l border-slate-800 text-white p-6 font-mono">
            <SheetHeader className="border-b border-slate-800 pb-4 mb-6">
              <SheetTitle className="text-lg font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Refine Search
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 max-h-[calc(100vh-200px)]">
              {/* Type Select */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-sky-400" />
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["apartment", "house", "villa", "commercial", "land"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(type === item ? "" : item)}
                      className={`text-xs px-3 py-2 rounded-lg border text-left capitalize transition ${
                        type === item
                          ? "bg-sky-500/15 border-sky-400 text-sky-300"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-sky-400" />
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-3 py-2 w-full text-xs text-white focus:border-sky-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-3 py-2 w-full text-xs text-white focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Beds & Baths */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Bed className="h-3.5 w-3.5 text-sky-400" />
                  Bedrooms & Bathrooms
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 w-full text-xs focus:border-sky-500 outline-none"
                    >
                      <option value="">Min Bedrooms</option>
                      <option value="1">1+ Beds</option>
                      <option value="2">2+ Beds</option>
                      <option value="3">3+ Beds</option>
                      <option value="4">4+ Beds</option>
                      <option value="5">5+ Beds</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 w-full text-xs focus:border-sky-500 outline-none"
                    >
                      <option value="">Min Bathrooms</option>
                      <option value="1">1+ Baths</option>
                      <option value="2">2+ Baths</option>
                      <option value="3">3+ Baths</option>
                      <option value="4">4+ Baths</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Furnishing Status */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-sky-400" />
                  Furnished Status
                </label>
                <select
                  value={furnishingStatus}
                  onChange={(e) => setFurnishingStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 w-full text-xs focus:border-sky-500 outline-none"
                >
                  <option value="">Any furnishing</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Area Range */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest">Property Area (sqft)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min sqft"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 w-full text-xs text-white focus:border-sky-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max sqft"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 w-full text-xs text-white focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              {/* Ready to Move Option */}
              <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-xs text-slate-300">Ready to Move (Age = 0)</span>
                <input
                  type="checkbox"
                  checked={readyToMove}
                  onChange={(e) => setReadyToMove(e.target.checked)}
                  className="accent-sky-500 h-4.5 w-4.5 cursor-pointer"
                />
              </div>
            </div>

            {/* Panel Actions */}
            <div className="border-t border-slate-800 pt-4 mt-6 flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setType("")
                  setMinPrice("")
                  setMaxPrice("")
                  setBedrooms("")
                  setBathrooms("")
                  setFurnishingStatus("")
                  setMinArea("")
                  setMaxArea("")
                  setReadyToMove(false)
                }}
                className="flex-1 text-xs border border-slate-800 text-slate-400 hover:text-white"
              >
                Clear All
              </Button>
              <SheetClose asChild>
                <Button
                  onClick={applyFilters}
                  className="flex-1 text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold"
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
