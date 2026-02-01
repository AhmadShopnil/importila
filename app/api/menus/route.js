import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        const menus = await db.collection("menus").find({}).sort({ position: 1 }).toArray()
        return NextResponse.json(menus)
    } catch (error) {
        console.error("GET /api/menus error:", error)
        return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 })
    }
}

export async function POST(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { db } = await connectToDatabase()

        const menu = {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await db.collection("menus").insertOne(menu)
        return NextResponse.json({ _id: result.insertedId, ...menu }, { status: 201 })
    } catch (error) {
        console.error("POST /api/menus error:", error)
        return NextResponse.json({ error: "Failed to create menu" }, { status: 500 })
    }
}

export async function PUT(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { _id, ...updateData } = body
        const { db } = await connectToDatabase()

        const result = await db.collection("menus").updateOne(
            { _id: new ObjectId(_id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        )

        return NextResponse.json({ success: true, result })
    } catch (error) {
        console.error("PUT /api/menus error:", error)
        return NextResponse.json({ error: "Failed to update menu" }, { status: 500 })
    }
}

export async function DELETE(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        const { db } = await connectToDatabase()
        await db.collection("menus").deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE /api/menus error:", error)
        return NextResponse.json({ error: "Failed to delete menu" }, { status: 500 })
    }
}
