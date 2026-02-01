import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request, context) {
    const { location } = await context.params
    try {
        // const { location } = params
        const { db } = await connectToDatabase()

        const slider = await db.collection("sliders").findOne({
            location: location,
            isActive: true
        })

        // console.log("result slider", slider)

        if (!slider) {
            return NextResponse.json({ error: "Slider not found or inactive" }, { status: 404 })
        }

        return NextResponse.json(slider)
    } catch (error) {
        console.error("GET /api/sliders/location error:", error)
        return NextResponse.json({ error: "Failed to fetch slider" }, { status: 500 })
    }
}
