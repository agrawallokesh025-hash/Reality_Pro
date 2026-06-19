"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sun, Sunset, Moon, Sparkles } from "lucide-react"

type TimeMode = "morning" | "sunset" | "evening" | "night"

interface ModeConfig {
  label: string
  icon: React.ComponentType<any>
  skyClass: string
  glassColor: string
  glassOpacity: number
  windowGlowColor: string
  windowGlowOpacity: number
  shadowColor: string
  shadowOpacity: number
  reflectionOpacity: number
  ambientGlow: string
}

const modes: Record<TimeMode, ModeConfig> = {
  morning: {
    label: "Morning",
    icon: Sun,
    skyClass: "bg-gradient-to-b from-sky-400 via-amber-100 to-rose-50",
    glassColor: "#cbd5e1", // soft sky gray-blue
    glassOpacity: 0.45,
    windowGlowColor: "#ffffff",
    windowGlowOpacity: 0.1,
    shadowColor: "#1e293b",
    shadowOpacity: 0.15,
    reflectionOpacity: 0.3,
    ambientGlow: "rgba(251, 191, 36, 0.05)",
  },
  sunset: {
    label: "Sunset",
    icon: Sunset,
    skyClass: "bg-gradient-to-b from-orange-500 via-rose-400 to-indigo-950",
    glassColor: "#fda4af", // warm rose reflection
    glassOpacity: 0.65,
    windowGlowColor: "#fb923c", // orange glow
    windowGlowOpacity: 0.55,
    shadowColor: "#0f172a",
    shadowOpacity: 0.3,
    reflectionOpacity: 0.5,
    ambientGlow: "rgba(244, 63, 94, 0.15)",
  },
  evening: {
    label: "Evening",
    icon: Sparkles,
    skyClass: "bg-gradient-to-b from-indigo-950 via-purple-900 to-orange-300",
    glassColor: "#312e81", // deep purple-blue
    glassOpacity: 0.55,
    windowGlowColor: "#fbbf24", // bright warm amber
    windowGlowOpacity: 0.85,
    shadowColor: "#020617",
    shadowOpacity: 0.45,
    reflectionOpacity: 0.4,
    ambientGlow: "rgba(251, 191, 36, 0.25)",
  },
  night: {
    label: "Night",
    icon: Moon,
    skyClass: "bg-gradient-to-b from-[#020617] via-[#0b1329] to-[#1e293b]",
    glassColor: "#1e293b", // dark slate
    glassOpacity: 0.3,
    windowGlowColor: "#eab308", // rich yellow
    windowGlowOpacity: 0.75,
    shadowColor: "#000000",
    shadowOpacity: 0.6,
    reflectionOpacity: 0.2,
    ambientGlow: "rgba(234, 179, 8, 0.15)",
  },
}

