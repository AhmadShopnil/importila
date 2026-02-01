import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { ObjectId } from "mongodb"
import { getAdminAuth } from "@/lib/auth"

/* ================= GET ================= */
export async function GET(request, context) {
  try {
    const { id } = await context.params
    const { db } = await connectToDatabase()

    const combo = await db.collection("combos").findOne({
      _id: new ObjectId(id),
    })

    if (!combo) {
      return NextResponse.json({ error: "Combo not found" }, { status: 404 })
    }
    return NextResponse.json(combo)
  } catch (error) {
    console.error("GET /api/combos/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch combo" }, { status: 500 })
  }
}

/* ================= PUT ================= */
export async function PUT(request, context) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await context.params
    const formData = await request.formData()

    const title = formData.get("title")
    const description = formData.get("description")
    const price = Number(formData.get("price"))
    const offerPrice = Number(formData.get("offerPrice"))
    const sizes = JSON.parse(formData.get("sizes") || "[]")
    const products = JSON.parse(formData.get("products") || "[]")

    const featuredImageFile = formData.get("featuredImage")
    let featuredImage = formData.get("existingFeaturedImage") || null

    if (featuredImageFile && featuredImageFile.size > 0) {
      featuredImage = await uploadToCloudinary(featuredImageFile, "products/featured")
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("combos").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          price,
          offerPrice,
          sizes,
          products,
          featuredImage,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Combo not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT /api/combos/[id] error:", error)
    return NextResponse.json({ error: "Failed to update combo" }, { status: 500 })
  }
}

/* ================= DELETE ================= */
export async function DELETE(request, context) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await context.params
    const { db } = await connectToDatabase()

    const result = await db.collection("combos").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Combo not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Combo deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/combos/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete combo" }, { status: 500 })
  }
}
