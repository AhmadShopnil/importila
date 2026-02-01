import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function PUT(request, context) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    // const params = await context.params
    const { id } = await context.params
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Generate slug if name is being updated
    const updateData = {
      ...body,
      updatedAt: new Date()
    }

    if (body.name && !body.slug) {
      updateData.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    }

    const result = await db
      .collection("categories")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category updated" })
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    // const params = await context.params
    const { id } = await context.params
    const { db } = await connectToDatabase()

    const result = await db.collection("categories").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category deleted" })
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
