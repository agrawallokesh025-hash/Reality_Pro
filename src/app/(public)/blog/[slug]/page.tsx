import { getBlogPostBySlug } from "@/actions/blog"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Article Not Found | Realty Pro",
      description: "The requested blog article could not be resolved.",
    }
  }

  return {
    title: `${post.meta_title || post.title} | Realty Pro Journal`,
    description: post.meta_description || "Read the latest update from Realty Pro.",
    alternates: {
      canonical: post.canonical_url || undefined,
    },
    openGraph: {
      title: post.title,
      description: post.meta_description || undefined,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
      type: "article",
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

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

      <div className="container relative z-10 max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Back navigation */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-slate-800 text-slate-400 hover:text-white"
          >
            <Link href="/blog" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              BACK TO JOURNAL
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight uppercase">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-550 border-b border-slate-900 pb-4">
            <span className="flex items-center gap-1.5 font-bold">
              <Calendar className="h-4 w-4 text-sky-400" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { dateStyle: "long" }) : "Draft"}
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <User className="h-4 w-4 text-sky-400" />
              {post.users?.full_name || "Admin"}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-900 bg-slate-950">
            <img
              src={post.featured_image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="font-sans text-slate-300 text-base leading-relaxed space-y-6 whitespace-pre-line pt-2">
          {post.content}
        </div>

        {/* Canonical Link Indicator */}
        {post.canonical_url && (
          <div className="border-t border-slate-900 pt-6 text-xs text-slate-500 font-mono">
            Original Source:{" "}
            <a href={post.canonical_url} target="_blank" className="text-sky-400 hover:underline">
              {post.canonical_url}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
