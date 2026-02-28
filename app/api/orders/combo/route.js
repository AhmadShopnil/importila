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

    let query = { productType: "combo" }

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
              $ifNull: ["$totalPrice", { $ifNull: ["$offerPrice", { $ifNull: ["$price", 0] }] }]
            }
          },
          totalItems: {
            $sum: {
              $add: [
                { $size: { $ifNull: ["$items", []] } },
                { $size: { $ifNull: ["$products", []] } }
              ]
            }
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

    if (!body.customerName || !body.address || !body.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()



    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Update stock for each item
    if (body.items && Array.isArray(body.items)) {
      const bulkUpdates = []
      for (const item of body.items) {
        if (!item.productId) continue

        const product = await db.collection("products").findOne({ _id: new ObjectId(item.productId) })
        if (!product) {
          // console.error(`Product not found for stock update: ${item.productId}`)
          continue
        }

        // Find the matching variant by color and size
        // Note: For combos, size is global (body.productSize)
        const variantIndex = product.variants?.findIndex(v =>
          v.colorName === item.color && v.size === body.productSize
        )

        if (variantIndex === undefined || variantIndex === -1) {
          // console.error(`Variant not found for product ${item.productId}, color ${item.color}, size ${body.productSize}`)
          continue
        }

        const variant = product.variants[variantIndex]
        if (variant.stock <= 0) {
          // console.warn(`Attempting to order out of stock item: ${item.name} (${item.color}, ${body.productSize})`)
          // We still decrease it to show negative stock, or we could skip. 
          // Given the requirements, we'll decrease it.
        }

        bulkUpdates.push({
          updateOne: {
            filter: {
              _id: new ObjectId(item.productId),
              "variants.colorName": item.color,
              "variants.size": body.productSize
            },
            update: { $inc: { "variants.$.stock": -1 } },
          },
        })
      }

      if (bulkUpdates.length > 0) {
        await db.collection("products").bulkWrite(bulkUpdates)
      }
    }

    const orderFinalData = {
      ...body,
      orderNumber,
      status: body.status || "pending",
      productType: body.productType || "combo",
      paymentStatus: body.paymentStatus || "unpaid",
      orderSource: body.orderSource || "website",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(orderFinalData)

    // Update daily sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await db.collection("daily_sales").updateOne(
      {
        date: today,
        //  productType:"combo",
      },
      {
        $inc: {
          totalRevenue: body?.offerPrice || body?.price,
          totalOrders: 1,

          //   totalItems: body?.products?.length,
          //   totalItems: body?.products?.reduce((sum, item) => sum + item.quantity, 0),
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
