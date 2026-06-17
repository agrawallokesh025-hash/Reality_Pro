"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleFavorite(propertyId: string) {
  const supabase = await createClient()

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Unauthorized. Please log in to save properties.")
  }

  // 2. Check if already favorited
  const { data: existing, error: findError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .maybeSingle()

  if (findError) {
    console.error("Error querying favorites:", findError)
    throw new Error("Failed to toggle favorite.")
  }

  if (existing) {
    // Remove favorite
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id)

    if (deleteError) {
      console.error("Error deleting favorite:", deleteError)
      throw new Error("Failed to remove favorite.")
    }

    revalidatePath("/favorites")
    revalidatePath("/properties")
    return { success: true, favorited: false }
  } else {
    // Add favorite
    const { error: insertError } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        property_id: propertyId,
      })

    if (insertError) {
      console.error("Error inserting favorite:", insertError)
      throw new Error("Failed to save favorite.")
    }

    revalidatePath("/favorites")
    revalidatePath("/properties")
    return { success: true, favorited: true }
  }
}

export async function getFavorites() {
  const supabase = await createClient()

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return []
  }

  // 2. Query favorited properties with images
  const { data, error } = await supabase
    .from("favorites")
    .select("*, properties(*, property_images(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching favorites:", error)
    return []
  }

  return (data || []).map((fav: any) => fav.properties).filter(Boolean)
}

export async function isFavorited(propertyId: string) {
  const supabase = await createClient()

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return false
  }

  // 2. Query check
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .maybeSingle()

  if (error) {
    console.error("Error checking favorite status:", error)
    return false
  }

  return !!data
}

export async function getFavoriteCount() {
  const supabase = await createClient()

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return 0
  }

  // 2. Count query
  const { count, error } = await supabase
    .from("favorites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error counting favorites:", error)
    return 0
  }

  return count || 0
}
