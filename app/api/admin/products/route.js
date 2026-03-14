import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

/* ================= GET: ADMIN PRODUCTS ================= */
export async function GET(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    // Filtering
    const categories = searchParams.get("categories")?.split(",") || []
    const minPrice = Number(searchParams.get("minPrice")) || 0
    const maxPrice = Number(searchParams.get("maxPrice")) || Infinity
    const search = searchParams.get("search")
    const isFeatured = searchParams.get("featured") === "true"

    // Pagination
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 100
    const skip = (page - 1) * limit

    // Sorting
    const sortStr = searchParams.get("sort") || "newest" // newest, price-asc, price-desc
    let sortQuery = { createdAt: -1 }
    if (sortStr === "price-asc") sortQuery = { price: 1 }
    if (sortStr === "price-desc") sortQuery = { price: -1 }

    let query = {}

    if (categories.length > 0) {
      query.categories = { $in: categories }
    }

    if (isFeatured) {
      query.isFeatured = true
    }

    // Admins usually shouldn't see trashed items unless on the trash page, 
    // but they absolutely SHOULD see inactive items.
    query.isTrashed = { $ne: true }

    // Price range
    if (minPrice > 0 || maxPrice < Infinity) {
      query.price = { $gte: minPrice, $lte: maxPrice }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    }

    const [products, total] = await Promise.all([
      db.collection("products")
        .find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("products").countDocuments(query)
    ])

    // If page or limit is provided, return the paginated object
    // otherwise return the array directly for backward compatibility
    if (searchParams.has("page") || searchParams.has("limit") || searchParams.has("categories")) {
      return NextResponse.json({
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/admin/products error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        originalError: error
      },
      { status: 500 }
    )
  }
}
