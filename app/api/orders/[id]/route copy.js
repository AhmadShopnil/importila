// import { connectToDatabase } from "@/lib/mongodb"
// import { ObjectId } from "mongodb"
// import { NextResponse } from "next/server"

// export async function PUT(request, { params }) {
//   try {
//     const body = await request.json()
//     const { db } = await connectToDatabase()

//     const result = await db.collection("orders").updateOne(
//       { _id: new ObjectId(params.id) },
//       {
//         $set: {
//           ...body,
//           updatedAt: new Date(),
//         },
//       },
//     )

//     if (result.matchedCount === 0) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 })
//     }

//     return NextResponse.json({ message: "Order updated successfully" })
//   } catch (error) {
//     console.error("PUT /api/orders/[id] error:", error)
//     return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
//   }
// }
