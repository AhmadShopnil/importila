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

    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { slug: id }

    const combo = await db.collection("combos").findOne(query)

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
    const slug = formData.get("slug")
    const landingPageTitle = formData.get("landingPageTitle")
    const landingPageSubtitle = formData.get("landingPageSubtitle")
    const landingPageDetails = formData.get("landingPageDetails")

    const heroBadge = formData.get("heroBadge");
    const heroCTA = formData.get("heroCTA");
    const bundleTitle = formData.get("bundleTitle");
    const bundleSubtitle = formData.get("bundleSubtitle");
    const productGridTitle = formData.get("productGridTitle");
    const sizeSelectionTitle = formData.get("sizeSelectionTitle");
    const checkoutFormTitle = formData.get("checkoutFormTitle");
    const checkoutFormSubtitle = formData.get("checkoutFormSubtitle");
    const checkoutCTA = formData.get("checkoutCTA");
    const whatsappNumber = formData.get("whatsappNumber");
    const messengerUsername = formData.get("messengerUsername");
    const helpTitle = formData.get("helpTitle");
    const helpSubtitle = formData.get("helpSubtitle");

    const description = formData.get("description")
    const price = Number(formData.get("price")) || 0
    const offerPrice = Number(formData.get("offerPrice")) || 0
    const sizes = JSON.parse(formData.get("sizes") || "[]")
    const products = JSON.parse(formData.get("products") || "[]")
    const bundleOptions = JSON.parse(formData.get("bundleOptions") || "[]")

    const featuredImageFile = formData.get("featuredImage")
    let featuredImage = formData.get("existingFeaturedImage") || null

    const { db } = await connectToDatabase()

    if (featuredImageFile && featuredImageFile.size > 0) {
      const imageResult = await uploadToCloudinary(featuredImageFile, "combos")

      // Save to media collection
      await db.collection("media").insertOne({
        url: imageResult.secure_url,
        publicId: imageResult.public_id,
        folder: "combos",
        fileName: featuredImageFile.name,
        fileSize: featuredImageFile.size,
        format: imageResult.format,
        width: imageResult.width,
        height: imageResult.height,
        createdAt: new Date(),
      })

      featuredImage = imageResult.secure_url
    }

    const result = await db.collection("combos").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          slug,
          landingPageTitle,
          landingPageSubtitle,
          landingPageDetails,
          heroBadge,
          heroCTA,
          bundleTitle,
          bundleSubtitle,
          productGridTitle,
          sizeSelectionTitle,
          checkoutFormTitle,
          checkoutFormSubtitle,
          checkoutCTA,
          whatsappNumber,
          messengerUsername,
          helpTitle,
          helpSubtitle,
          description,
          price,
          offerPrice,
          sizes,
          products,
          bundleOptions,
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
