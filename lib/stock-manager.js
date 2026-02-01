import { connectToDatabase } from "./mongodb.js"
import { ObjectId } from "mongodb"

export async function getVariantStock(productId, design, color, size) {
  try {
    const { db } = await connectToDatabase()
    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
    })

    if (!product || !product.variants) {
      return 0
    }

    const variant = product.variants.find((v) => v.design === design && v.color === color && v.size === size)
    return variant ? variant.stock : 0
  } catch (error) {
    console.error("Failed to get variant stock:", error)
    return 0
  }
}

export async function deductVariantStock(productId, design, color, size, quantity) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("products").updateOne(
      {
        _id: new ObjectId(productId),
        "variants.design": design,
        "variants.color": color,
        "variants.size": size,
      },
      {
        $inc: { "variants.$.stock": -quantity },
      },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Failed to deduct variant stock:", error)
    return false
  }
}

export async function restoreVariantStock(productId, design, color, size, quantity) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("products").updateOne(
      {
        _id: new ObjectId(productId),
        "variants.design": design,
        "variants.color": color,
        "variants.size": size,
      },
      {
        $inc: { "variants.$.stock": quantity },
      },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Failed to restore variant stock:", error)
    return false
  }
}
