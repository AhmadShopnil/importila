import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { getAdminAuth } from "@/lib/auth"

/* ================= GET ================= */
export async function GET(request) {
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

    query.isActive = { $ne: false }
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
    console.error("GET /api/products error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        originalError: error
      },
      { status: 500 }
    )
  }
}



/* ================= POST ================= */
export async function POST(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await request.formData()

    const name = formData.get("name")
    const description = formData.get("description")
    const richDescription = formData.get("richDescription") || ""
    const categories = JSON.parse(formData.get("categories") || "[]")
    const price = Number(formData.get("price"))
    const offerPrice = Number(formData.get("offerPrice"))
    const isFeatured = formData.get("isFeatured") === "true"
    const isActive = formData.get("isActive") === "true"
    const designName = formData.get("designName") || ""
    const purchasePrice = Number(formData.get("purchasePrice")) || 0
    const variants = JSON.parse(formData.get("variants") || "[]")

    /* ---------- Featured Image ---------- */
    let featuredImage = null
    const featuredFile = formData.get("featuredImage")
    const featuredURL = formData.get("featuredImageURL")

    const { db } = await connectToDatabase()

    if (featuredFile instanceof File && featuredFile.size > 0) {
      const result = await uploadToCloudinary(featuredFile, "products")
      // Save to media collection
      await db.collection("media").insertOne({
        url: result.secure_url,
        publicId: result.public_id,
        folder: "products",
        fileName: featuredFile.name,
        fileSize: featuredFile.size,
        format: result.format,
        width: result.width,
        height: result.height,
        createdAt: new Date(),
      })
      featuredImage = result.secure_url
    } else if (typeof featuredFile === 'string' && featuredFile.startsWith('http')) {
      featuredImage = featuredFile
    } else if (featuredURL) {
      featuredImage = featuredURL
    }

    if (!name || categories.length === 0 || !featuredImage || isNaN(price)) {
      return NextResponse.json(
        { error: "Missing required fields (Name, Category, Image, or Price)" },
        { status: 400 }
      )
    }

    /* ---------- Extra Images ---------- */
    const images = []

    // Handle files
    for (const file of formData.getAll("images")) {
      if (file instanceof File && file.size > 0) {
        const result = await uploadToCloudinary(file, "products")
        if (result) {
          await db.collection("media").insertOne({
            url: result.secure_url,
            publicId: result.public_id,
            folder: "products",
            fileName: file.name,
            fileSize: file.size,
            format: result.format,
            width: result.width,
            height: result.height,
            createdAt: new Date(),
          })
          images.push(result.secure_url)
        }
      } else if (typeof file === 'string' && file.startsWith('http')) {
        images.push(file)
      }
    }

    // Handle explicit URL fields if any
    const imageURLs = formData.getAll("imageURLs")
    if (imageURLs.length > 0) {
      images.push(...imageURLs)
    }

    /* ---------- DB ---------- */
    const result = await db.collection("products").insertOne({
      name,
      description,
      richDescription,
      categories, // Now an array of category IDs
      price,
      offerPrice,
      purchasePrice,
      isFeatured,
      isActive,
      designName,
      featuredImage, // Store only URL
      images, // Store only URLs
      variants,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      { _id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
