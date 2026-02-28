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

        let query = {}
        if (month) {
            const startDate = new Date(`${month}-01`)
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
            endDate.setHours(23, 59, 59, 999)

            query = {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            }
        }

        // Aggregate orders by orderSource
        const sourceStats = await db.collection("orders").aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $ifNull: ["$orderSource", "website"] },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: { $ifNull: ["$totalAmount", "$totalPrice", 0] } },
                    totalItems: {
                        $sum: {
                            $cond: [
                                { $isArray: "$items" },
                                { $sum: "$items.quantity" },
                                1 // If it's a combo order without items array (some models might differ)
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    source: "$_id",
                    totalOrders: 1,
                    totalRevenue: 1,
                    totalItems: 1,
                    _id: 0
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]).toArray()

        return NextResponse.json({ sourceStats, month })
    } catch (error) {
        console.error("GET /api/reports/sources error:", error)
        return NextResponse.json({ error: "Failed to fetch source report" }, { status: 500 })
    }
}
