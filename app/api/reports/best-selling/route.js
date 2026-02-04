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

        // 1. Define order match criteria (Strictly delivered)
        let orderMatch = {
            status: "delivered"
        }
        if (startDate || endDate) {
            orderMatch.createdAt = {}
            if (startDate) orderMatch.createdAt.$gte = new Date(startDate)
            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                orderMatch.createdAt.$lte = end
            }
        }

        // 2. Aggregate sales data from orders
        const salesAggregation = await db.collection("orders").aggregate([
            { $match: orderMatch },
            {
                $project: {
                    allSoldItems: {
                        $concatArrays: [
                            { $ifNull: ["$items", []] },
                            { $ifNull: ["$products", []] }
                        ]
                    }
                }
            },
            { $unwind: "$allSoldItems" },
            {
                $group: {
                    _id: "$allSoldItems.productId",
                    totalSold: { $sum: { $ifNull: ["$allSoldItems.quantity", 1] } },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$allSoldItems.quantity", 1] },
                                { $convert: { input: { $ifNull: ["$allSoldItems.price", 0] }, to: "double", onError: 0, onNull: 0 } }
                            ]
                        }
                    },
                    // We sum the purchase price at the time of order if available
                    totalCost: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ["$allSoldItems.quantity", 1] },
                                { $convert: { input: { $ifNull: ["$allSoldItems.purchasePrice", 0] }, to: "double", onError: 0, onNull: 0 } }
                            ]
                        }
                    }
                }
            }
        ]).toArray()

        // Create a fast-lookup map for sales data
        const salesMap = {}
        salesAggregation.forEach(s => {
            if (s._id) salesMap[s._id.toString()] = s
        })

        // 3. Get all catalog products (to include 0-sale items)
        const allProducts = await db.collection("products")
            .find({ isTrashed: { $ne: true } })
            .project({ name: 1, featuredImage: 1, image: 1, purchasePrice: 1, designName: 1 })
            .toArray()

        // 4. Merge and calculate final metrics
        const report = allProducts.map(product => {
            const stats = salesMap[product._id.toString()] || { totalSold: 0, totalRevenue: 0, totalCost: 0 }

            const totalSold = stats.totalSold
            const totalRevenue = stats.totalRevenue

            // If order cost is 0, use current catalog purchase price as fallback
            let totalCost = stats.totalCost
            if (totalCost === 0 && totalSold > 0) {
                totalCost = totalSold * parseFloat(product.purchasePrice || 0)
            }

            const totalProfit = totalRevenue - totalCost

            return {
                _id: product._id,
                name: product.name,
                designName: product.designName,
                image: product.featuredImage || product.image,
                totalSold,
                totalRevenue,
                totalProfit
            }
        })

        // 5. Sort by Quantity Sold (Descending)
        report.sort((a, b) => b.totalSold - a.totalSold)

        // Trim to requested limit (default 100)
        const finalReport = report.slice(0, limit)

        return NextResponse.json({ report: finalReport })
    } catch (error) {
        console.error("GET /api/reports/best-selling error:", error)
        return NextResponse.json({ error: "Failed to fetch best selling report" }, { status: 500 })
    }
}
