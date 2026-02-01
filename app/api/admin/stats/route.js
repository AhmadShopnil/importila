import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    const month = parseInt(searchParams.get("month"))
    const year = parseInt(searchParams.get("year"))

    try {
        const { db } = await connectToDatabase()

        // 1. Build Date Query
        let dateQuery = {}
        const now = new Date()

        if (filter === "today") {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            dateQuery = { createdAt: { $gte: start } }
        } else if (filter === "yesterday") {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999)
            dateQuery = { createdAt: { $gte: start, $lte: end } }
        } else if (filter === "30d") {
            const start = new Date()
            start.setDate(now.getDate() - 30)
            dateQuery = { createdAt: { $gte: start } }
        } else if (month && year) {
            const start = new Date(year, month - 1, 1)
            const end = new Date(year, month, 0, 23, 59, 59, 999)
            dateQuery = { createdAt: { $gte: start, $lte: end } }
        }

        // 2. Total Products Count (Always all time or based on your preference? Usually all time)
        const totalProducts = await db.collection("products").countDocuments()

        // 3. Orders Stats
        const orderStats = await db.collection("orders").aggregate([
            { $match: dateQuery },
            {
                $facet: {
                    totals: [
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ],
                    pending: [
                        { $match: { status: { $regex: /pending/i } } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ],
                    deliveredItems: [
                        { $match: { status: { $regex: /delivered|complete/i } } },
                        {
                            $project: {
                                mergedItems: {
                                    $concatArrays: [
                                        { $ifNull: ["$items", []] },
                                        { $ifNull: ["$products", []] }
                                    ]
                                },
                                orderPrice: { $ifNull: ["$totalPrice", "$offerPrice", "$price", 0] }
                            }
                        },
                        {
                            $addFields: {
                                // If mergedItems is empty, create a dummy item to allow calculating from order-level price
                                mergedItems: {
                                    $cond: [
                                        { $gt: [{ $size: "$mergedItems" }, 0] },
                                        "$mergedItems",
                                        [{ isOrderFallback: true }]
                                    ]
                                }
                            }
                        },
                        { $unwind: "$mergedItems" },
                        {
                            $addFields: {
                                "mergedItems.productIdObj": {
                                    $cond: [
                                        {
                                            $and: [
                                                { $ne: ["$mergedItems.productId", null] },
                                                { $eq: [{ $type: "$mergedItems.productId" }, "string"] },
                                                { $ne: ["$mergedItems.productId", ""] }
                                            ]
                                        },
                                        { $toObjectId: "$mergedItems.productId" },
                                        "$mergedItems.productId"
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "products",
                                localField: "mergedItems.productIdObj",
                                foreignField: "_id",
                                as: "productData"
                            }
                        },
                        { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: {
                                    $sum: {
                                        $multiply: [
                                            { $ifNull: ["$mergedItems.price", "$orderPrice", 0] },
                                            { $ifNull: ["$mergedItems.quantity", 1] }
                                        ]
                                    }
                                },
                                totalPurchasePrice: {
                                    $sum: {
                                        $multiply: [
                                            { $ifNull: ["$productData.purchasePrice", "$mergedItems.purchasePrice", 0] },
                                            { $ifNull: ["$mergedItems.quantity", 1] }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalRevenue: 1,
                                profit: { $subtract: ["$totalRevenue", "$totalPurchasePrice"] }
                            }
                        }
                    ],
                    deliveredOrders: [
                        { $match: { status: { $regex: /delivered|complete/i } } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ],
                    statusDistribution: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    sourceDistribution: [
                        { $group: { _id: "$orderSource", count: { $sum: 1 } } }
                    ]
                }
            }
        ]).toArray()

        const facetResults = orderStats[0]
        const totalOrders = facetResults.totals[0]?.count || 0
        const pendingOrders = facetResults.pending[0]?.count || 0
        const deliveredData = facetResults.deliveredItems[0] || { totalRevenue: 0, profit: 0 }
        const deliveredOrdersCount = facetResults.deliveredOrders[0]?.count || 0

        // 4. Low Stock Items (Always global)
        const lowStockCount = await db.collection("products").countDocuments({
            "variants.stock": { $lt: 10 }
        })

        return NextResponse.json({
            totalProducts,
            totalOrders,
            totalRevenue: deliveredData.totalRevenue,
            profit: deliveredData.profit,
            pendingOrders,
            deliveredOrders: deliveredOrdersCount,
            lowStockItems: lowStockCount,
            statusDistribution: facetResults.statusDistribution || [],
            sourceDistribution: facetResults.sourceDistribution || []
        })
    } catch (error) {
        console.error("GET /api/admin/stats error:", error)
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}
