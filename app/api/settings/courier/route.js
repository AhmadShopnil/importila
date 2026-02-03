import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET() {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { db } = await connectToDatabase()
        // Fetch settings with type 'courier'
        let settings = await db.collection("settings").findOne({ type: "courier" })

        if (!settings) {
            settings = {
                type: "courier",
                providers: [
                    {
                        id: "steadfast",
                        name: "Steadfast Courier",
                        apiKey: "",
                        secretKey: "",
                        isActive: true,
                        isDefault: true
                    }
                ]
            }
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error("GET /api/settings/courier error:", error)
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function PUT(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { _id, type, ...updateDataWithoutId } = body
        const { db } = await connectToDatabase()

        const updateData = {
            ...updateDataWithoutId,
            type: "courier", // Enforce type
            updatedAt: new Date()
        }

        const result = await db.collection("settings").updateOne(
            { type: "courier" },
            { $set: updateData },
            { upsert: true }
        )

        return NextResponse.json({ success: true, result })
    } catch (error) {
        console.error("PUT /api/settings/courier error:", error)
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }
}
