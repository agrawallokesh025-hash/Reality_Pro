"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { upsertBlogPost } from "@/actions/blog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ArrowLeft, Save, Globe, Eye, Sparkles } from "lucide-react"
import Link from "next/link"

interface BlogFormProps {
  initialData?: any
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  // Fields state
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [slug, setSlug] = React.useState(initialData?.slug || "")
  const [content, setContent] = React.useState(initialData?.content || "")
  const [featuredImage, setFeaturedImage] = React.useState(initialData?.featured_image || "")
  const [metaTitle, setMetaTitle] = React.useState(initialData?.meta_title || "")
  const [metaDescription, setMetaDescription] = React.useState(initialData?.meta_description || "")
  const [canonicalUrl, setCanonicalUrl] = React.useState(initialData?.canonical_url || "")
  
  // Format published_at for datetime-local input
  const getInitialPublishedAt = () => {
    if (!initialData?.published_at) return ""
    const d = new Date(initialData.published_at)
    // Return format YYYY-MM-DDThh:mm
    return d.toISOString().slice(0, 16)
  }
  const [publishedAt, setPublishedAt] = React.useState(getInitialPublishedAt())

  // Auto-generate slug from title
  const generateSlug = (val: string) => {
    setTitle(val)
    if (!initialData) {
      const formatted = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace
        .replace(/-+/g, "-") // collapse dashes
      setSlug(formatted)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a title.")
      return
    }
    if (!slug.trim()) {
      toast.error("Please enter a slug.")
      return
    }
    if (!content.trim()) {
      toast.error("Please enter post content.")
      return
    }

    setLoading(true)
    try {
      const data = {
        title,
        slug,
        content,
        featured_image: featuredImage || undefined,
        meta_title: metaTitle || undefined,
        meta_description: metaDescription || undefined,
        canonical_url: canonicalUrl || undefined,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      }

      await upsertBlogPost(initialData?.id, data)
      toast.success(initialData ? "Post updated successfully." : "Post created successfully.")
      router.push("/dashboard/blog")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog post.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-mono max-w-4xl text-xs">
      <div className="flex justify-between items-center pb-4 border-b border-slate-900">
        <Button variant="outline" size="sm" asChild className="border-slate-800 text-slate-400">
          <Link href="/dashboard/blog" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            BACK TO LIST
          </Link>
        </Button>

        <Button type="submit" size="sm" disabled={loading} className="gap-1.5">
          <Save className="h-4 w-4" />
          {loading ? "SAVING..." : "PUBLISH / SAVE"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Editor Section (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900/10 border border-slate-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider border-b border-slate-900 pb-2">
              Article Content
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                Post Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => generateSlug(e.target.value)}
                placeholder="e.g. Smart City Housing Architecture Analysis"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 font-sans text-xs"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. smart-city-housing-architecture-analysis"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 text-xs font-mono"
                required
              />
            </div>

            {/* Content Body */}
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                Post content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here in plain text or markdown..."
                className="w-full h-80 px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 font-sans text-xs leading-relaxed"
                required
              />
            </div>
          </div>
        </div>

        {/* CMS Metadata & Publish Config (1 col) */}
        <div className="space-y-4">
          {/* Scheduling block */}
          <div className="bg-slate-900/10 border border-slate-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider border-b border-slate-900 pb-2">
              Scheduling
            </h3>

            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 text-xs"
              />
              <span className="text-[10px] text-slate-500 block leading-normal">
                Leave empty for a draft, or set a future date to schedule publication.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                Featured Image URL
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>
          </div>

          {/* SEO meta block */}
          <div className="bg-slate-900/10 border border-slate-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-sky-400" />
              SEO METADATA
            </h3>

            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. Smart City Housing: A Deep Architectural Breakdown"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="A short SEO summary under 160 characters..."
                className="w-full h-20 px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 text-xs font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-widest block font-bold text-[10px]">
                Canonical URL
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://originalsource.com/article"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-white focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
