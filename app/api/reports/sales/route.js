import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") // Format: YYYY-MM

    const { db } = await connectToDatabase()

    // Aggregate orders day by day for the specified month
    let matchQuery = {}
    if (month) {
      const startDate = new Date(`${month}-01`)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
      endDate.setHours(23, 59, 59, 999)

      matchQuery = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }
    }

    const sales = await db.collection("orders").aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          date: { $first: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
          totalRevenue: { $sum: { $ifNull: ["$totalPrice", "$offerPrice", "$price", 0] } },
          totalOrders: { $sum: 1 },
          totalItems: {
            $sum: {
              $cond: [
                { $isArray: "$items" },
                { $sum: "$items.quantity" },
                1
              ]
            }
          },
          deliveredRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "delivered"] },
                { $ifNull: ["$totalPrice", "$offerPrice", "$price", 0] },
                0
              ]
            }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    return NextResponse.json({ sales, month })
  } catch (error) {
    console.error("GET /api/reports/sales error:", error)
    return NextResponse.json({ error: "Failed to fetch sales report" }, { status: 500 })
  }
}
