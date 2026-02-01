"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Truck } from "lucide-react"
import Loading from "@/components/Loader/Loading"
import { BASE_URL } from "@/utils/baseUrl"

export default function ReportsPage() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    fetchSalesReport()
  }, [monthYear])

  const fetchSalesReport = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/reports/sales?month=${monthYear}`)
      const data = await res.json()
      setSales(data.sales || [])
    } catch (error) {
      console.error("Failed to fetch sales report:", error)
    } finally {
      setLoading(false)
    }
  }


  // if (loading) return <Loading />


  const totalRevenue = sales.reduce((sum, day) => sum + day.totalRevenue, 0)
  const totalOrders = sales.reduce((sum, day) => sum + day.totalOrders, 0)
  const deliveredRevenue = sales.reduce((sum, day) => sum + (day.deliveredRevenue || 0), 0)
  const deliveredOrders = sales.reduce((sum, day) => sum + (day.deliveredOrders || 0), 0)
  const totalItems = sales.reduce((sum, day) => sum + day.totalItems, 0)
  const avgOrderValue = deliveredOrders > 0 ? Math.round(deliveredRevenue / deliveredOrders) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E556E]">Sales Reports</h1>
        <div className="flex items-center gap-2">
          {/* <Link href="/admin/reports/courier" className="flex items-center gap-2 bg-[#1E556E] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#1E556E]/90 transition">
            <Truck className="w-5 h-5" />
            <span className="hidden sm:inline">Courier Reports</span>
          </Link> */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Total Orders</p>
          <p className="text-2xl sm:text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Delivered Orders</p>
          <p className="text-2xl sm:text-3xl font-bold">{deliveredOrders}</p>
        </div>

        <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Gross Revenue</p>
          <p className="text-2xl sm:text-3xl font-bold">৳ {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-green-100 border border-green-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Delivered Revenue</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700">৳ {deliveredRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1">Avg Ticket Size</p>
          <p className="text-2xl sm:text-3xl font-bold">৳ {avgOrderValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Daily Sales Table */}
      <div className="overflow-x-auto bg-white rounded-xl border border-border shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-bold text-lg">Daily Breakdown</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground border-b border-border uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Date</th>
              <th className="px-6 py-4 text-left font-bold">Total Orders</th>
              <th className="px-6 py-4 text-left font-bold">Delivered</th>
              <th className="px-6 py-4 text-left font-bold">Gross Rev.</th>
              <th className="px-6 py-4 text-left font-bold text-green-700">Delivered Rev.</th>
              <th className="px-6 py-4 text-left font-bold hidden md:table-cell">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sales.map((day, idx) => (
              <tr key={idx} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-semibold">{new Date(day.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                <td className="px-6 py-4">{day.totalOrders}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${day.deliveredOrders === day.totalOrders ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {day.deliveredOrders}
                  </span>
                </td>
                <td className="px-6 py-4">৳ {day.totalRevenue.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-green-700">৳ {day.deliveredRevenue?.toLocaleString()}</td>
                <td className="px-6 py-4 hidden md:table-cell">{day.totalItems}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sales.length === 0 && <div className="text-center py-8 text-muted-foreground">No sales data for this month</div>}
    </div>
  )
}
