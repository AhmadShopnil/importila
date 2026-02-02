import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function DELETE(request, context) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await context.params
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
        }

        const { db } = await connectToDatabase()
        const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Review deleted successfully" })
    } catch (error) {
        console.error("DELETE /api/reviews/[id] error:", error)
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }
}
