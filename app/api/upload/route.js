import { uploadToCloudinary } from "@/lib/cloudinary"
import { getAdminAuth } from "@/lib/auth"
import { NextResponse } from "next/server"

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

        const url = await uploadToCloudinary(file, folder)

        return NextResponse.json({ url })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
