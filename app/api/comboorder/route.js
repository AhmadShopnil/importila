import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    let query = {}
    if (status) {
      query = { status }
    }

    const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    const total = await db.collection("orders").countDocuments(query)

    return NextResponse.json({ orders, total })
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}



export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.customerName || !body.address || !body.note || !body.phone ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check and update stock for each item
    // const bulkUpdates = []
    // for (const item of body.items) {
    //   const product = await db.collection("products").findOne({ _id: new ObjectId(item.productId) })

    //   if (!product) return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 })

    //   const variantIndex = product.variants.findIndex(v => v.sku === item.sku)
    //   if (variantIndex === -1) return NextResponse.json({ error: `Variant not found: ${item.sku}` }, { status: 404 })

    //   const variant = product.variants[variantIndex]
    //   if (variant.stock < item.quantity) return NextResponse.json({ error: `Not enough stock for ${item.name} (${item.sku})` }, { status: 400 })

    //   bulkUpdates.push({
    //     updateOne: {
    //       filter: { _id: product._id, "variants.sku": item.sku },
    //       update: { $inc: { "variants.$.stock": -item.quantity } },
    //     },
    //   })
    // }

    // if (bulkUpdates.length > 0) {
    //   await db.collection("products").bulkWrite(bulkUpdates)
    // }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    const result = await db.collection("orders").insertOne({
      ...body,
      orderNumber,
      status: body.status || "pending",
      productType: body.productType || "combo",
      paymentStatus: body.paymentStatus || "unpaid",
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
          totalRevenue: body.totalPrice,
          totalOrders: 1,
          totalItems: body.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ _id: result.insertedId, orderNumber, ...body }, { status: 201 })
  } catch (error) {
    console.error("POST /api/orders/combo error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
