"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send, Check } from "lucide-react"

export function ContactCTA() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [interest, setInterest] = React.useState("consult")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setIsSubmitting(true)

    // Simulate elite submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setName("")
      setEmail("")
      setPhone("")
    }, 1200)
  }

  return (
    <section className="container mx-auto px-4 md:px-8 py-20">
      <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground border border-accent/20 shadow-2xl">
        {/* Soft Background Textures */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(194,169,126,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="grid lg:grid-cols-12 gap-12 p-8 md:p-16 relative z-10 items-center">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-accent text-xs font-mono tracking-widest uppercase block">
                Bespoke Placement
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">
                Begin Your <br />
                <span className="font-serif italic font-normal text-accent">Legacy Journey</span>
              </h2>
              <p className="text-primary-foreground/75 font-sans font-light text-sm md:text-base leading-relaxed">
                Connect with our private client advisors to arrange a confidential viewing, explore off-market estates, or initiate a bespoke property search.
              </p>
            </div>

            <div className="space-y-4 font-sans font-light text-sm text-primary-foreground/90">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/5 text-accent shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <span>+1 (800) REALTY-PRO</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/5 text-accent shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <span>privateclients@realtypro.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/5 text-accent shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>742 Fifth Avenue, New York, NY</span>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7 bg-card text-foreground rounded-2xl p-6 md:p-10 border border-border/50 shadow-xl relative min-h-[380px] flex flex-col justify-center">
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 animate-fade-in-up"
              >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium" htmlFor="cta-name">
                        Full Name *
                      </label>
                      <input
                        id="cta-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-muted/50 border border-border/80 focus:border-accent rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium" htmlFor="cta-email">
                        Email Address *
                      </label>
                      <input
                        id="cta-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-muted/50 border border-border/80 focus:border-accent rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium" htmlFor="cta-phone">
                        Phone Number
                      </label>
                      <input
                        id="cta-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-muted/50 border border-border/80 focus:border-accent rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium" htmlFor="cta-interest">
                        Interested In
                      </label>
                      <select
                        id="cta-interest"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full bg-muted/50 border border-border/80 focus:border-accent rounded-xl px-4 py-2.5 text-sm outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="consult">Private Consultation</option>
                        <option value="buy">Buying Luxury Property</option>
                        <option value="rent">Renting Premium Space</option>
                        <option value="list">Selling an Estate</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-medium py-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <span className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-accent" />
                        Request Private Consultation
                      </>
                    )}
                  </Button>
              </form>
            ) : (
              <div
                className="text-center space-y-4 py-8 animate-fade-in-up"
              >
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-accent/30 text-accent">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-serif text-foreground">Inquiry Logged</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto font-sans font-light leading-relaxed">
                  Thank you. A senior private client advisor has been assigned to your profile and will contact you within the next 2 hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="border-border text-foreground hover:bg-muted rounded-xl px-6"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
