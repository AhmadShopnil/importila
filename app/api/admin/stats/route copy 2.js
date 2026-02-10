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

        // 2. Total Products Count
        const totalProducts = await db.collection("products").countDocuments()

        // 3. Get all orders for the period
        const allOrders = await db.collection("orders").find(dateQuery).toArray()

        // 4. Get all products for purchase price lookup
        const allProducts = await db.collection("products").find({}).toArray()
        const productMap = {}
        allProducts.forEach(p => {
            productMap[p._id.toString()] = p
        })

        // 5. Calculate stats
        let totalOrders = allOrders.length
        let pendingOrders = 0
        let deliveredOrdersCount = 0
        let totalRevenue = 0
        let totalCost = 0

        // Status and source distribution
        const statusCounts = {}
        const sourceCounts = {}

        for (const order of allOrders) {
            const status = (order.status || "unknown").toLowerCase()
            const source = order.orderSource || "unknown"

            // Count by status
            statusCounts[status] = (statusCounts[status] || 0) + 1

            // Check if pending
            if (status.includes("pending")) {
                pendingOrders++
            }

            // Check if delivered
            if (status === "delivered" || status === "complete") {
                deliveredOrdersCount++

                // Count source for delivered orders only
                sourceCounts[source] = (sourceCounts[source] || 0) + 1

                // Calculate revenue from items
                const items = order.items || []

                let orderCost = 0


                totalRevenue += order?.totalAmount || 0;
                totalCost += orderCost

                // for (const item of items) {
                //     const qty = Number(item.quantity) || 1
                //     const price = Number(item.price) || 0
                //     orderRevenue += price * qty

                //     if (item.productId && productMap[item.productId]) {
                //         const pCost = Number(productMap[item.productId].purchasePrice) || 0
                //         orderCost += pCost * qty
                //     }
                // }

                // Fallback for revenue if items were empty
                // if (orderRevenue === 0) {
                //     const total = Number(order.totalAmount) || Number(order.totalPrice) || 0
                //     const shipping = Number(order.shippingCharge) || 0
                //     orderRevenue = Math.max(0, total - shipping)
                // }


                // totalRevenue += orderRevenue
                // totalCost += orderCost
            }
        }

        // Calculate profit
        const profit = totalRevenue - totalCost

        // 6. Low Stock Items
        const lowStockCount = await db.collection("products").countDocuments({
            "variants.stock": { $lt: 10 }
        })

        // Format distributions for charts
        const statusDistribution = Object.entries(statusCounts).map(([_id, count]) => ({ _id, count }))
        const sourceDistribution = Object.entries(sourceCounts).map(([_id, count]) => ({ _id, count }))

        return NextResponse.json({
            totalProducts,
            totalOrders,
            totalRevenue,
            profit,
            pendingOrders,
            deliveredOrders: deliveredOrdersCount,
            lowStockItems: lowStockCount,
            statusDistribution,
            sourceDistribution
        })
    } catch (error) {
        console.error("GET /api/admin/stats error:", error)
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}
