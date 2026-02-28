import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { protectApi } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

// PUT update user (Super Admin only)
export const PUT = await protectApi(async (request, { params }) => {
    try {
        const { id } = await params;
        const { name, password, role } = await request.json();
        const { db } = await connectToDatabase();

        const updateData = {
            updatedAt: new Date(),
        };

        if (name) updateData.name = name;
        if (role) updateData.role = role;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.error("PUT user error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}, { roles: ["super_admin"] });

// DELETE user (Super Admin only)
export const DELETE = await protectApi(async (request, { params }) => {
    try {
        const { id } = await params;
        const { db } = await connectToDatabase();

        // Prevent deleting the last super admin (optional but recommended)
        const userToDelete = await db.collection("users").findOne({ _id: new ObjectId(id) });
        if (userToDelete?.role === "super_admin") {
            const superAdminCount = await db.collection("users").countDocuments({ role: "super_admin" });
            if (superAdminCount <= 1) {
                return NextResponse.json({ error: "Cannot delete the last super admin" }, { status: 400 });
            }
        }

        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("DELETE user error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}, { roles: ["super_admin"] });
