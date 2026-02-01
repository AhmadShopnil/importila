import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

// Validate cart items before checkout - check stock availability
export async function POST(request) {
  try {
    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const validation = {
      isValid: true,
      items: [],
      errors: [],
    }

    for (const item of items) {
      if (!ObjectId.isValid(item.productId)) {
        validation.isValid = false
        validation.errors.push(`Invalid product ID: ${item.productId}`)
        continue
      }

      const product = await db.collection("products").findOne({
        _id: new ObjectId(item.productId),
      })

      if (!product) {
        validation.isValid = false
        validation.errors.push(`Product not found: ${item.productId}`)
        continue
      }

      const variant = product.variants?.find(
        (v) => v.design === item.design && v.color === item.color && v.size === item.size,
      )

      if (!variant) {
        validation.isValid = false
        validation.errors.push(`Variant not available for ${product.name}: ${item.design} - ${item.color} ${item.size}`)
        continue
      }

      validation.items.push({
        productId: item.productId,
        productName: product.name,
        design: item.design,
        color: item.color,
        size: item.size,
        price: product.price,
        requestedQuantity: item.quantity,
        availableStock: variant.stock,
        isAvailable: variant.stock >= item.quantity,
      })

      if (variant.stock < item.quantity) {
        validation.isValid = false
        validation.errors.push(
          `Insufficient stock for ${product.name} - ${item.color} ${item.size}: Available ${variant.stock}, Requested ${item.quantity}`,
        )
      }
    }

    return NextResponse.json(validation)
  } catch (error) {
    console.error("POST /api/cart/validate error:", error)
    return NextResponse.json({ error: "Failed to validate cart" }, { status: 500 })
  }
}
