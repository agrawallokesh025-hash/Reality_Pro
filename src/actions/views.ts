"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function trackView(propertyId: string) {
  const supabase = await createClient()

  // 1. Resolve IP Address
  const headerList = await headers()
  const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0] || 
                    headerList.get("x-real-ip") || 
                    "127.0.0.1"

  // 2. Resolve User ID (if authenticated)
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id || null

  // 3. Prevent duplicate logs within the last 24 hours (Daily session exclusion)
  let query = supabase
    .from("property_views")
    .select("id")
    .eq("property_id", propertyId)
    .gte("viewed_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  if (userId) {
    query = query.eq("user_id", userId)
  } else {
    query = query.eq("ip_address", ipAddress)
  }

  const { data: existing, error: findError } = await query.maybeSingle()

  if (findError) {
    console.error("Error finding existing views:", findError)
  }

  if (existing) {
    return { success: true, logged: false, reason: "Duplicate daily session." }
  }

  // 4. Log impression
  const { error: insertError } = await supabase
    .from("property_views")
    .insert({
      property_id: propertyId,
      user_id: userId,
      ip_address: ipAddress,
    })

  if (insertError) {
    console.error("Error inserting view log:", insertError)
    return { success: false, error: insertError.message }
  }

  return { success: true, logged: true }
}
