"use client"

import * as React from "react"
import { trackView } from "@/actions/views"

interface ViewTrackerProps {
  propertyId: string
}

export function ViewTracker({ propertyId }: ViewTrackerProps) {
  React.useEffect(() => {
    let active = true

    if (propertyId) {
      trackView(propertyId)
        .then((res) => {
          if (active && res.success) {
            console.log(`[ViewTracker] Impression tracked successfully. Logged: ${res.logged}`)
          }
        })
        .catch((err) => {
          console.error("[ViewTracker] Failed to track view:", err)
        })
    }

    return () => {
      active = false
    }
  }, [propertyId])

  return null
}
