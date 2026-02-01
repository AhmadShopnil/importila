// import { connectToDatabase } from "@/lib/mongodb"

// import { NextResponse } from "next/server"

// export async function GET(request) {
//   try {
//     const { db } = await connectToDatabase()
//     const { searchParams } = new URL(request.url)
//     const status = searchParams.get("status")
//     const limit = Number.parseInt(searchParams.get("limit") || "50")
//     const skip = Number.parseInt(searchParams.get("skip") || "0")

//     let query = {}
//     if (status) {
//       query = { status }
//     }

//     const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

//     const total = await db.collection("orders").countDocuments(query)

//     return NextResponse.json({ orders, total })
//   } catch (error) {
//     console.error("GET /api/orders error:", error)
//     return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
//   }
// }

// export async function POST(request) {
//   try {
//     const body = (await request.json())

//     // Validation
//     if (!body.customerName || !body.customerEmail || !body.items || body.items.length === 0) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     const { db } = await connectToDatabase()

//     // Generate order number
//     const orderNumber = `ORD-${Date.now()}`

//     const result = await db.collection("orders").insertOne({
//       ...body,
//       orderNumber,
//       status: body.status || "pending",
//       paymentStatus: body.paymentStatus || "unpaid",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })

//     // Update daily sales
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     await db.collection("daily_sales").updateOne(
//       { date: today },
//       {
//         $inc: {
//           totalRevenue: body.totalPrice,
//           totalOrders: 1,
//           totalItems: body.items.reduce((sum, item) => sum + item.quantity, 0),
//         },
//       },
//       { upsert: true },
//     )

//     return NextResponse.json({ _id: result.insertedId, orderNumber, ...body }, { status: 201 })
//   } catch (error) {
//     console.error("POST /api/orders error:", error)
//     return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
//   }
// }
