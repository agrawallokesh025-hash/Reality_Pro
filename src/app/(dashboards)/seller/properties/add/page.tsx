import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PropertyForm } from "./property-form"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AddPropertyPage() {
  const supabase = await createClient()

  // 1. Verify Authentication & Role
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || (profile.role !== "seller" && profile.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-mono flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-500 animate-pulse" />
        <h1 className="text-xl font-bold uppercase tracking-wider text-rose-400">Access Restricted</h1>
        <p className="text-xs text-slate-400 font-sans max-w-sm">
          Your account does not possess seller credentials. To list properties, please request a seller profile conversion.
        </p>
        <Button variant="outline" asChild size="sm" className="border-slate-800">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-mono selection:bg-sky-500/30">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.02),transparent_60%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0ea5e9 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative z-10 max-w-3xl mx-auto px-4 py-12 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-slate-800 text-slate-400 hover:text-white"
            >
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                DASHBOARD HOME
              </Link>
            </Button>
          </div>

          <div className="space-y-1 mt-4">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
              Deploy New Listing
            </h1>
            <p className="text-xs text-slate-500 font-sans">
              Populate listing coordinates, space specs, and media assets to index it onto the search marketplace.
            </p>
          </div>
        </div>

        {/* Form component */}
        <PropertyForm />

      </div>
    </div>
  )
}
