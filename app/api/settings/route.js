import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"

export async function GET() {
    // const admin = await getAdminAuth()
    // if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { db } = await connectToDatabase()

        let settings = await db.collection("settings").findOne({ type: "general" })

        // Return default settings if none exist
        if (!settings) {
            settings = {
                type: "general",
                storeName: "Kids Shop",
                storeEmail: "",
                storePhone: "",
                storeAddress: "",
                currency: "BDT",
                currencySymbol: "৳",
                googleTagManagerId: "",
                facebookPixelId: "",
                metaTitle: "Kids Shop - Quality Kids Clothing",
                metaDescription: "Shop for quality kids clothing with fun designs",
                lowStockThreshold: 10,
                orderPrefix: "KS",
                enableGTM: false,
                enableFBPixel: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error("GET /api/settings error:", error)
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function PUT(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { db } = await connectToDatabase()

        const updateData = {
            ...body,
            updatedAt: new Date()
        }

        const result = await db.collection("settings").updateOne(
            { type: "general" },
            { $set: updateData },
            { upsert: true }
        )

        return NextResponse.json({ success: true, result })
    } catch (error) {
        console.error("PUT /api/settings error:", error)
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }
}
