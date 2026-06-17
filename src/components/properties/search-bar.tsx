"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, MapPin, X } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [inputVal, setInputVal] = React.useState(searchParams.get("location") || "")

  // Sync state with URL parameter if it changes externally
  React.useEffect(() => {
    setInputVal(searchParams.get("location") || "")
  }, [searchParams])

  const executeSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set("location", value.trim())
    } else {
      params.delete("location")
    }
    params.set("page", "1") // reset to page 1 on search
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(inputVal)
  }

  const handleClear = () => {
    setInputVal("")
    executeSearch("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto group z-10"
    >
      {/* Outer Glow on Focus/Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
      
      {/* Input container */}
      <div className="relative flex items-center bg-slate-900/90 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="pl-4 text-sky-400">
          <MapPin className="h-5 w-5 animate-pulse" />
        </div>
        
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter city, state, zip or property name..."
          className="w-full bg-transparent py-4 px-3 text-white placeholder-slate-400 text-sm md:text-base outline-none border-none"
        />

        {inputVal && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className="mr-2 md:mr-3 flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition duration-200 text-xs md:text-sm active:scale-95"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  )
}
