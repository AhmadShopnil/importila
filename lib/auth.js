import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const getAdminAuth = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("admin_token")?.value;

        if (!token) return null;

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) return null;

        const { db } = await connectToDatabase();
        const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });

        if (!user) {
            // If user is deleted, they should be logged out
            return null;
        }

        return {
            id: user._id.toString(),
            username: user.username,
            role: user.role,
            name: user.name
        };
    } catch (error) {
        console.error("Auth check error:", error);
        return null;
    }
};

export const protectApi = async (handler, options = {}) => {
    return async (request, context) => {
        const admin = await getAdminAuth();
        if (!admin) {
            return Response.json({ error: "Unauthorized access" }, { status: 401 });
        }

        if (options.roles && !options.roles.includes(admin.role)) {
            return Response.json({ error: "Forbidden: You don't have permission" }, { status: 403 });
        }

        return handler(request, context, admin);
    };
};

export const isSuperAdmin = async () => {
    const admin = await getAdminAuth();
    return admin?.role === "super_admin";
};
