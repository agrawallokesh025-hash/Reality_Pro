"use server"

import { createClient } from "@/lib/supabase/server"

export interface GetPropertiesFilters {
  purpose?: "buy" | "rent"
  type?: "apartment" | "house" | "villa" | "commercial" | "land"
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  furnishingStatus?: "furnished" | "semi-furnished" | "unfurnished"
  minArea?: number
  maxArea?: number
  isLuxury?: boolean
  isNewProject?: boolean
  isFeatured?: boolean
  readyToMove?: boolean
  sortBy?: "newest" | "price_asc" | "price_desc" | "area_desc"
  page?: number
  pageSize?: number
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  is_primary: boolean
  created_at: string
}

export interface PropertyWithImages {
  id: string
  seller_id: string
  title: string
  slug: string
  description: string
  price: number
  type: "apartment" | "house" | "villa" | "commercial" | "land"
  purpose: "buy" | "rent"
  status: "draft" | "available" | "under_offer" | "sold" | "rented"
  address: string
  city: string
  state: string
  zip_code: string | null
  latitude: number | null
  longitude: number | null
  bedrooms: number | null
  bathrooms: number | null
  area_sqft: number | null
  features: any
  furnishing_status: "furnished" | "semi-furnished" | "unfurnished" | null
  parking_spaces: number
  property_age: number
  property_video_url: string | null
  property_documents: any
  is_luxury: boolean
  is_new_project: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  property_images: PropertyImage[]
}

export async function getProperties(filters: GetPropertiesFilters = {}) {
  const supabase = await createClient()

  const {
    purpose,
    type,
    location,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    furnishingStatus,
    minArea,
    maxArea,
    isLuxury,
    isNewProject,
    isFeatured,
    readyToMove,
    sortBy = "newest",
    page = 1,
    pageSize = 12,
  } = filters

  // Start query on properties table with pre-fetched property images
  let query = supabase
    .from("properties")
    .select("*, property_images(*)", { count: "exact" })

  // Purpose filter
  if (purpose) {
    query = query.eq("purpose", purpose)
  }

  // Type filter
  if (type) {
    query = query.eq("type", type)
  }

  // Location search (combines city, state, address, title)
  if (location) {
    query = query.or(
      `city.ilike.%${location}%,state.ilike.%${location}%,address.ilike.%${location}%,title.ilike.%${location}%`
    )
  }

  // Price boundaries
  if (minPrice !== undefined) {
    query = query.gte("price", minPrice)
  }
  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice)
  }

  // Bedroom / Bathroom counters
  if (bedrooms !== undefined && bedrooms > 0) {
    query = query.gte("bedrooms", bedrooms)
  }
  if (bathrooms !== undefined && bathrooms > 0) {
    query = query.gte("bathrooms", bathrooms)
  }

  // Furnished Status
  if (furnishingStatus) {
    query = query.eq("furnishing_status", furnishingStatus)
  }

  // Area boundaries
  if (minArea !== undefined) {
    query = query.gte("area_sqft", minArea)
  }
  if (maxArea !== undefined) {
    query = query.lte("area_sqft", maxArea)
  }

  // Project flags
  if (isLuxury !== undefined) {
    query = query.eq("is_luxury", isLuxury)
  }
  if (isNewProject !== undefined) {
    query = query.eq("is_new_project", isNewProject)
  }
  if (isFeatured !== undefined) {
    query = query.eq("is_featured", isFeatured)
  }

  // Ready to move status (represented by property_age = 0 or status = 'available')
  if (readyToMove) {
    query = query.eq("property_age", 0).eq("status", "available")
  }

  // Sorting logic
  switch (sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "area_desc":
      query = query.order("area_sqft", { ascending: false })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
      break
  }

  // Pagination calculation
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching properties from Supabase:", error)
    return {
      properties: [] as PropertyWithImages[],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    }
  }

  return {
    properties: (data || []) as PropertyWithImages[],
    totalCount: count || 0,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
    currentPage: page,
  }
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*), users(*)")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching property by slug:", error)
    return null
  }

  // Typecast to include users profile and images
  return data as any
}

export async function getSimilarProperties(propertyId: string, type: string, purpose: string, limit = 3) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("type", type)
    .eq("purpose", purpose)
    .neq("id", propertyId)
    .limit(limit)

  if (error) {
    console.error("Error fetching similar properties:", error)
    return []
  }

  return (data || []) as PropertyWithImages[]
}

