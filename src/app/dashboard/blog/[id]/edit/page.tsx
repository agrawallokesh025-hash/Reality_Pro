import { getBlogPostById } from "@/actions/blog"
import { BlogForm } from "../../blog-form"
import { notFound } from "next/navigation"

interface EditPostProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: "Edit Journal Post | Realty Pro Dashboard",
}

export default async function EditBlogPostPage({ params }: EditPostProps) {
  const { id } = await params
  const post = await getBlogPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight uppercase text-white font-mono">
          EDIT JOURNAL POST
        </h1>
        <p className="text-xs text-slate-550 font-sans mt-1">
          Modify your article's title, content, or metadata settings.
        </p>
      </div>

      <BlogForm initialData={post} />
    </div>
  )
}
