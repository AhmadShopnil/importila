// import { connectToDatabase } from "@/lib/mongodb"
// import { NextResponse } from "next/server"

// export async function GET() {
//   try {
//     const { db } = await connectToDatabase()

//     const data = await db.collection("orders").aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" }
//           },
//           totalOrders: { $sum: 1 },
//           totalRevenue: { $sum: "$totalPrice" }
//         }
//       },
//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1
//         }
//       }
//     ]).toArray()

//     const formatted = data.map(item => ({
//       month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
//       orders: item.totalOrders,
//       revenue: item.totalRevenue
//     }))

//     return NextResponse.json(formatted)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
//   }
// }
