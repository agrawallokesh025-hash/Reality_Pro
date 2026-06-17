import { getBlogPosts } from "@/actions/blog"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Rss } from "lucide-react"

export const metadata = {
  title: "Insights & Press | Realty Pro",
  description: "Read our latest news, articles, and architectural insights.",
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts()

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-mono selection:bg-sky-500/30">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.02),transparent_60%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#6366f1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-950/20 text-indigo-400 text-xs uppercase tracking-widest">
            <Rss className="h-3.5 w-3.5 animate-pulse" />
            Market intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">
            REALTY PRO JOURNAL
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-sans leading-relaxed">
            Architectural theory, premium market reports, and property investment guidance curated by our expert team.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/20 transition-all duration-300 h-[420px]"
              >
                <div className="space-y-4">
                  {/* Featured Image Placeholder or Actual */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900 flex items-center justify-center">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-slate-950 to-sky-950/20" />
                        <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                          [ NO_MEDIA_INDEXED ]
                        </span>
                      </>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-sky-400" />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-sky-400" />
                      {post.users?.full_name || "Admin"}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg leading-snug text-white group-hover:text-sky-400 transition-colors line-clamp-2 uppercase">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans line-clamp-3 leading-relaxed">
                      {post.meta_description || "Read this article on Realty Pro to get deep investment analytics and property breakdowns."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">
                    READTIME: ~5 min
                  </span>
                  <Button size="sm" variant="ghost" className="text-sky-400 hover:text-white p-0 h-auto" asChild>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-xs">
                      ACCESS ARTICLE
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-slate-900/10 border border-slate-900 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-500 border border-slate-800">
              <Rss className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-300 font-mono">NO JOURNAL ENTRIES</h3>
            <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto">
              Our editorial department has not released any news articles yet. Check back soon for industry updates.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
