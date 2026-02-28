import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    let query = { productType: { $ne: "combo" } }

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ]
    }

    const orders = await db.collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const totalCount = await db.collection("orders").countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit)

    // Calculate total statistics for the matching query
    const stats = await db.collection("orders").aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: ["$totalAmount", { $ifNull: ["$totalPrice", { $ifNull: ["$offerPrice", { $ifNull: ["$price", 0] }] }] }]
            }
          },
          totalItems: {
            $sum: { $size: { $ifNull: ["$items", []] } }
          }
        }
      }
    ]).toArray()

    const summary = stats[0] || { totalRevenue: 0, totalItems: 0 }

    return NextResponse.json({
      orders,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      },
      summary
    })
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}



export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.customerName || !body.address || !body.phone || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check and update stock for each item
    const bulkUpdates = []
    for (const item of body.items) {
      const product = await db.collection("products").findOne({ _id: new ObjectId(item.productId) })
      if (!product) return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 })

      const variantIndex = product.variants.findIndex(v => v.sku === item.sku)
      if (variantIndex === -1) return NextResponse.json({ error: `Variant not found: ${item.sku}` }, { status: 404 })

      const variant = product.variants[variantIndex]
      if (variant.stock < item.quantity) return NextResponse.json({ error: `Not enough stock for ${item.name} (${item.sku})` }, { status: 400 })

      bulkUpdates.push({
        updateOne: {
          filter: { _id: product._id, "variants.sku": item.sku },
          update: { $inc: { "variants.$.stock": -item.quantity } },
        },
      })
    }

    if (bulkUpdates.length > 0) {
      await db.collection("products").bulkWrite(bulkUpdates)
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    const result = await db.collection("orders").insertOne({
      ...body,
      orderNumber,
      status: body.status || "pending",
      paymentStatus: body.paymentStatus || "unpaid",
      orderSource: body.orderSource || "website",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Update daily sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await db.collection("daily_sales").updateOne(
      { date: today },
      {
        $inc: {
          totalRevenue: body.totalAmount || body.totalPrice || 0,
          totalOrders: 1,
          totalItems: body.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ _id: result.insertedId, orderNumber, ...body }, { status: 201 })
  } catch (error) {
    console.error("POST /api/orders error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function DELETE(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { ids } = await request.json()
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid or missing order IDs" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("orders").deleteMany({
      _id: { $in: ids.map(id => new ObjectId(id)) }
    })

    return NextResponse.json({
      message: `${result.deletedCount} orders deleted successfully`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error("DELETE /api/orders error:", error)
    return NextResponse.json({ error: "Failed to delete orders" }, { status: 500 })
  }
}
