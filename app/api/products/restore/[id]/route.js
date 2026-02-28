import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(request, context) {
    try {
        const { id } = await context.params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid product ID" },
                { status: 400 }
            )
        }

        const { db } = await connectToDatabase()

        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(id) },
            { $set: { isTrashed: false, updatedAt: new Date() } }
        )

        if (!result.matchedCount) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Product restored successfully" })
    } catch (error) {
        console.error("RESTORE product error:", error)
        return NextResponse.json(
            { error: "Failed to restore product" },
            { status: 500 }
        )
    }
}
