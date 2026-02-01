import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request, context) {
    try {
        const { id } = await context.params
        const { db } = await connectToDatabase()

        const slider = await db.collection("sliders").findOne({ _id: new ObjectId(id) })

        if (!slider) {
            return NextResponse.json({ error: "Slider not found" }, { status: 404 })
        }

        return NextResponse.json(slider)
    } catch (error) {
        console.error("GET /api/sliders/[id] error:", error)
        return NextResponse.json({ error: "Failed to fetch slider" }, { status: 500 })
    }
}

export async function PUT(request, context) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await context.params
        const data = await request.json()
        const { name, location, isActive, slides } = data

        const { db } = await connectToDatabase()

        // Check if location is taken by another slider
        if (location) {
            const existing = await db.collection("sliders").findOne({
                location,
                _id: { $ne: new ObjectId(id) }
            })
            if (existing) {
                return NextResponse.json({ error: "A slider with this location already exists" }, { status: 400 })
            }
        }

        const updateData = {
            updatedAt: new Date(),
        }

        if (name !== undefined) updateData.name = name
        if (location !== undefined) updateData.location = location
        if (isActive !== undefined) updateData.isActive = isActive
        if (slides !== undefined) updateData.slides = slides

        const result = await db.collection("sliders").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Slider not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Slider updated successfully" })
    } catch (error) {
        console.error("PUT /api/sliders/[id] error:", error)
        return NextResponse.json({ error: "Failed to update slider" }, { status: 500 })
    }
}

export async function DELETE(request, context) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await context.params
        const { db } = await connectToDatabase()

        const result = await db.collection("sliders").deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Slider not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Slider deleted successfully" })
    } catch (error) {
        console.error("DELETE /api/sliders/[id] error:", error)
        return NextResponse.json({ error: "Failed to delete slider" }, { status: 500 })
    }
}
