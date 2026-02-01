import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection("categories").find({}).sort({ order: 1 }).toArray()

    // Build hierarchical structure
    const categoryMap = {}
    const rootCategories = []

    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = { ...cat, children: [] }
    })

    categories.forEach(cat => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat._id.toString()])
      } else {
        rootCategories.push(categoryMap[cat._id.toString()])
      }
    })

    return NextResponse.json(rootCategories)
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Generate slug from name
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const result = await db.collection("categories").insertOne({
      name: body.name,
      slug,
      description: body.description || "",
      image: body.image || "",
      parentId: body.parentId || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ _id: result.insertedId, ...body, slug }, { status: 201 })
  } catch (error) {
    console.error("POST /api/categories error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
