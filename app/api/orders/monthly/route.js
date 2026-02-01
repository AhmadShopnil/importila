import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET() {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { db } = await connectToDatabase()

    const now = new Date()

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    )

    const data = await db.collection("orders").aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          orders: { $sum: 1 },
          revenue: { $sum: { $ifNull: ["$totalPrice", "$offerPrice", "$price", 0] } },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
          },
          deliveredRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "delivered"] },
                { $ifNull: ["$totalPrice", "$offerPrice", "$price", 0] },
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray()

    // 🔑 Fill missing days with zero
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate()

    const result = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const found = data.find(d => d._id === day)

      return {
        day,
        orders: found?.orders || 0,
        revenue: found?.revenue || 0,
        deliveredOrders: found?.deliveredOrders || 0,
        deliveredRevenue: found?.deliveredRevenue || 0
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to load daily stats" },
      { status: 500 }
    )
  }
}
