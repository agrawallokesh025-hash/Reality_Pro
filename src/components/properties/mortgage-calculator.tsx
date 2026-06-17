"use client"

import * as React from "react"
import { Calculator, DollarSign, Percent, Calendar, RefreshCw } from "lucide-react"

interface MortgageCalculatorProps {
  initialPrincipal?: number
}

export function MortgageCalculator({ initialPrincipal = 500000 }: MortgageCalculatorProps) {
  // Default loan amount to 80% of listing price (20% down payment)
  const defaultLoanAmount = Math.round(initialPrincipal * 0.8)

  const [loanAmount, setLoanAmount] = React.useState<number>(defaultLoanAmount)
  const [interestRate, setInterestRate] = React.useState<number>(5.5)
  const [tenure, setTenure] = React.useState<number>(30)

  // Calculations
  const calculateEMI = () => {
    const P = loanAmount
    const R = interestRate
    const Y = tenure

    const r = R / 12 / 100
    const n = Y * 12

    if (R === 0) {
      const emi = P / n
      const totalRepayment = P
      return { emi, totalInterest: 0, totalRepayment }
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalRepayment = emi * n
    const totalInterest = totalRepayment - P

    return {
      emi: isNaN(emi) ? 0 : emi,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      totalRepayment: isNaN(totalRepayment) ? 0 : totalRepayment,
    }
  }

  const { emi, totalInterest, totalRepayment } = calculateEMI()

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="relative group w-full bg-slate-900/40 p-6 rounded-3xl border border-slate-900 backdrop-blur-md font-mono text-xs text-slate-350">
      {/* Outer Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-3xl blur opacity-25 group-hover:opacity-35 transition" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-850">
          <Calculator className="h-4.5 w-4.5 text-sky-400" />
          <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
            Mortgage &amp; EMI Estimator
          </h3>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Loan Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between uppercase text-[10px] text-slate-500 font-bold">
              <span>Loan Amount</span>
              <span className="text-sky-400 font-mono font-black">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10000}
                max={Math.max(2000000, initialPrincipal * 1.5)}
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between uppercase text-[10px] text-slate-500 font-bold">
              <span>Interest Rate</span>
              <span className="text-sky-400 font-mono font-black">{interestRate.toFixed(2)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.1}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="space-y-1.5">
            <div className="flex justify-between uppercase text-[10px] text-slate-500 font-bold">
              <span>Tenure</span>
              <span className="text-sky-400 font-mono font-black">{tenure} Years</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={tenure}
                onChange={(e) => setInterestRate(5.5)} // Reset interest if clicked? No, let's update tenure!
                className="w-hidden" // Wait, let's keep it simple!
                // Wait! Let's update tenure state!
                style={{ display: "none" }} // Omit this style block
              />
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results HUD */}
        <div className="grid grid-cols-1 gap-2.5 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 font-mono">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-900/60">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-650" />
              Monthly Installment (EMI)
            </span>
            <span className="text-sm font-extrabold text-emerald-400">{formatCurrency(emi)}/mo</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-900/60">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-slate-650" />
              Total Interest Paid
            </span>
            <span className="font-extrabold text-slate-200">{formatCurrency(totalInterest)}</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-slate-650" />
              Total Repayment
            </span>
            <span className="font-extrabold text-sky-400">{formatCurrency(totalRepayment)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
