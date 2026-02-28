import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET(request) {
    const admin = await getAdminAuth()
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const filter = searchParams.get("filter") || "all"
        const month = parseInt(searchParams.get("month"))
        const year = parseInt(searchParams.get("year"))

        const { db } = await connectToDatabase()

        /* -------------------- Date Filter -------------------- */
        const now = new Date()
        let dateQuery = {}

        if (filter === "today") {
            dateQuery = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                },
            }
        } else if (filter === "yesterday") {
            dateQuery = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
                    $lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999),
                },
            }
        } else if (filter === "7d") {
            const start = new Date()
            start.setDate(now.getDate() - 7)
            dateQuery = { createdAt: { $gte: start } }
        } else if (filter === "30d") {
            const start = new Date()
            start.setDate(now.getDate() - 30)
            dateQuery = { createdAt: { $gte: start } }
        } else if (filter === "month" && month && year) {
            dateQuery = {
                createdAt: {
                    $gte: new Date(year, month - 1, 1),
                    $lte: new Date(year, month, 0, 23, 59, 59, 999),
                },
            }
        }

        /* -------------------- Aggregation -------------------- */
        const stats = await db.collection("orders").aggregate([
            { $match: dateQuery },

            {
                $facet: {
                    /* ---- Order Summary ---- */
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                pendingOrders: {
                                    $sum: {
                                        $cond: [{ $regexMatch: { input: "$status", regex: /pending/i } }, 1, 0],
                                    },
                                },
                                deliveredOrders: {
                                    $sum: {
                                        $cond: [{ $in: ["$status", ["delivered", "complete"]] }, 1, 0],
                                    },
                                },
                            },
                        },
                    ],

                    /* ---- Financials (Delivered Only) ---- */
                    financials: [
                        { $match: { status: { $in: ["delivered", "complete"] } } },
                        {
                            $group: {
                                _id: null,
                                totalSales: { $sum: "$totalAmount" },
                                totalDiscount: { $sum: "$discount" },
                                totalShippingSpent: { $sum: "$shippingCharge" },
                            },
                        },
                    ],

                    /* ---- Status Distribution ---- */
                    statusDistribution: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    /* ---- Source Distribution (Delivered Only) ---- */
                    sourceDistribution: [
                        { $match: { status: { $in: ["delivered", "complete"] } } },
                        {
                            $group: {
                                _id: "$orderSource",
                                count: { $sum: 1 },
                            },
                        },
                    ],
                },
            },
        ]).toArray()

        const summary = stats[0].summary[0] || {}
        const financials = stats[0].financials[0] || {}

        /* -------------------- Extra Stats -------------------- */
        const totalProducts = await db.collection("products").countDocuments()
        const lowStockItems = await db.collection("products").countDocuments({
            "variants.stock": { $lt: 10 },
        })

        const totalSales = financials.totalSales || 0
        const totalDiscount = financials.totalDiscount || 0
        const totalShippingSpent = financials.totalShippingSpent || 0

        const netSales = totalSales - totalShippingSpent

        return NextResponse.json({
            totalProducts,
            totalOrders: summary.totalOrders || 0,
            pendingOrders: summary.pendingOrders || 0,
            deliveredOrders: summary.deliveredOrders || 0,

            totalSales: totalSales || 0,
            totalDiscount: totalDiscount || 0,
            totalShippingSpent: totalShippingSpent || 0,
            netSales: netSales || 0,

            lowStockItems,
            statusDistribution: stats[0].statusDistribution,
            sourceDistribution: stats[0].sourceDistribution,
        })
    } catch (error) {
        console.error("GET /api/admin/stats error:", error)
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}
