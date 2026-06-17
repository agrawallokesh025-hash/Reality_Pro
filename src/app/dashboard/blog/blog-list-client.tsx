"use client"

import * as React from "react"
import { deleteBlogPost } from "@/actions/blog"
import { toast } from "sonner"
import Link from "next/link"
import { Edit, Trash, Eye, Calendar, BookOpen, Search, Filter } from "lucide-react"

interface BlogListClientProps {
  initialPosts: any[]
}

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [posts, setPosts] = React.useState(initialPosts)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase())

    const isPublished = post.published_at && new Date(post.published_at) <= new Date()
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && isPublished) ||
      (statusFilter === "draft" && !isPublished)

    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the blog post "${title}"?`)) {
      return
    }

    try {
      await deleteBlogPost(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success("Blog post deleted successfully.")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete blog post.")
    }
  }

  return (
    <div className="space-y-4 font-mono">
      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search posts by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-550 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft / Scheduled</option>
          </select>
        </div>
      </div>

      {/* Table container */}
      <div className="border border-slate-900 rounded-2xl bg-slate-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-400">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                <th className="p-4 w-2/5">Article title</th>
                <th className="p-4 w-1/4">Slug</th>
                <th className="p-4 w-1/8 text-center">Status</th>
                <th className="p-4 w-1/6">Release date</th>
                <th className="p-4 w-1/8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const isPublished = post.published_at && new Date(post.published_at) <= new Date()

                  return (
                    <tr
                      key={post.id}
                      className="border-b border-slate-900/60 hover:bg-slate-900/5 transition duration-150"
                    >
                      <td className="p-4">
                        <div className="font-bold text-white uppercase truncate max-w-[320px]">
                          {post.title}
                        </div>
                        <div className="text-[10px] text-slate-550 font-sans mt-0.5 truncate max-w-[320px]">
                          {post.meta_description || "No description provided."}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-900 text-[10px] text-slate-400">
                          {post.slug}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide ${
                            isPublished
                              ? "text-emerald-400 bg-emerald-950/20 border border-emerald-900/40"
                              : "text-amber-400 bg-amber-950/20 border border-amber-900/40"
                          }`}
                        >
                          {isPublished ? "published" : "draft"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {post.published_at ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-sky-500" />
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:text-white rounded-lg transition"
                            title="View post"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboard/blog/${post.id}/edit`}
                            className="p-2 border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:text-white rounded-lg transition"
                            title="Edit post"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-2 border border-slate-800 bg-slate-950/40 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-950/50 rounded-lg transition cursor-pointer"
                            title="Delete post"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-550">
                    No articles found. Write some thoughts to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
