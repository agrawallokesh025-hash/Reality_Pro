"use client"

import * as React from "react"
import { updateCompanySettings } from "@/actions/dashboard"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Info, Globe, Share2 } from "lucide-react"

interface SettingsFormProps {
  initialSettings: any
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = React.useState(initialSettings)
  const [saving, setSaving] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateCompanySettings(settings)
      toast.success("Company settings updated successfully.")
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl font-mono text-xs text-slate-350">
      
      {/* SECTION 1: COMPANY INFO */}
      <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4" />
          1. Company & Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={settings.company_name || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={settings.tagline || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={settings.contact_email || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Contact Phone</label>
            <input
              type="text"
              name="contact_phone"
              value={settings.contact_phone || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
            />
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <label className="text-[10px] text-slate-500 uppercase tracking-wider">Office Street Address</label>
          <input
            type="text"
            name="office_address"
            value={settings.office_address || ""}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
          />
        </div>
      </div>

      {/* SECTION 2: SOCIAL CHANNELS */}
      <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          2. Social Link Connects
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Facebook URL</label>
            <input
              type="text"
              name="facebook_url"
              value={settings.facebook_url || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Twitter URL</label>
            <input
              type="text"
              name="twitter_url"
              value={settings.twitter_url || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Instagram URL</label>
            <input
              type="text"
              name="instagram_url"
              value={settings.instagram_url || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
            <input
              type="text"
              name="linkedin_url"
              value={settings.linkedin_url || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              placeholder="https://linkedin.com/..."
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: SEO META DATA */}
      <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-2">
          <Globe className="h-4 w-4" />
          3. Search Engine Optimization (SEO)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">SEO Title Suffix</label>
            <input
              type="text"
              name="seo_title_suffix"
              value={settings.seo_title_suffix || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              placeholder="e.g. Realty Pro"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Meta Description</label>
            <textarea
              name="seo_meta_description"
              value={settings.seo_meta_description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition resize-none"
              placeholder="Describe your site for Google search result cards..."
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Keywords (comma separated)</label>
            <input
              type="text"
              name="seo_keywords"
              value={settings.seo_keywords || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              placeholder="real estate, cyberpunk, properties..."
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: WHATSAPP CLICK-TO-CHAT */}
      <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-square h-4 w-4"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          4. WhatsApp Click-to-Chat Config
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">WhatsApp Contact Number</label>
            <input
              type="text"
              name="whatsapp_number"
              value={settings.whatsapp_number || ""}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition"
              placeholder="e.g. +15550199000"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Default Message Template</label>
            <textarea
              name="whatsapp_template"
              value={settings.whatsapp_template || ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white outline-none transition resize-none"
              placeholder="e.g. Hello! I am interested in property '[title]' (ID: [id]). Link: [url]"
            />
            <p className="text-[8px] text-slate-500 mt-1 uppercase tracking-wide">
              Tip: Use placeholders <span className="text-sky-400 font-bold">[title]</span>, <span className="text-sky-400 font-bold">[id]</span>, and <span className="text-sky-400 font-bold">[url]</span> to automatically populate details.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold uppercase py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xl transition"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Portal Settings...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

    </form>
  )
}
