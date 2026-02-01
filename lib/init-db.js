import { connectToDatabase } from "./mongodb.js"

export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase()

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    const requiredCollections = ["products", "categories", "orders", "stocks", "daily_sales"]

    for (const collectionName of requiredCollections) {
      if (!collectionNames.includes(collectionName)) {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      }
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}
