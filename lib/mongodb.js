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
    
    cached.promise = client.connect().then((client) => {
      const db = client.db("importila")
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
