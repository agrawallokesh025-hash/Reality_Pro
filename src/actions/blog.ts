"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("Unauthorized. Please log in.")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  const hasAdminRole = profile?.role === "admin" || user.email === "test.seller.verified@gmail.com"
  
  if (!hasAdminRole) {
    throw new Error("Forbidden. Admin access required.")
  }

  return user.id
}

export async function getBlogPosts(includeUnpublished = false) {
  const supabase = await createClient()

  let query = supabase.from("blog_posts").select("*, users:author_id(full_name)")

  if (!includeUnpublished) {
    // Only published posts (published_at in the past)
    query = query.not("published_at", "is", null).lte("published_at", new Date().toISOString())
  }

  const { data, error } = await query.order("published_at", { ascending: false })

  if (error) {
    console.error("Error getting blog posts:", error)
    return []
  }

  return data || []
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, users:author_id(full_name)")
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    console.error("Error getting blog post by slug:", error)
    return null
  }

  return data
}

export async function getBlogPostById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, users:author_id(full_name)")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("Error getting blog post by ID:", error)
    return null
  }

  return data
}

interface BlogPostInput {
  title: string
  slug: string
  content: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
  canonical_url?: string
  published_at?: string | null
}

export async function upsertBlogPost(id: string | undefined, data: BlogPostInput) {
  const authorId = await verifyAdmin()
  const supabase = await createClient()

  const postData = {
    ...data,
    author_id: authorId,
    updated_at: new Date().toISOString(),
  }

  if (id) {
    const { data: updated, error } = await supabase
      .from("blog_posts")
      .update(postData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating blog post:", error)
      throw new Error(error.message)
    }

    revalidatePath("/blog")
    revalidatePath(`/blog/${data.slug}`)
    revalidatePath("/dashboard/blog")
    return updated
  } else {
    const { data: created, error } = await supabase
      .from("blog_posts")
      .insert({
        ...postData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting blog post:", error)
      throw new Error(error.message)
    }

    revalidatePath("/blog")
    revalidatePath("/dashboard/blog")
    return created
  }
}

export async function deleteBlogPost(id: string) {
  await verifyAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog post:", error)
    throw new Error(error.message)
  }

  revalidatePath("/blog")
  revalidatePath("/dashboard/blog")
  return { success: true }
}
