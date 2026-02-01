import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function PUT(request, context) {
  try {
   const { id } = await context.params
    const body = await request.json() // { variants: [...] }

    const { db } = await connectToDatabase()

    // Loop through variants in the body and update each in the product
    for (const variant of body.variants) {
      await db.collection("products").updateOne(
        { _id: new ObjectId(id), "variants.sku": variant.sku },
        { $set: { "variants.$.stock": variant.stock } }
      )
    }

    return NextResponse.json({ message: "Stock updated successfully" })
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error)
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 })
  }
}
