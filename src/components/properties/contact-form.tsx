"use client"

import * as React from "react"
import { useActionState } from "react"
import { createInquiry, InquiryState } from "@/actions/inquiries"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, AlertTriangle, Send, Phone } from "lucide-react"
import { getCompanySettings } from "@/actions/dashboard"

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
  propertySlug: string
  sellerPhone?: string | null
  sellerName?: string
}

const initialState: InquiryState = {
  success: null,
  message: "",
}

export function ContactForm({
  propertyId,
  propertyTitle,
  propertySlug,
  sellerPhone,
  sellerName = "Seller",
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(createInquiry, initialState)
  const [settings, setSettings] = React.useState<any>(null)

  React.useEffect(() => {
    getCompanySettings().then(setSettings).catch(console.error)
  }, [])

  let waUrl = ""
  if (settings && settings.whatsapp_number) {
    const cleanNumber = settings.whatsapp_number.replace(/[^0-9]/g, "")
    const propertyUrl = typeof window !== "undefined" ? `${window.location.origin}/properties/${propertySlug}` : ""
    let template = settings.whatsapp_template || "Hello! I am interested in property '[title]' (ID: [id]). Link: [url]"
    const formattedMsg = template
      .replace("[title]", propertyTitle)
      .replace("[id]", propertyId)
      .replace("[url]", propertyUrl)
    waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formattedMsg)}`
  }

  return (
    <div className="relative group w-full bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md font-mono text-sm">
      {/* Outer Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-2xl blur opacity-30 group-hover:opacity-40 transition" />

      <div className="relative space-y-6">
        <div>
          <h3 className="text-base font-bold text-sky-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2 flex items-center gap-2">
            <Send className="h-4 w-4" />
            Contact Agent
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Inquire about this estate. All communications are logged securely.
          </p>
        </div>

        {/* Display Success State */}
        {state.success === true ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-bounce" />
            <h4 className="font-bold text-emerald-400 uppercase tracking-wide">INQUIRY SENT</h4>
            <p className="text-xs text-slate-300 font-sans max-w-[200px]">
              {state.message}
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="propertyId" value={propertyId} />

            {/* Error Message banner */}
            {state.success === false && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{state.message}</span>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. John Doe"
              />
              {state.errors?.name && (
                <p className="text-[10px] text-rose-400 mt-1">{state.errors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. john@domain.com"
              />
              {state.errors?.email && (
                <p className="text-[10px] text-rose-400 mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                placeholder="e.g. +1 555-0199"
              />
              {state.errors?.phone && (
                <p className="text-[10px] text-rose-400 mt-1">{state.errors.phone[0]}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition resize-none"
                placeholder={`Hello, I am interested in this property and would like to schedule a visit...`}
              />
              {state.errors?.message && (
                <p className="text-[10px] text-rose-400 mt-1">{state.errors.message[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-2 text-xs py-2 rounded-lg transition"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Inquiry
                </>
              )}
            </Button>
          </form>
        )}

        {/* Alternate Direct Connect */}
        <div className="border-t border-slate-800 pt-4 text-center space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Or Direct Hotlink</span>
          {sellerPhone && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full text-xs border-sky-500/20 text-sky-400 hover:bg-sky-500/5 hover:text-sky-300"
            >
              <a href={`tel:${sellerPhone}`} className="flex items-center justify-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                Initialize Call Connection
              </a>
            </Button>
          )}
          {waUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full text-xs border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5 hover:text-emerald-300"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                </svg>
                Inquire via WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