export function InteractiveVilla() {
  const [currentMode, setCurrentMode] = React.useState<TimeMode>("evening")
  const config = modes[currentMode]

  return (
    <div className="w-full max-w-[550px] aspect-square rounded-3xl border border-border bg-card shadow-2xl p-6 flex flex-col justify-between overflow-hidden relative group/villa select-none">
      {/* Dynamic Sky Backdrop Layer */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-1000 ${config.skyClass}`}
      />

      {/* Decorative Starry Layer (visible in evening & night) */}
      <AnimatePresence>
        {(currentMode === "night" || currentMode === "evening") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "radial-gradient(white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        )}
      </AnimatePresence>

      {/* Ambient Light Overlay */}
      <motion.div
        animate={{ backgroundColor: config.skyClass.includes("from-orange") ? "rgba(244, 63, 94, 0.04)" : "rgba(0,0,0,0)" }}
        className="absolute inset-0 z-1 pointer-events-none transition-colors duration-1000"
      />

      {/* Header / Mode Indicator */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/40">
          Interactive Villa Experience
        </span>
        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/40 flex items-center gap-1.5">
          {React.createElement(config.icon, { className: "h-3.5 w-3.5 animate-pulse" })}
          {config.label} Mode
        </span>
      </div>

      {/* Interactive 3D Villa Vector Representation */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-6 w-full">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] max-h-[280px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic Ground Shadow */}
          <motion.ellipse
            cx="300"
            cy="350"
            rx="260"
            ry="20"
            animate={{
              fill: config.shadowColor,
              opacity: config.shadowOpacity,
            }}
            transition={{ duration: 1 }}
          />

          {/* Villa Main Concrete Frame Structure */}
          <path d="M70 340 L530 340 L530 160 L410 160 L410 200 L190 200 L190 160 L70 160 Z" fill="#ffffff" fillOpacity="0.08" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.2" />
          
          {/* Ground Platform */}
          <rect x="50" y="335" width="500" height="10" rx="3" fill="#ffffff" fillOpacity="0.12" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.25" />

          {/* Floor Separators / Columns */}
          <rect x="70" y="210" width="460" height="8" fill="#e2e8f0" fillOpacity="0.9" />
          <rect x="70" y="160" width="460" height="10" fill="#f8fafc" fillOpacity="0.95" />
          
          {/* Main Pillars */}
          <rect x="80" y="170" width="12" height="165" fill="#f1f5f9" />
          <rect x="294" y="218" width="12" height="117" fill="#f1f5f9" />
          <rect x="508" y="170" width="12" height="165" fill="#f1f5f9" />

          {/* ================= FLOOR 1 GLASS & GLOWS ================= */}
          {/* Left Room Glass */}
          <motion.rect
            x="98"
            y="222"
            width="180"
            height="110"
            rx="4"
            animate={{
              fill: config.glassColor,
              fillOpacity: config.glassOpacity,
            }}
            transition={{ duration: 1 }}
          />
          {/* Left Room Window Interior Light Glow (Dynamic) */}
          <motion.rect
            x="110"
            y="235"
            width="156"
            height="85"
            rx="2"
            animate={{
              fill: config.windowGlowColor,
              opacity: config.windowGlowOpacity,
            }}
            transition={{ duration: 1 }}
            style={{
              filter: `blur(${currentMode === "evening" || currentMode === "night" ? "12px" : "4px"})`,
            }}
          />

          {/* Right Room Glass */}
          <motion.rect
            x="320"
            y="222"
            width="180"
            height="110"
            rx="4"
            animate={{
              fill: config.glassColor,
              fillOpacity: config.glassOpacity,
            }}
            transition={{ duration: 1 }}
          />
          {/* Right Room Window Interior Light Glow */}
          <motion.rect
            x="332"
            y="235"
            width="156"
            height="85"
            rx="2"
            animate={{
              fill: config.windowGlowColor,
              opacity: config.windowGlowOpacity,
            }}
            transition={{ duration: 1 }}
            style={{
              filter: `blur(${currentMode === "evening" || currentMode === "night" ? "12px" : "4px"})`,
            }}
          />

          {/* ================= FLOOR 2 (PENTHOUSE LEVEL) ================= */}
          {/* Upper Glass Room */}
          <motion.rect
            x="200"
            y="110"
            width="200"
            height="90"
            rx="4"
            animate={{
              fill: config.glassColor,
              fillOpacity: config.glassOpacity,
            }}
            transition={{ duration: 1 }}
          />
          {/* Upper Glass Room Glow */}
          <motion.rect
            x="215"
            y="120"
            width="170"
            height="70"
            rx="2"
            animate={{
              fill: config.windowGlowColor,
              opacity: config.windowGlowOpacity * 0.9,
            }}
            transition={{ duration: 1 }}
            style={{
              filter: `blur(${currentMode === "evening" || currentMode === "night" ? "10px" : "3px"})`,
            }}
          />

          {/* Upper Overhanging Roof */}
          <path d="M160 110 L440 110 L420 100 L180 100 Z" fill="#f8fafc" />

          {/* Decorative Balcony Railings */}
          <rect x="92" y="295" width="416" height="4" fill="#64748b" />
          <line x1="92" y1="299" x2="92" y2="330" stroke="#64748b" strokeWidth="2" />
          <line x1="200" y1="299" x2="200" y2="330" stroke="#64748b" strokeWidth="2" />
          <line x1="300" y1="299" x2="300" y2="330" stroke="#64748b" strokeWidth="2" />
          <line x1="400" y1="299" x2="400" y2="330" stroke="#64748b" strokeWidth="2" />
          <line x1="508" y1="299" x2="508" y2="330" stroke="#64748b" strokeWidth="2" />

          {/* Dynamic Light Beam Reflections on pool/ground */}
          <motion.polygon
            points="110,320 266,320 280,350 96,350"
            animate={{
              fill: config.windowGlowColor,
              opacity: config.reflectionOpacity * 0.4,
            }}
            transition={{ duration: 1 }}
          />
          <motion.polygon
            points="332,320 488,320 502,350 318,350"
            animate={{
              fill: config.windowGlowColor,
              opacity: config.reflectionOpacity * 0.4,
            }}
            transition={{ duration: 1 }}
          />
        </svg>

        {/* Ambient Glow Backdrop Layer behind buttons */}
        <motion.div
          animate={{ boxShadow: `0 0 60px 10px ${config.ambientGlow}` }}
          className="absolute inset-0 pointer-events-none rounded-full max-w-[400px] aspect-square mx-auto my-auto transition-shadow duration-1000 z-1"
        />
      </div>

      {/* Luxury User Mode Selectors */}
      <div className="relative z-10 grid grid-cols-4 gap-2 bg-background/80 backdrop-blur-md p-1.5 rounded-2xl border border-border/40 max-w-sm mx-auto w-full">
        {(Object.keys(modes) as TimeMode[]).map((mode) => {
          const modeCfg = modes[mode]
          const isActive = currentMode === mode

          return (
            <button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md scale-102"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {React.createElement(modeCfg.icon, { className: `h-4 w-4 mb-1 ${isActive ? "text-accent animate-pulse" : ""}` })}
              <span className="text-[8px] font-mono uppercase tracking-wider font-semibold">
                {modeCfg.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
