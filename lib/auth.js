import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return null;

    return verifyToken(token);
};

export const protectApi = async (handler) => {
    return async (request, context) => {
        const admin = await getAdminAuth();
        if (!admin) {
            return Response.json({ error: "Unauthorized access" }, { status: 401 });
        }
        return handler(request, context);
    };
};
