import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET() {
  const admin = await getAdminAuth()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { db } = await connectToDatabase()

    // Get all products and extract variant stocks
    const products = await db.collection("products").find({}).toArray()

    const stocks = products?.map((product) => ({
      productId: product._id,
      productName: product.name,
      variantStocks: product.variants || [],
    }))

    return NextResponse.json(stocks)
  } catch (error) {
    console.error("GET /api/stock error:", error)
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 })
  }
}
