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

export default function MonthlyOrdersChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${BASE_URL}/api/orders/monthly`)
      .then(res => res.json())
      .then(setData)
  }, [])

//   console.log("data",data)

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Orders
      </h3>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
