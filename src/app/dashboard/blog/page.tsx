import { getBlogPosts } from "@/actions/blog"
import { BlogListClient } from "./blog-list-client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Rss } from "lucide-react"

export const metadata = {
  title: "Blog CMS Manager | Realty Pro Dashboard",
}

export default async function DashboardBlogPage() {
  const posts = await getBlogPosts(true)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight uppercase flex items-center gap-2 text-white font-mono">
            <Rss className="h-6 w-6 text-sky-400" />
            BLOG CMS MANAGER
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Write, schedule, edit, and delete news articles, newsletters, and reports.
          </p>
        </div>

        <Button asChild size="sm" className="font-mono">
          <Link href="/dashboard/blog/new" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            NEW JOURNAL POST
          </Link>
        </Button>
      </div>

      <BlogListClient initialPosts={posts} />
    </div>
  )
}
