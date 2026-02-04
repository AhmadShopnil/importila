import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { db } = await connectToDatabase()

        const products = await db.collection("products")
            .find({ isTrashed: true })
            .sort({ updatedAt: -1 })
            .toArray()

        return NextResponse.json(products)
    } catch (error) {
        console.error("GET trashed products error:", error)
        return NextResponse.json(
            { error: "Failed to fetch trashed products" },
            { status: 500 }
        )
    }
}
