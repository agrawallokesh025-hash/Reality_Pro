import * as React from "react"
import { getAnalyticsStats } from "@/actions/dashboard"
import { BarChart3, TrendingUp, Eye, Mail, Award } from "lucide-react"

export const revalidate = 0

export default async function DashboardAnalyticsPage() {
  const stats = await getAnalyticsStats()

  const metrics = [
    { label: "Aggregate Page Views", value: stats.totalViews, icon: Eye, color: "text-sky-400" },
    { label: "Total Client Leads", value: stats.totalInquiries, icon: Mail, color: "text-indigo-400" },
    { label: "Conversion Efficiency", value: `${stats.conversionRate.toFixed(2)}%`, icon: TrendingUp, color: "text-emerald-400" }
  ]

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white">
          Operations Analytics
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-sans mt-0.5">
          Audience engagement indexes, inquiry conversion efficiency, and listing popularity rankings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-900 bg-slate-900/5 relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 text-slate-800 group-hover:text-slate-600 transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                {metric.label}
              </span>
              <span className={`text-2xl font-black ${metric.color} tracking-tight block mt-2`}>
                {metric.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Viewed properties */}
        <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            Top 5 Most Viewed Listings
          </h3>

          <div className="space-y-2.5 pt-2">
            {stats.mostViewed.length > 0 ? (
              stats.mostViewed.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-xl border border-slate-900/60 hover:border-slate-850/60 transition"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-extrabold text-[10px] text-slate-500 bg-slate-900 h-5 w-5 rounded flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-slate-200 uppercase tracking-wide block truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] text-slate-650 uppercase block font-sans tracking-wide mt-0.5">
                        {item.type} / For {item.purpose}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-extrabold text-sky-400 block font-mono">
                      {item.views} VIEWS
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans block mt-0.5">
                      ${Number(item.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-600 font-sans">
                No property views cataloged yet.
              </div>
            )}
          </div>
        </div>

        {/* Monthly statistics */}
        <div className="bg-slate-900/15 border border-slate-900/80 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            Monthly Lead Volume
          </h3>

          <div className="space-y-3 pt-2 font-sans">
            {stats.monthlyInquiries.length > 0 ? (
              stats.monthlyInquiries.map((m: any) => (
                <div key={m.name} className="space-y-1 bg-slate-950/20 p-2.5 rounded-lg border border-slate-900/60">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                    <span>{m.name.toUpperCase()}</span>
                    <span>{m.count} INQUIRIES</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, (m.count / Math.max(1, stats.totalInquiries)) * 100)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-600 font-sans font-mono text-xs">
                No inquiries recorded across monthly boundaries.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
