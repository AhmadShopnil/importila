import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")
        const limit = parseInt(searchParams.get("limit") || "50")

        const { db } = await connectToDatabase()

        let matchQuery = {
            status: { $regex: /delivered|complete/i }
        }

        if (startDate || endDate) {
            matchQuery.createdAt = {}
            if (startDate) matchQuery.createdAt.$gte = new Date(startDate)
            if (endDate) matchQuery.createdAt.$lte = new Date(endDate)
        }

        const report = await db.collection("orders").aggregate([
            { $match: matchQuery },
            {
                $project: {
                    mergedItems: {
                        $concatArrays: [
                            { $ifNull: ["$items", []] },
                            { $ifNull: ["$products", []] }
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
                    _id: "$mergedItems.productId",
                    name: { $first: "$mergedItems.name" },
                    image: { $first: { $ifNull: ["$mergedItems.image", "$mergedItems.featuredImage"] } },
                    totalSold: { $sum: { $ifNull: ["$mergedItems.quantity", 1] } },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$mergedItems.quantity", 1] },
                                { $convert: { input: { $ifNull: ["$mergedItems.price", 0] }, to: "double", onError: 0, onNull: 0 } }
                            ]
                        }
                    },
                    totalPurchasePrice: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$mergedItems.quantity", 1] },
                                { $convert: { input: { $ifNull: ["$productData.purchasePrice", "$mergedItems.purchasePrice", 0] }, to: "double", onError: 0, onNull: 0 } }
                            ]
                        }
                    }
                }
            },
            {
                $addFields: {
                    totalProfit: { $subtract: ["$totalRevenue", "$totalPurchasePrice"] }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit }
        ]).toArray()

        return NextResponse.json({ report })
    } catch (error) {
        console.error("GET /api/reports/best-selling error:", error)
        return NextResponse.json({ error: "Failed to fetch best selling report" }, { status: 500 })
    }
}
