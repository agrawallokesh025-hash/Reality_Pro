import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:py-16">
        <div className="flex-1">
          <h2 className="font-serif font-semibold text-2xl tracking-wide text-primary dark:text-accent">RealtyPro</h2>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Experience curated architectural spaces, bespoke private estates, and luxury listings with RealtyPro.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-primary dark:text-accent">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-accent">About Us</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent">Contact</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-accent">Blog</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-primary dark:text-accent">Properties</h3>
            <Link href="/buy" className="text-sm text-muted-foreground hover:text-accent">Buy</Link>
            <Link href="/rent" className="text-sm text-muted-foreground hover:text-accent">Rent</Link>
            <Link href="/new-projects" className="text-sm text-muted-foreground hover:text-accent">New Projects</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-primary dark:text-accent">Legal</h3>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RealtyPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
