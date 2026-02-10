import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") // Format: YYYY-MM

    const { db } = await connectToDatabase()

    // Build date match query
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

    // Get all delivered orders for this month
    const deliveredOrders = await db.collection("orders").find({
      ...matchQuery,
      status: { $regex: /^delivered$/i }
    }).toArray()

    // Get all products for purchase price lookup (cache them)
    const allProducts = await db.collection("products").find({}).toArray()
    const productMap = {}
    allProducts.forEach(p => {
      productMap[p._id.toString()] = p
    })

    // Group by date and calculate daily stats
    const dailyStats = {}
    let grandTotalGross = 0
    let grandTotalShipping = 0
    let grandTotalItems = 0
    let grandTotalCost = 0

    for (const order of deliveredOrders) {
      const date = new Date(order.createdAt).toISOString().split('T')[0]

      const grossSales = Number(order.totalAmount) || Number(order.totalPrice) || 0
      const shippingCharge = Number(order.shippingCharge) || 0
      const netSales = grossSales - shippingCharge

      const items = order.items || []
      let orderItemsCount = 0
      let orderCost = 0

      for (const item of items) {
        const qty = Number(item.quantity) || 1
        orderItemsCount += qty

        // Look up product purchase price
        if (item.productId) {
          const product = productMap[item.productId]
          if (product) {
            const pCost = Number(product.purchasePrice) || 0
            orderCost += pCost * qty
          }
        }
      }

      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          deliveredOrders: 0,
          grossSales: 0,
          shippingCharge: 0,
          netSales: 0,
          totalItems: 0,
          totalCost: 0
        }
      }

      dailyStats[date].deliveredOrders++
      dailyStats[date].grossSales += grossSales
      dailyStats[date].shippingCharge += shippingCharge
      dailyStats[date].netSales += netSales
      dailyStats[date].totalItems += orderItemsCount
      dailyStats[date].totalCost += orderCost

      grandTotalGross += grossSales
      grandTotalShipping += shippingCharge
      grandTotalItems += orderItemsCount
      grandTotalCost += orderCost
    }

    // Convert to array and add profit
    const sales = Object.values(dailyStats)
      .map(day => ({
        ...day,
        deliveredRevenue: day.grossSales, // Maintain backward compatibility for existing UI
        netRevenue: day.netSales,
        profit: day.netSales - day.totalCost
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate totals
    const totals = {
      deliveredOrders: deliveredOrders.length,
      totalGross: grandTotalGross,
      totalShipping: grandTotalShipping,
      totalNet: grandTotalGross - grandTotalShipping,
      deliveredRevenue: grandTotalGross, // For backward compatibility
      netRevenue: grandTotalGross - grandTotalShipping,
      totalProfit: (grandTotalGross - grandTotalShipping) - grandTotalCost,
      totalItems: grandTotalItems
    }

    return NextResponse.json({
      sales,
      totals,
      month
    })
  } catch (error) {
    console.error("GET /api/reports/sales error:", error)
    return NextResponse.json({ error: "Failed to fetch sales report", details: error.message }, { status: 500 })
  }
}
