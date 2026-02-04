"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, TrendingUp, DollarSign, Package, Truck, ChartNoAxesCombined } from "lucide-react"
import { BASE_URL } from "@/utils/baseUrl"

export default function ReportsPage() {
  const [sales, setSales] = useState([])
  const [totals, setTotals] = useState({
    deliveredOrders: 0,
    deliveredRevenue: 0,
    totalProfit: 0,
    totalItems: 0
  })
  const [loading, setLoading] = useState(true)
  const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    fetchSalesReport()
  }, [monthYear])

  const fetchSalesReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/reports/sales?month=${monthYear}`)
      const data = await res.json()
      setSales(data.sales || [])
      setTotals(data.totals || {
        deliveredOrders: 0,
        deliveredRevenue: 0,
        totalProfit: 0,
        totalItems: 0
      })
    } catch (error) {
      console.error("Failed to fetch sales report:", error)
    } finally {
      setLoading(false)
    }
  }

  const avgOrderValue = totals.deliveredOrders > 0 ? Math.round(totals.deliveredRevenue / totals.deliveredOrders) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E556E]">Sales Report</h1>
          <p className="text-muted-foreground mt-1">Delivered orders only</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/reports/best-selling" className="flex items-center gap-2 bg-[#1E556E] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#1E556E]/90 transition">
            <TrendingUp className="w-5 h-5" />
            <span>Best Selling</span>
          </Link>
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2 shadow-sm">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <input
              type="month"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards - Only Delivered Orders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Truck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Delivered Orders</p>
          <p className="text-3xl font-bold text-emerald-700">{totals.deliveredOrders}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-green-700">৳ {totals.deliveredRevenue?.toLocaleString()}</p>
        </div>

        {/* <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <ChartNoAxesCombined className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Total Profit</p>
          <p className="text-3xl font-bold text-teal-700">৳ {totals.totalProfit?.toLocaleString()}</p>
        </div> */}

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-purple-700">৳ {avgOrderValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Daily Sales Table */}
      <div className="overflow-x-auto bg-white rounded-xl border border-border shadow-sm">
        <div className="p-4 border-b border-border bg-gradient-to-r from-[#1E556E]/5 to-transparent">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1E556E]" />
            Daily Sales Breakdown
          </h2>
          <p className="text-sm text-muted-foreground">Delivered orders for {monthYear}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#1E556E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground border-b border-border uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Date</th>
                <th className="px-6 py-4 text-left font-bold">Delivered</th>
                <th className="px-6 py-4 text-left font-bold text-green-700">Sales</th>
                {/* <th className="px-6 py-4 text-left font-bold text-teal-700">Profit</th> */}
                <th className="px-6 py-4 text-left font-bold hidden md:table-cell">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.filter(day => day.deliveredOrders > 0).map((day, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">
                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      {day.deliveredOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-700">
                    ৳ {day.deliveredRevenue?.toLocaleString()}
                  </td>
                  {/* <td className="px-6 py-4">
                    <span className={`font-bold ${day.profit > 0 ? 'text-teal-700' : 'text-red-500'}`}>
                      ৳ {day.profit?.toLocaleString()}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 hidden md:table-cell">{day.totalItems}</td>
                </tr>
              ))}
            </tbody>
            {sales.filter(day => day.deliveredOrders > 0).length > 0 && (
              <tfoot className="bg-muted/50 border-t-2 border-border font-bold">
                <tr>
                  <td className="px-6 py-4 text-[#1E556E]">TOTAL</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      {totals.deliveredOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-green-700">৳ {totals.deliveredRevenue?.toLocaleString()}</td>
                  {/* <td className="px-6 py-4 text-teal-700">৳ {totals.totalProfit?.toLocaleString()}</td> */}
                  <td className="px-6 py-4 hidden md:table-cell">{totals.totalItems}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      {!loading && sales.filter(day => day.deliveredOrders > 0).length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-border">
          <Truck className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-semibold">No delivered orders for this month</p>
          <p className="text-sm text-muted-foreground mt-1">Try selecting a different month</p>
        </div>
      )}
    </div>
  )
}
