import * as React from "react"
import { getCompanySettings } from "@/actions/dashboard"
import { SettingsForm } from "./settings-form"

export const revalidate = 0

export default async function DashboardSettingsPage() {
  const settings = await getCompanySettings()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white">
          Portal & Website Settings
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
          Configure branding coordinates, metadata parameters, social links, and SEO tags.
        </p>
      </div>

      {/* Settings Form component */}
      <SettingsForm initialSettings={settings} />
    </div>
  )
}
