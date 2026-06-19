"use client"

import * as React from "react"

export function LenisProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (typeof window === "undefined") return

    let lenisInstance: any = null
    let rafId: number

    // Dynamically load Lenis on the client-side
    import("lenis").then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.1,
      })

      function raf(time: number) {
        if (lenisInstance) {
          lenisInstance.raf(time)
          rafId = requestAnimationFrame(raf)
        }
      }

      rafId = requestAnimationFrame(raf)
    })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (lenisInstance) lenisInstance.destroy()
    }
  }, [])

  return <>{children}</>
}

