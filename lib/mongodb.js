import { MongoClient } from "mongodb"

let cached = globalThis.mongoCache

if (!cached) {
  cached = globalThis.mongoCache = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  if (!cached.promise) {
    const client = new MongoClient(process.env.MONGODB_URI)
    
    cached.promise = client.connect().then(async (client) => {
      const db = client.db("importila")

      try {
        // Create indexes
        await db.collection("products").createIndex({ category: 1 })
        await db.collection("products").createIndex({ name: "text" })
        await db.collection("orders").createIndex({ createdAt: -1 })
        await db.collection("orders").createIndex({ status: 1 })
        await db.collection("daily_sales").createIndex({ date: -1 })
        await db.collection("sliders").createIndex({ location: 1 }, { unique: true })
        await db.collection("users").createIndex({ username: 1 }, { unique: true })
      } catch (error) {
        console.error("Index creation error:", error)
      }

      return { client, db }
    }).catch((error) => {
      console.error("Failed to connect to MongoDB:", error)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}
