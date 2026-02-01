import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        const categories = await db.collection("categories")
            .find({ isActive: true })
            .sort({ order: 1 })
            .toArray()

        // Build a map for easy lookup
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat._id.toString()] = cat;
        });

        // Function to get full path
        const getPath = (cat) => {
            const path = [];
            let current = cat;
            while (current) {
                path.unshift(current.name);
                current = current.parentId ? categoryMap[current.parentId] : null;
            }
            return path.join(" > ");
        };

        // Return flat list with full path for display
        const flatCategories = categories.map(cat => ({
            ...cat,
            _id: cat._id.toString(),
            fullName: getPath(cat)
        }));

        return NextResponse.json(flatCategories)
    } catch (error) {
        console.error("GET /api/categories/flat error:", error)
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}
