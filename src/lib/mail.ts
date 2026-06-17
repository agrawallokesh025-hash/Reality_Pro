import { createClient } from "@/lib/supabase/server"

interface SendMailParams {
  to: string
  subject: string
  html: string
}

/**
 * Sends an email using the Resend API with native fetch calls.
 * If RESEND_API_KEY is not defined, it gracefully falls back to console logging.
 * Implements exponential backoff retry handling on mail dispatch failures and
 * logs the resulting status ('sent' or 'failed') to the public.email_logs table.
 */
export async function sendEmail({ to, subject, html }: SendMailParams): Promise<{ success: boolean; status: "sent" | "failed" }> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Realty Pro <notifications@realtypro.com>"

  let status: "sent" | "failed" = "failed"
  const maxRetries = 3

  if (!apiKey || apiKey.trim() === "") {
    // Graceful fallback to console logging
    console.log("=========================================")
    console.log(`[EMAIL FALLBACK LOGGER]`)
    console.log(`To: ${to}`)
    console.log(`From: ${fromEmail}`)
    console.log(`Subject: ${subject}`)
    console.log(`Content HTML:\n${html}`)
    console.log("=========================================")
    
    status = "sent" // Assume success for mock/development purposes
  } else {
    // Send via Resend API with exponential backoff
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to,
            subject,
            html,
          }),
        })

        if (response.ok) {
          status = "sent"
          break
        } else {
          const errData = await response.json().catch(() => ({}))
          console.error(`Resend API attempt ${attempt} failed:`, response.status, errData)
        }
      } catch (err) {
        console.error(`Resend API attempt ${attempt} error:`, err)
      }

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  // Log to email_logs table
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("email_logs").insert({
      recipient: to,
      subject,
      status,
    })

    if (error) {
      console.error("Failed to insert email log into DB:", error)
    }
  } catch (dbErr) {
    console.error("Database connection error during email logging:", dbErr)
  }

  return { success: status === "sent", status }
}
