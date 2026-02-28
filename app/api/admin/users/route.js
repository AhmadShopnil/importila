import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { protectApi } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

// GET all users (Super Admin only)
export const GET = await protectApi(async (request) => {
    try {
        const { db } = await connectToDatabase();
        const users = await db.collection("users")
            .find({}, { projection: { password: 0 } }) // Exclude passwords
            .toArray();

        return NextResponse.json(users);
    } catch (error) {
        console.error("GET users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}, { roles: ["super_admin"] });

// POST create new user (Super Admin only)
export const POST = await protectApi(async (request) => {
    try {
        const { name, username, password, role } = await request.json();

        if (!name || !username || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Check if username already exists
        const existingUser = await db.collection("users").findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            username,
            password: hashedPassword,
            role, // super_admin, admin, manager
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("users").insertOne(newUser);

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            id: result.insertedId
        });
    } catch (error) {
        console.error("POST user error:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}, { roles: ["super_admin"] });
