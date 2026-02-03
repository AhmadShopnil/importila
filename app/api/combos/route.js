import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getAdminAuth } from "@/lib/auth"

/* ================= GET ================= */
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const combos = await db.collection("combos").find().toArray();
    return NextResponse.json(combos);
  } catch (error) {
    console.error("GET /api/combos", error);
    return NextResponse.json({ error: "Failed to fetch combos" }, { status: 500 });
  }
}

/* ================= POST ================= */
export async function POST(request) {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const landingPageTitle = formData.get("landingPageTitle");
    const landingPageSubtitle = formData.get("landingPageSubtitle");
    const landingPageDetails = formData.get("landingPageDetails");

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

    const description = formData.get("description");
    const price = Number(formData.get("price")) || 0;
    const offerPrice = Number(formData.get("offerPrice")) || 0;
    const sizes = JSON.parse(formData.get("sizes") || "[]");
    const products = JSON.parse(formData.get("products") || "[]");
    const bundleOptions = JSON.parse(formData.get("bundleOptions") || "[]");
    const imageFile = formData.get("featuredImage");

    if (!title || !slug || products.length === 0 || sizes.length === 0) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const featuredImage = await uploadToCloudinary(
      imageFile,
      "combos/featured"
    );

    const { db } = await connectToDatabase();

    const result = await db.collection("combos").insertOne({
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/combos", error);
    return NextResponse.json({ error: "Failed to create combo" }, { status: 500 });
  }
}
