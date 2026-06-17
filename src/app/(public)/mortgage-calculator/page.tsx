import * as React from "react"
import { MortgageCalculator } from "@/components/properties/mortgage-calculator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mortgage Calculator | Realty Pro",
  description: "Calculate your monthly home loan installments (EMI), total interest, and total repayment using our interactive mortgage tool.",
}

export default function StandaloneMortgageCalculatorPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-mono selection:bg-sky-500/30">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.02),transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0ea5e9 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container relative z-10 max-w-2xl mx-auto px-4 py-16 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-black tracking-wider uppercase bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Mortgage Calculator
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans max-w-md mx-auto leading-relaxed">
            Estimate your monthly payments, adjust interest rates, and optimize your loan tenure instantly.
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-slate-900/10 rounded-3xl p-1 border border-slate-900">
          <MortgageCalculator initialPrincipal={500000} />
        </div>
      </div>
    </div>
  )
}
