import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { getAdminAuth } from "@/lib/auth"

/* ================= GET ================= */
export async function GET(request) {
  try {
    // console.log("from product api start fetch",)
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const isFeatured = searchParams.get("featured") === "true";

    let query = {}

    if (category) {
      query.categories = { $in: [category] }
    }

    if (isFeatured) {
      query.isFeatured = true
    }

    query.isActive = { $ne: false } // Default to active products unless specified otherwise or filtering for inactive

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    }

    const products = await db.collection("products")
      .find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

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
    const categories = JSON.parse(formData.get("categories") || "[]")
    const price = Number(formData.get("price"))
    const offerPrice = Number(formData.get("offerPrice"))
    const isFeatured = formData.get("isFeatured") === "true"
    const isActive = formData.get("isActive") === "true"
    const designName = formData.get("designName") || ""
    const purchasePrice = Number(formData.get("purchasePrice")) || 0
    const variants = JSON.parse(formData.get("variants") || "[]")

    const featuredImageFile = formData.get("featuredImage")
    const extraImageFiles = formData.getAll("images")

    if (!name || categories.length === 0 || !featuredImageFile || isNaN(price)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    /* ---------- Upload images ---------- */
    const featuredImage = await uploadToCloudinary(
      featuredImageFile,
      "products/featured"
    )

    const images = []
    for (const file of extraImageFiles) {
      if (file && file.size > 0) {
        const url = await uploadToCloudinary(file, "products/gallery")
        if (url) images.push(url)
      }
    }

    /* ---------- DB ---------- */
    const { db } = await connectToDatabase()

    const result = await db.collection("products").insertOne({
      name,
      description,
      categories, // Now an array of category IDs
      price,
      offerPrice,
      purchasePrice,
      isFeatured,
      isActive,
      designName,
      featuredImage,
      images,
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
