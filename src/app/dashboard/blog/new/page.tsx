import { BlogForm } from "../blog-form"

export const metadata = {
  title: "Create New Post | Realty Pro Dashboard",
}

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight uppercase text-white font-mono">
          CREATE JOURNAL POST
        </h1>
        <p className="text-xs text-slate-550 font-sans mt-1">
          Draft and publish a new article to the public website.
        </p>
      </div>

      <BlogForm />
    </div>
  )
}
