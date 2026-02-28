import { uploadToCloudinary } from "@/lib/cloudinary"
import { getAdminAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all media
export async function GET(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { db } = await connectToDatabase()
        const { searchParams } = new URL(request.url)
        const folder = searchParams.get("folder")

        const query = folder ? { folder } : {}
        const media = await db.collection("media")
            .find(query)
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json(media)
    } catch (error) {
        console.error("Media fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
    }
}

// POST - Upload new media
export async function POST(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const formData = await request.formData()
        const file = formData.get("file")
        const folder = formData.get("folder") || "general"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, folder)

        // Save to database
        const { db } = await connectToDatabase()
        const mediaDoc = {
            url: result.secure_url,
            publicId: result.public_id,
            folder: folder,
            fileName: file.name,
            fileSize: file.size,
            format: result.format,
            width: result.width,
            height: result.height,
            createdAt: new Date(),
        }

        const insertResult = await db.collection("media").insertOne(mediaDoc)
        mediaDoc._id = insertResult.insertedId

        return NextResponse.json(mediaDoc)
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}

// DELETE - Delete media
export async function DELETE(request) {
    const admin = await getAdminAuth()
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Media ID required" }, { status: 400 })
        }

        const { db } = await connectToDatabase()
        const media = await db.collection("media").findOne({ _id: new ObjectId(id) })

        if (!media) {
            return NextResponse.json({ error: "Media not found" }, { status: 404 })
        }

        // Delete from Cloudinary
        const cloudinary = require("cloudinary").v2
        await cloudinary.uploader.destroy(media.publicId)

        // Delete from database
        await db.collection("media").deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}
