import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:py-16">
        <div className="flex-1">
          <h2 className="text-lg font-bold">RealtyPro</h2>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Find your dream home with RealtyPro. The most trusted platform for real estate.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Properties</h3>
            <Link href="/buy" className="text-sm text-muted-foreground hover:text-foreground">Buy</Link>
            <Link href="/rent" className="text-sm text-muted-foreground hover:text-foreground">Rent</Link>
            <Link href="/new-projects" className="text-sm text-muted-foreground hover:text-foreground">New Projects</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Legal</h3>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
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
