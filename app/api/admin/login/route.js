import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        const { db } = await connectToDatabase();

        // Seed initial super admin if no users exist
        const userCount = await db.collection("users").countDocuments();
        if (userCount === 0) {
            const ADMIN_USER = process.env.ADMIN_USER || "admin";
            const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

            const hashedPassword = await bcrypt.hash(ADMIN_PASS, 10);
            await db.collection("users").insertOne({
                name: "Super Admin",
                username: ADMIN_USER,
                password: hashedPassword,
                role: "super_admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log("Initial super admin seeded");
        }

        const user = await db.collection("users").findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = signToken({
                id: user._id.toString(),
                username: user.username,
                role: user.role,
                name: user.name
            });

            const cookieStore = await cookies();
            cookieStore.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: "/",
            });

            return NextResponse.json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id.toString(),
                    username: user.username,
                    role: user.role,
                    name: user.name
                }
            });
        }

        return NextResponse.json(
            { error: "Invalid username or password" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");
    if (!token) {
        return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return NextResponse.json({ success: true, message: "Logged out" });
}
