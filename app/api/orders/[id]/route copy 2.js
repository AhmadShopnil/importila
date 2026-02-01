import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function PUT(request, { params }) {
  try {
    // ✅ Await the params
    const { id } = params
    console.log("id", id)
    if (!id) return NextResponse.json({ error: "Missing order ID" }, { status: 400 })

    const body = await request.json()
    const { db } = await connectToDatabase()

    // Only allow updating specific fields
    const allowedFields = ["status", "paymentStatus"]
    const updateData = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    updateData.updatedAt = new Date()

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order updated successfully" })
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
