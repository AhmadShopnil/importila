import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const ADMIN_USER = process.env.ADMIN_USER || "admin";
        const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            const token = signToken({ username });

            const cookieStore = await cookies();
            cookieStore.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: "/",
            });

            return NextResponse.json({ success: true, message: "Login successful" });
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
