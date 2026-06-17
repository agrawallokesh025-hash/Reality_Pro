"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const InquirySchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export type InquiryState = {
  success: boolean | null
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    phone?: string[]
    message?: string[]
  }
}

export async function createInquiry(prevState: InquiryState, formData: FormData): Promise<InquiryState> {
  const supabase = await createClient()

  // Extract raw form data
  const rawData = {
    propertyId: formData.get("propertyId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  }

  // Validate fields
  const validated = InquirySchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the validation errors.",
    }
  }

  const { propertyId, name, email, phone, message } = validated.data

  // Try to get authenticated user to set user_id if logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Get property details and seller email
  const { data: property } = await supabase
    .from("properties")
    .select("title, users!seller_id(email, full_name)")
    .eq("id", propertyId)
    .single()

  const sellerEmail = (property as any)?.users?.email || "agency@realtypro.com"

  const { error } = await supabase
    .from("inquiries")
    .insert({
      property_id: propertyId,
      user_id: user?.id || null,
      name,
      email,
      phone: phone || null,
      message,
      status: "new",
    })

  if (error) {
    console.error("Error creating inquiry:", error)
    return {
      success: false,
      message: "Failed to submit inquiry. Please try again later.",
    }
  }

  // Trigger emails asynchronously
  import("@/lib/mail").then(({ sendEmail }) => {
    // 1. To Admin
    const adminEmailHtml = `
      <div style="font-family: monospace; background-color: #020617; color: #ffffff; padding: 20px; border: 1px solid #1e293b; border-radius: 8px;">
        <h2 style="color: #0ea5e9; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">[NEW INQUIRY RECEIVED]</h2>
        <p><strong>Property:</strong> ${property?.title || 'Unknown Property'}</p>
        <p><strong>Lead Name:</strong> ${name}</p>
        <p><strong>Lead Email:</strong> ${email}</p>
        <p><strong>Lead Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #090d16; padding: 15px; border-radius: 4px; border-left: 3px solid #0ea5e9; margin-top: 10px; font-style: italic;">
          "${message}"
        </div>
      </div>
    `
    sendEmail({
      to: sellerEmail,
      subject: `[Realty Pro] New Inquiry: ${property?.title || 'Property'}`,
      html: adminEmailHtml,
    }).catch(err => console.error("Error sending admin email:", err))

    // 2. To Client
    const clientEmailHtml = `
      <div style="font-family: monospace; background-color: #020617; color: #ffffff; padding: 20px; border: 1px solid #1e293b; border-radius: 8px;">
        <h2 style="color: #0ea5e9; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">[INQUIRY RECORDED]</h2>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out to Realty Pro regarding <strong>${property?.title || 'the property'}</strong>. Your inquiry has been logged, and our agent will connect with you shortly.</p>
        <p><strong>Copy of your message:</strong></p>
        <div style="background-color: #090d16; padding: 15px; border-radius: 4px; border-left: 3px solid #6366f1; margin-top: 10px; font-style: italic; color: #94a3b8;">
          "${message}"
        </div>
        <p style="margin-top: 20px; font-size: 10px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 10px;">
          This is an automated receipt confirmation from Realty Pro.
        </p>
      </div>
    `
    sendEmail({
      to: email,
      subject: `[Realty Pro] Inquiry Confirmation: ${property?.title || 'Property'}`,
      html: clientEmailHtml,
    }).catch(err => console.error("Error sending client email:", err))
  }).catch(err => console.error("Error importing mail module:", err))

  return {
    success: true,
    message: "Your inquiry has been sent successfully! The seller will contact you shortly.",
  }

}
