"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, TrendingUp, AlertTriangle, DollarSign, ChartNoAxesCombined } from "lucide-react"
import DailyOrdersChart from "@/components/Dashboard/Report/DailyOrdersChart"
import MonthlyOrdersCompareChart from "@/components/Dashboard/Report/MonthlyOrdersCompareChart"
import { BASE_URL } from "@/utils/baseUrl"
import WebOrderReportChart from "@/components/Dashboard/Report/WebOrderReportChart"



export default function AdminDashboard() {
  const API_URL = BASE_URL;
  const now = new Date()
  const [filter, setFilter] = useState("all")
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    profit: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    statusDistribution: [],
    sourceDistribution: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        let url = `${API_URL}/api/admin/stats?filter=${filter}`
        if (filter === "month") {
          url += `&month=${month}&year=${year}`
        }
        const res = await fetch(url)
        const data = await res.json()

        if (res.ok) {
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [filter, month, year])

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-indigo-100 text-indigo-600",
      cardStyle: "border border-indigo-200 bg-white"
    },
    {
      label: "Total Sales",
      value: `৳${stats?.totalRevenue?.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
      cardStyle: "border border-green-200 bg-white"
    },
    {
      label: "Profit",
      value: `৳${stats?.profit?.toLocaleString()}`,
      icon: ChartNoAxesCombined,
      color: "bg-emerald-100 text-emerald-600",
      cardStyle: "border border-emerald-200 bg-white"
    },
    {
      label: "Pending Web Orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "bg-amber-100 text-amber-600",
      cardStyle: "border border-amber-200 bg-white"
    },
    {
      label: "Low Stock Items",
      value: stats?.lowStockItems,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      cardStyle: "border border-red-200 bg-white"
    },
  ]



  return (
    <div className="bg-gray-50/50 min-h-screen p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Main Dashboard</h1>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-600 flex items-center gap-2">
          <Package className="w-4 h-4 text-teal-600" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>


      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards?.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className={`rounded-2xl ${card.cardStyle} p-6 shadow-sm hover:shadow-md transition-shadow group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {/* <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                      <span>↑</span>
                      <span>{(Math.random() * 20 + 5).toFixed(1)}%</span>
                    </div> */}
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <WebOrderReportChart
            title={"Order Report"}
            data={stats?.statusDistribution}
            totalOrders={stats?.totalOrders}
            currentFilter={filter}
            currentMonth={month}
            currentYear={year}
            onFilterChange={setFilter}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />

          <WebOrderReportChart
            title={"Order Source"}
            data={stats.sourceDistribution}
            totalOrders={stats?.totalOrders}
            currentFilter={filter}
            currentMonth={month}
            currentYear={year}
            onFilterChange={setFilter}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <DailyOrdersChart />
          <MonthlyOrdersCompareChart />
        </div>
      </div>

    </div>
  )
}
