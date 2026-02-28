"use client"

import { useState } from "react"
import { Package, ShoppingCart, TrendingUp, AlertTriangle, DollarSign, ChartNoAxesCombined } from "lucide-react"
import DailyOrdersChart from "@/components/Dashboard/Report/DailyOrdersChart"
import MonthlyOrdersCompareChart from "@/components/Dashboard/Report/MonthlyOrdersCompareChart"
import WebOrderReportChart from "@/components/Dashboard/Report/WebOrderReportChart"



import { useGetDashboardStatsQuery } from "@/lib/redux/api/dashboardApi"
import DashboardSkeleton from "@/components/Dashboard/DashboardSkeleton"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const YEARS = [2024, 2025, 2026]

export default function AdminDashboard() {
  const [filter, setFilter] = useState("all")
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const { data: stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    profit: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    statusDistribution: [],
    sourceDistribution: []
  }, isLoading: loading } = useGetDashboardStatsQuery({ filter, month, year })


  if (loading) {
    return <DashboardSkeleton />
  }



  const statCards = [
    {
      label: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: ShoppingCart,
      color: "bg-indigo-100 text-indigo-600",
      cardStyle: "border border-indigo-200 bg-white"
    },
    {
      label: "Total Sales",
      value: `৳${stats?.totalSales
        ?.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
      cardStyle: "border border-green-200 bg-white"
    },
    {
      label: "Total Shipping Spent",
      value: `৳${stats?.totalShippingSpent
        ?.toLocaleString()}`,
      icon: ChartNoAxesCombined,
      color: "bg-emerald-100 text-emerald-600",
      cardStyle: "border border-emerald-200 bg-white"
    },
    {
      label: "Net Sales",
      value: `৳${stats?.netSales?.toLocaleString()}`,
      icon: ChartNoAxesCombined,
      color: "bg-emerald-100 text-emerald-600",
      cardStyle: "border border-emerald-200 bg-white"
    },
    // {
    //   label: "Total Discount given",
    //   value: `৳${stats?.totalDiscount
    //     ?.toLocaleString()}`,
    //   icon: ChartNoAxesCombined,
    //   color: "bg-emerald-100 text-emerald-600",
    //   cardStyle: "border border-emerald-200 bg-white"
    // },

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


  // console.log("stats", stats)

  return (
    <div className="bg-gray-50/50 min-h-screen  ">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Main Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Overview of your store's performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300">
          {/* Main Filter Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-xl">
            {[
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "7d", label: "7D" },
              { id: "30d", label: "30D" },
              { id: "all", label: "All Time" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${filter === tab.id
                  ? "bg-teal-600 text-white shadow-md transform scale-105"
                  : "text-gray-500 hover:text-teal-600 hover:bg-teal-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-gray-200 hidden md:block mx-1"></div>

          {/* Month/Year Selection */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("month")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${filter === "month"
                ? "bg-teal-600 text-white shadow-md transform scale-105"
                : "bg-gray-50 text-gray-500 hover:text-teal-600 hover:bg-teal-50"
                }`}
            >
              Month View
            </button>

            {filter === "month" && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(Number(e.target.value))
                    setFilter("month")
                  }}
                  className="bg-gray-50 border border-gray-100 text-xs font-bold rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-teal-500 cursor-pointer outline-none transition-all"
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(Number(e.target.value))
                    setFilter("month")
                  }}
                  className="bg-gray-50 border border-gray-100 text-xs font-bold rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-teal-500 cursor-pointer outline-none transition-all"
                >
                  {YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            totalOrders={stats?.deliveredOrders}
            currentFilter={filter}
            currentMonth={month}
            currentYear={year}
            onFilterChange={setFilter}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <DailyOrdersChart month={month} year={year} />
          <MonthlyOrdersCompareChart month={month} year={year} />
        </div>
      </div>

    </div>
  )
}
