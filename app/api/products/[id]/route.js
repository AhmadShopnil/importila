import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"

/* ================= GET ================= */
export async function GET(request, context) {
  try {
    const { id } = await context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("GET product error:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

/* ================= PUT ================= */
export async function PUT(request, context) {
  try {
    const { id } = await context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      )
    }

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

    if (!name || categories.length === 0 || isNaN(price)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    /* ---------- Featured Image ---------- */
    let featuredImage = null
    const featuredFile = formData.get("featuredImage")
    const featuredURL = formData.get("featuredImageURL")

    const { db } = await connectToDatabase()

    if (featuredFile instanceof File) {
      const result = await uploadToCloudinary(
        featuredFile,
        "products"
      )
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
    } else if (featuredURL) {
      featuredImage = featuredURL
    }

    /* ---------- Extra Images ---------- */
    const images = []

    for (const file of formData.getAll("images")) {
      if (file instanceof File && file.size > 0) {
        const result = await uploadToCloudinary(file, "products")
        if (result) {
          // Save to media collection
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
      }
    }

    images.push(...formData.getAll("imageURLs"))

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          richDescription,
          categories,
          price,
          offerPrice,
          purchasePrice,
          isFeatured,
          isActive,
          designName,
          featuredImage,
          images,
          variants,
          updatedAt: new Date(),
        },
      }
    )

    if (!result.matchedCount) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("PUT product error:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

/* ================= DELETE ================= */
export async function DELETE(request, context) {
  try {
    const { id } = await context.params   // ✅ FIX

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    })

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("DELETE product error:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
