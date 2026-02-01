// "use client"

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts"
// import { useEffect, useState } from "react"

// const monthNames = [
//   "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// ]

// export default function MonthlyOrdersChart() {
//   const [data, setData] = useState([])

//   useEffect(() => {
//     fetch("/api/orders/monthly")
//       .then((res) => res.json())
//       .then((data) => {
//         const formatted = data.map((item) => ({
//           name: `${monthNames[item.month]} ${item.year}`,
//           orders: item.totalOrders,
//           revenue: item.totalRevenue,
//         }))
//         setData(formatted)
//       })
//   }, [])



//   console.log("data",data)
//   return (
//     <div className="bg-white rounded-xl p-5 shadow-sm">
//       <h3 className="text-lg font-semibold mb-4">
//         Monthly Orders Overview
//       </h3>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data}>
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="orders" radius={[6, 6, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }
