import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const month = Number(searchParams.get("month")) // 1-12
    const year = Number(searchParams.get("year"))

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    const rawData = await db.collection("orders").aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lt: end
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

    const daysInMonth = new Date(year, month, 0).getDate()

    const data = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const found = rawData.find(d => d._id === day)

      return {
        day,
        orders: found?.orders || 0,
        revenue: found?.revenue || 0,
        deliveredOrders: found?.deliveredOrders || 0,
        deliveredRevenue: found?.deliveredRevenue || 0
      }
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch monthly data" },
      { status: 500 }
    )
  }
}
