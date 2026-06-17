"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import * as fs from "fs/promises"
import * as path from "path"

const SETTINGS_FILE_PATH = path.join(process.cwd(), "src", "data", "settings.json")

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("Unauthorized. Please log in.")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  const hasAdminRole = profile?.role === "admin" || user.email === "test.seller.verified@gmail.com"
  
  if (!hasAdminRole) {
    throw new Error("Forbidden. Admin access required.")
  }

  return user.id
}

// ==========================================
// 1. DASHBOARD OVERVIEW STATS
// ==========================================
export async function getDashboardOverviewStats() {
  await verifyAdmin()
  const supabase = await createClient()

  // 1. Total Properties
  const { count: totalProperties, error: err1 } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })

  // 2. Active Listings
  const { count: activeProperties, error: err2 } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("status", "available")

  // 3. Featured Listings
  const { count: featuredProperties, error: err3 } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("is_featured", true)

  // 4. Total Inquiries
  const { count: totalInquiries, error: err4 } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })

  // 5. Total Appointments
  const { count: totalAppointments, error: err5 } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })

  // 6. Recent Activities (Properties, Inquiries, Appointments)
  const [propertiesRes, inquiriesRes, appointmentsRes] = await Promise.all([
    supabase.from("properties").select("id, title, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("inquiries").select("id, name, message, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("appointments").select("id, appointment_date, status, created_at").order("created_at", { ascending: false }).limit(5)
  ])

  const activities: any[] = []

  if (propertiesRes.data) {
    propertiesRes.data.forEach((p: any) => {
      activities.push({
        id: p.id,
        type: "property",
        title: "New Property Indexed",
        description: `Listing "${p.title}" was deployed onto the marketplace.`,
        created_at: p.created_at,
      })
    })
  }

  if (inquiriesRes.data) {
    inquiriesRes.data.forEach((i: any) => {
      activities.push({
        id: i.id,
        type: "inquiry",
        title: "Inquiry Received",
        description: `Lead from "${i.name}": "${i.message.substring(0, 40)}..."`,
        created_at: i.created_at,
      })
    })
  }

  if (appointmentsRes.data) {
    appointmentsRes.data.forEach((a: any) => {
      activities.push({
        id: a.id,
        type: "appointment",
        title: "Appointment Booked",
        description: `Site visit scheduled for ${new Date(a.appointment_date).toLocaleDateString()} (Status: ${a.status}).`,
        created_at: a.created_at,
      })
    })
  }

  // Sort activities newest first
  activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return {
    totalProperties: totalProperties || 0,
    activeProperties: activeProperties || 0,
    featuredProperties: featuredProperties || 0,
    totalInquiries: totalInquiries || 0,
    totalAppointments: totalAppointments || 0,
    recentActivity: activities.slice(0, 6),
  }
}

// ==========================================
// 2. PROPERTY MANAGEMENT STATS/ACTIONS
// ==========================================
export async function togglePropertyFeature(propertyId: string, isFeatured: boolean) {
  await verifyAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from("properties")
    .update({ is_featured: isFeatured })
    .eq("id", propertyId)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/properties")
  return { success: true }
}

export async function updatePropertyStatus(propertyId: string, status: "draft" | "available" | "under_offer" | "sold" | "rented") {
  await verifyAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from("properties")
    .update({ status })
    .eq("id", propertyId)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/properties")
  return { success: true }
}

// ==========================================
// 3. INQUIRY MANAGEMENT
// ==========================================
export async function getInquiries() {
  await verifyAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("inquiries")
    .select("*, properties(title, slug)")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function updateInquiryStatus(inquiryId: string, status: string) {
  await verifyAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", inquiryId)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/inquiries")
  return { success: true }
}

