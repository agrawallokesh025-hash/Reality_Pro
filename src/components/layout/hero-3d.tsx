"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react"

export function Hero3D() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Motion values for tracking cursor position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Map coordinate offset to 3D rotation angles (-12 to 12 degrees)
  const rotateX = useTransform(y, [-300, 300], [12, -12])
  const rotateY = useTransform(x, [-300, 300], [-12, 12])

  // Parallax displacement values for the futuristic background grid
  const gridX = useTransform(x, [-300, 300], [-25, 25])
  const gridY = useTransform(y, [-300, 300], [-25, 25])

  // Glare effect coordinates (0% to 100%)
  const glareX = useTransform(x, [-200, 200], [100, 0])
  const glareY = useTransform(y, [-200, 200], [100, 0])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    // Get mouse cursor position relative to the center of the viewport container
    const mouseX = event.clientX - rect.left - width / 2
    const mouseY = event.clientY - rect.top - height / 2
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    // Smoothly animate back to center
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[700px] flex items-center overflow-hidden bg-black text-white py-16 px-4 md:px-8 border-b border-white/10"
    >
      {/* 3D Holographic Grid Background */}
      <motion.div
        style={{
          x: gridX,
          y: gridY,
          backgroundImage:
            "linear-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        className="absolute inset-0 pointer-events-none opacity-40 z-0 mask-radial"
      />

      {/* Cybernetic Radial Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="container mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Section: Content */}
        <div className="md:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-sky-400 uppercase">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Next-Gen Real Estate Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-none">
            Find Your <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">Digital</span> Dream Home
          </h1>

          <p className="text-lg text-slate-400 max-w-xl font-light leading-relaxed">
            Experience the future of property searching. Transact luxury listings, secure investments, and browse spaces mapped completely in interactive interfaces.
          </p>

          {/* Quick HUD Specs */}
          <div className="grid grid-cols-3 gap-4 border-t border-b border-white/10 py-6 max-w-lg">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Active Listings</span>
              <div className="text-2xl font-bold font-mono">1,420+</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Secured Sales</span>
              <div className="text-2xl font-bold font-mono">$840M+</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Global Clients</span>
              <div className="text-2xl font-bold font-mono">8.9k+</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-black font-semibold border-none group">
              <Link href="/buy">
                Explore Properties
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white">
              <Link href="/rent">Rent A Space</Link>
            </Button>
          </div>
        </div>

        {/* Right Section: Interactive 3D Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:col-span-5 flex justify-center perspective-1000"
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="w-full max-w-[380px] h-[480px] bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(14,165,233,0.15)] relative overflow-hidden"
          >
            {/* Interactive Glow Glare Layer */}
            <motion.div
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(14,165,233,0.18) 0%, transparent 60%)`
                ),
              }}
              className="absolute inset-0 pointer-events-none z-10"
            />

            {/* Glowing Accent Borders */}
            <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-r from-sky-400 to-transparent" />
            <div className="absolute bottom-0 left-0 w-24 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />

            {/* Card Content */}
            <div className="space-y-4" style={{ transform: "translateZ(30px)" }}>
              {/* Holographic Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-sky-400 tracking-wider flex items-center gap-1.5 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-400/20">
                  <Layers className="h-3 w-3 animate-spin-slow" />
                  SPEC: PENTHOUSE_9X
                </span>
                <span className="text-xs font-mono text-slate-400">REV. 2026</span>
              </div>

              {/* Hologram Image Viewport */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-white/5 flex items-center justify-center">
                {/* Simulated Wireframe Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0) 95%, #0ea5e9 95%), linear-gradient(90deg, rgba(0, 0, 0, 0) 95%, #0ea5e9 95%)",
                    backgroundSize: "20px 20px"
                  }}
                />
                <div className="w-full h-full bg-gradient-to-tr from-sky-950/40 via-cyan-950/20 to-indigo-950/40 absolute inset-0" />
                <span className="text-slate-400 text-xs font-mono tracking-widest relative z-10 flex flex-col items-center gap-2">
                  <Zap className="h-5 w-5 text-sky-400 animate-bounce" />
                  [ RENDER_IMAGE_VIEW ]
                </span>
              </div>
            </div>

            {/* Card Mid: Data Readouts */}
            <div className="space-y-3 font-mono text-xs text-slate-400 my-4" style={{ transform: "translateZ(40px)" }}>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>ESTIMATED VALUE:</span>
                <span className="text-white font-semibold">$3,420,000</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>COMPLIANCE RATING:</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> SECURE
                </span>
              </div>
              <div className="flex justify-between">
                <span>ENERGY SCORE:</span>
                <span className="text-sky-400 font-bold">A++ [98%]</span>
              </div>
            </div>

            {/* Card Footer */}
            <div style={{ transform: "translateZ(50px)" }}>
              <Button asChild className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/25">
                <Link href="/properties/property-1">
                  Initialize Blueprint
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
