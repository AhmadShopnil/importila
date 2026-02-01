"use client"

import { useEffect, useMemo, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { BASE_URL } from "@/utils/baseUrl"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const COLORS = [
  "#6366f1", // total orders
  "#10b981", // delivered orders
  "#f97316", // undelivered orders
  "#059669", // delivered revenue
  "#a855f7"  // undelivered revenue
]

export default function MonthlyOrdersComparePieChart() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${BASE_URL}/api/orders/daily-by-month?month=${month}&year=${year}`)
      .then(res => res.ok ? res.json() : [])
      .then(setData)
      .catch(() => setData([]))
  }, [month, year])

  /** 🔢 Aggregate monthly totals */
  const pieData = useMemo(() => {
    const totals = data.reduce(
      (acc, cur) => {
        acc.orders += cur.orders || 0
        acc.deliveredOrders += cur.deliveredOrders || 0
        acc.revenue += cur.revenue || 0
        acc.deliveredRevenue += cur.deliveredRevenue || 0
        return acc
      },
      {
        orders: 0,
        deliveredOrders: 0,
        revenue: 0,
        deliveredRevenue: 0
      }
    )

    return [
      { name: "Total Orders", value: totals.orders },
      { name: "Delivered Orders", value: totals.deliveredOrders },
      { name: "Undelivered Orders", value: totals.orders - totals.deliveredOrders },
      { name: "Delivered Revenue (৳)", value: totals.deliveredRevenue },
      { name: "Undelivered Revenue (৳)", value: totals.revenue - totals.deliveredRevenue }
    ].filter(item => item.value > 0)
  }, [data])

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold">
          Monthly Orders & Revenue Breakdown
        </h3>

        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {[2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
