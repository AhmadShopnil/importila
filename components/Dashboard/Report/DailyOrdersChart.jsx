"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { BASE_URL } from "@/utils/baseUrl"

export default function DailyOrdersChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${BASE_URL}/api/orders/monthly`)
      .then(res => res.ok ? res.json() : [])
      .then(setData)
      .catch(() => setData([]))
  }, [])
  // console.log("data", data)

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">
        Current Month Orders & Revenue
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickFormatter={(d) => `${d}`}
            />
            <YAxis />
            <Tooltip />

            {/* Orders */}
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6366f1"
              strokeWidth={2}
              name="Total Orders"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="deliveredOrders"
              stroke="#10b981"
              strokeWidth={3}
              name="Delivered Orders"
            />

            {/* Revenue */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={2}
              name="Gross Revenue (৳)"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="deliveredRevenue"
              stroke="#059669"
              strokeWidth={3}
              name="Delivered Revenue (৳)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
