"use client"

import * as React from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { logout } from "@/actions/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [role, setRole] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true
    let subscription: any = null

    // Dynamically load the Supabase client
    import("@/lib/supabase/client").then(async ({ createClient }) => {
      if (!active) return
      const supabase = createClient()
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (active && user) {
          setUser(user)
          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()
          if (active) {
            setRole(profile?.role || null)
          }
        } else if (active) {
          setUser(null)
          setRole(null)
        }
      } catch (err) {
        console.error("Error fetching session:", err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!active) return
          if (session?.user) {
            setUser(session.user)
            try {
              const { data: profile } = await supabase
                .from("users")
                .select("role")
                .eq("id", session.user.id)
                .single()
              if (active) {
                setRole(profile?.role || null)
              }
            } catch (err) {
              console.error("Error fetching auth state change profile:", err)
            }
          } else {
            setUser(null)
            setRole(null)
          }
          setLoading(false)
        }
      )
      
      subscription = sub
    })

    return () => {
      active = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const isAdmin = role === "admin" || user?.email === "test.seller.verified@gmail.com"

  const routes = [
    { href: "/buy", label: "Buy" },
    { href: "/rent", label: "Rent" },
    { href: "/new-projects", label: "New Projects" },
    { href: "/luxury", label: "Luxury" },
    { href: "/blog", label: "Journal" },
  ]

  if (user) {
    routes.push({ href: "/favorites", label: "Saved" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-serif font-semibold text-2xl tracking-wide text-primary dark:text-accent">RealtyPro</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {!loading && user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/dashboard/overview"
                    className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-rose-400 hover:text-rose-350 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </>
            ) : !loading ? (
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                Login
              </Link>
            ) : (
              <div className="h-4 w-12 bg-muted animate-pulse rounded" />
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="flex flex-col gap-6 px-7 py-4">
                <Link href="/" className="font-serif font-semibold text-2xl tracking-wide text-primary dark:text-accent">RealtyPro</Link>
                <div className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="text-lg font-medium text-muted-foreground hover:text-accent"
                    >
                      {route.label}
                    </Link>
                  ))}
                  {!loading && user ? (
                    <>
                      {isAdmin && (
                        <Link href="/dashboard/overview" className="text-lg font-medium text-accent hover:text-accent/80">
                          Dashboard
                        </Link>
                      )}
                      <form action={logout}>
                        <button
                          type="submit"
                          className="text-lg font-medium text-rose-400 hover:text-rose-350 flex items-center gap-1 cursor-pointer bg-transparent border-0"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </form>
                    </>
                  ) : !loading ? (
                    <Link href="/login" className="text-lg font-medium text-accent">
                      Login
                    </Link>
                  ) : (
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  )}
                </div>
                <div className="mt-4">
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
