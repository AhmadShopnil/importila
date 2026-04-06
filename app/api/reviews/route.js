import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET(request) {
    try {
        const { db } = await connectToDatabase()
        const reviews = await db.collection("reviews")
            .find({ isActive: true })
            .sort({ createdAt: -1 })
            .toArray()

        const normalizedReviews = reviews.map(review => ({
            ...review,
            imageUrl: typeof review.imageUrl === 'object' && review.imageUrl !== null ? (review.imageUrl.secure_url || review.imageUrl.url) : review.imageUrl
        }))

        return NextResponse.json(normalizedReviews)
    } catch (error) {
        console.error("GET /api/reviews error:", error)
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }
}

export async function POST(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const data = await request.json()
        const { imageUrl, customerName, isActive } = data

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
        }

        let finalImageUrl = imageUrl;
        if (typeof imageUrl === 'object' && imageUrl !== null) {
            finalImageUrl = imageUrl.secure_url || imageUrl.url || "";
        }

        const { db } = await connectToDatabase()

        const result = await db.collection("reviews").insertOne({
            imageUrl: finalImageUrl,
            customerName: customerName || "Customer",
            isActive: isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        return NextResponse.json({ _id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error("POST /api/reviews error:", error)
        return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
    }
}