export async function createProperty(data: any, imageUrls: string[]) {
  const supabase = await createClient()

  // 1. Get current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: "Unauthorized. Please log in." }
  }

  // 2. Verify role in public.users
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || (profile.role !== "seller" && profile.role !== "admin")) {
    return { success: false, message: "Forbidden. Only sellers/admins can list properties." }
  }

  // 3. Generate slug
  const baseSlug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000)
  const slug = `${baseSlug}-${uniqueSuffix}`

  // 4. Insert property
  const { data: property, error: insertError } = await supabase
    .from("properties")
    .insert({
      seller_id: user.id,
      title: data.title,
      slug,
      description: data.description,
      price: data.price,
      type: data.type,
      purpose: data.purpose,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      bedrooms: data.bedrooms || null,
      bathrooms: data.bathrooms || null,
      area_sqft: data.area_sqft,
      furnishing_status: data.furnishing_status,
      property_age: data.property_age,
      is_luxury: data.is_luxury,
      is_new_project: data.is_new_project,
      is_featured: data.is_featured,
      features: data.features,
      status: "available",
    })
    .select("id")
    .single()

  if (insertError || !property) {
    console.error("Error creating property:", insertError)
    return { success: false, message: "Failed to create property in database." }
  }

  // 5. Insert images
  if (imageUrls && imageUrls.length > 0) {
    const imagesToInsert = imageUrls.map((url, index) => ({
      property_id: property.id,
      url,
      is_primary: index === 0,
    }))

    const { error: imagesError } = await supabase
      .from("property_images")
      .insert(imagesToInsert)

    if (imagesError) {
      console.error("Error inserting property images:", imagesError)
    }
  }

  return { success: true, message: "Property created successfully!", propertyId: property.id, slug }
}

export async function updateProperty(propertyId: string, data: any, imageUrls: string[]) {
  const supabase = await createClient()

  // 1. Get current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: "Unauthorized. Please log in." }
  }

  // 2. Fetch property and check ownership
  const { data: existingProperty, error: fetchError } = await supabase
    .from("properties")
    .select("seller_id, slug")
    .eq("id", propertyId)
    .single()

  if (fetchError || !existingProperty) {
    return { success: false, message: "Property not found." }
  }

  if (existingProperty.seller_id !== user.id) {
    return { success: false, message: "Unauthorized. You do not own this listing." }
  }

  // 3. Update property
  const { error: updateError } = await supabase
    .from("properties")
    .update({
      title: data.title,
      description: data.description,
      price: data.price,
      type: data.type,
      purpose: data.purpose,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      bedrooms: data.bedrooms || null,
      bathrooms: data.bathrooms || null,
      area_sqft: data.area_sqft,
      furnishing_status: data.furnishing_status,
      property_age: data.property_age,
      is_luxury: data.is_luxury,
      is_new_project: data.is_new_project,
      is_featured: data.is_featured,
      features: data.features,
    })
    .eq("id", propertyId)

  if (updateError) {
    console.error("Error updating property:", updateError)
    return { success: false, message: "Failed to update property details." }
  }

  // 4. Update images (delete old and insert new)
  if (imageUrls && imageUrls.length > 0) {
    const { error: deleteImagesError } = await supabase
      .from("property_images")
      .delete()
      .eq("property_id", propertyId)

    if (deleteImagesError) {
      console.error("Error deleting old images:", deleteImagesError)
    }

    const imagesToInsert = imageUrls.map((url, index) => ({
      property_id: propertyId,
      url,
      is_primary: index === 0,
    }))

    const { error: imagesError } = await supabase
      .from("property_images")
      .insert(imagesToInsert)

    if (imagesError) {
      console.error("Error updating property images:", imagesError)
    }
  }

  return { success: true, message: "Property updated successfully!", slug: existingProperty.slug }
}

export async function deleteProperty(propertyId: string) {
  const supabase = await createClient()

  // 1. Get current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: "Unauthorized. Please log in." }
  }

  // 2. Fetch property and check ownership
  const { data: existingProperty, error: fetchError } = await supabase
    .from("properties")
    .select("seller_id")
    .eq("id", propertyId)
    .single()

  if (fetchError || !existingProperty) {
    return { success: false, message: "Property not found." }
  }

  if (existingProperty.seller_id !== user.id) {
    return { success: false, message: "Unauthorized. You do not own this listing." }
  }

  // 3. Delete property (cascades to property_images)
  const { error: deleteError } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId)

  if (deleteError) {
    console.error("Error deleting property:", deleteError)
    return { success: false, message: "Failed to delete property from database." }
  }

  return { success: true, message: "Property deleted successfully!" }
}