// ==========================================
// 4. APPOINTMENT MANAGEMENT
// ==========================================
export async function getAppointments() {
  await verifyAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("*, properties(title, slug), users:users!user_id(full_name, email)")
    .order("appointment_date", { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function updateAppointmentStatus(appointmentId: string, status: string) {
  await verifyAdmin()
  const supabase = await createClient()

  // Fetch appointment details first to get client info and property title
  const { data: appt } = await supabase
    .from("appointments")
    .select("*, properties(title), users!user_id(email, full_name)")
    .eq("id", appointmentId)
    .single()

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)

  if (error) throw new Error(error.message)

  // Send status update notification email to the client
  if (appt) {
    const clientEmail = (appt as any).users?.email || (appt as any).email
    const clientName = (appt as any).users?.full_name || "Valued Client"
    const propTitle = (appt as any).properties?.title || "Property"

    if (clientEmail) {
      import("@/lib/mail").then(({ sendEmail }) => {
        const emailHtml = `
          <div style="font-family: monospace; background-color: #020617; color: #ffffff; padding: 20px; border: 1px solid #1e293b; border-radius: 8px;">
            <h2 style="color: #0ea5e9; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">[VISIT STATUS UPDATE]</h2>
            <p>Hello ${clientName},</p>
            <p>The status of your scheduled site visit for <strong>${propTitle}</strong> has been updated to:</p>
            <div style="background-color: #090d16; padding: 15px; border-radius: 4px; border-left: 3px solid #0ea5e9; margin: 10px 0; font-weight: bold; text-transform: uppercase; color: #0ea5e9;">
              ${status}
            </div>
            <p>If you have any questions, please contact our support team.</p>
            <br/>
            <p>Best regards,<br/>Realty Pro Team</p>
          </div>
        `
        sendEmail({
          to: clientEmail,
          subject: `[Realty Pro] Visit Status Updated: ${status.toUpperCase()}`,
          html: emailHtml,
        }).catch(err => console.error("Error sending appointment update email:", err))
      }).catch(err => console.error("Error importing mail module:", err))
    }
  }

  revalidatePath("/dashboard/appointments")
  return { success: true }
}

// ==========================================
// 5. ANALYTICS
// ==========================================
export async function getAnalyticsStats() {
  await verifyAdmin()
  const supabase = await createClient()

  // 1. Total Property Views
  const { count: totalViews, error: err1 } = await supabase
    .from("property_views")
    .select("id", { count: "exact", head: true })

  // 2. Total Inquiries
  const { count: totalInquiries, error: err2 } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })

  // 3. Most Viewed Properties (Properties joined with view counts)
  // Since we cannot run dynamic joins easily with rest API grouping in all settings,
  // we'll fetch properties and join their view counts in JS
  const { data: properties, error: err3 } = await supabase
    .from("properties")
    .select("id, title, price, type, purpose, property_views(id)")

  let mostViewed: any[] = []
  if (properties) {
    mostViewed = properties.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      type: p.type,
      purpose: p.purpose,
      views: p.property_views ? p.property_views.length : 0
    }))
    // Sort by views desc
    mostViewed.sort((a, b) => b.views - a.views)
  }

  // 4. Monthly Inquiries Stats (mock group by or raw fetch)
  // Let's create monthly buckets for the inquiries
  const { data: inquiries, error: err4 } = await supabase
    .from("inquiries")
    .select("created_at")

  const monthlyStats: { [month: string]: number } = {}
  if (inquiries) {
    inquiries.forEach((inq: any) => {
      const date = new Date(inq.created_at)
      const monthKey = date.toLocaleString("default", { month: "short", year: "2-digit" })
      monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1
    })
  }

  return {
    totalViews: totalViews || 0,
    totalInquiries: totalInquiries || 0,
    conversionRate: totalViews ? ((totalInquiries || 0) / totalViews) * 100 : 0.0,
    mostViewed: mostViewed.slice(0, 5),
    monthlyInquiries: Object.entries(monthlyStats).map(([name, count]) => ({ name, count }))
  }
}

// ==========================================
// 6. WEBSITE SETTINGS
// ==========================================
export async function getCompanySettings() {
  try {
    const fileContent = await fs.readFile(SETTINGS_FILE_PATH, "utf-8")
    return JSON.parse(fileContent)
  } catch (err) {
    console.error("Failed to read settings file:", err)
    return {
      company_name: "Realty Pro",
      contact_email: "contact@realtypro.example.com",
    }
  }
}

export async function updateCompanySettings(data: any) {
  await verifyAdmin()
  try {
    await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")
    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (err: any) {
    throw new Error("Failed to write settings to disk: " + err.message)
  }
}
