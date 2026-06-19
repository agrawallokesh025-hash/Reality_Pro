"use client"

import * as React from "react"
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react"

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
    <div className="relative w-full bg-card p-6 rounded-2xl border border-border/60 shadow-md font-sans text-sm text-foreground">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-border/50">
          <Calculator className="h-4.5 w-4.5 text-accent" />
          <h3 className="text-xs uppercase text-foreground font-semibold tracking-wider">
            Mortgage &amp; EMI Estimator
          </h3>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Loan Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between uppercase text-[10px] text-muted-foreground font-medium">
              <span>Loan Amount</span>
              <span className="text-accent font-semibold">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex items-center">
              <input
                type="range"
                min={10000}
                max={Math.max(2000000, initialPrincipal * 1.5)}
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent outline-none"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between uppercase text-[10px] text-muted-foreground font-medium">
              <span>Interest Rate</span>
              <span className="text-accent font-semibold">{interestRate.toFixed(2)}%</span>
            </div>
            <div className="flex items-center">
              <input
                type="range"
                min={0.1}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent outline-none"
              />
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="space-y-1.5">
            <div className="flex justify-between uppercase text-[10px] text-muted-foreground font-medium">
              <span>Tenure</span>
              <span className="text-accent font-semibold">{tenure} Years</span>
            </div>
            <div className="flex items-center">
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 gap-2.5 bg-muted/30 p-4 rounded-xl border border-border/30">
          <div className="flex justify-between items-center py-1.5 border-b border-border/40">
            <span className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              Monthly Installment (EMI)
            </span>
            <span className="text-sm font-semibold text-accent">{formatCurrency(emi)}/mo</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-border/40">
            <span className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-accent" />
              Total Interest Paid
            </span>
            <span className="font-medium text-foreground">{formatCurrency(totalInterest)}</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-[10px] text-muted-foreground uppercase font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-accent" />
              Total Repayment
            </span>
            <span className="font-semibold text-primary dark:text-accent-foreground">{formatCurrency(totalRepayment)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
