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

    // console.log("orderFinalData from combo order api route",orderFinalData)

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
