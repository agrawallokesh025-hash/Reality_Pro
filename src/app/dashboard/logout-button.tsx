"use client"

import * as React from "react"
import { logout } from "@/actions/auth"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const [pending, startTransition] = React.useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-rose-950/40 bg-rose-950/10 hover:bg-rose-950/20 text-[10px] font-bold uppercase text-rose-400 disabled:opacity-50 transition cursor-pointer"
    >
      <LogOut className="h-3.5 w-3.5" />
      {pending ? "..." : "OUT"}
    </button>
  )
}
