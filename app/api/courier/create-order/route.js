import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getAdminAuth } from "@/lib/auth"

export async function POST(req) {
    const admin = await getAdminAuth()
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { db } = await connectToDatabase()


        // Get Steadfast Credentials

        let settings = await db.collection("settings").findOne({ type: "courier" })
        let provider = settings?.providers?.find(
            p =>
                p.isActive &&
                (p.name?.toLowerCase().includes("steadfast") ||
                    p.baseUrl?.includes("packzy"))
        )

        let apiKey = provider?.apiKey || "dhvvgk7qarettqtxro8jorhfojmojyvu"
        let secretKey = provider?.secretKey || "jgzv5478ompzs0kwgkzxogcy"
        let baseUrl = provider?.baseUrl || "https://portal.packzy.com/api/v1"

        if (!apiKey || !secretKey) {
            const general = await db.collection("settings").findOne({ type: "general" })
            apiKey = general?.steadfastApiKey
            secretKey = general?.steadfastSecretKey
        }

        if (!apiKey || !secretKey) {
            return NextResponse.json(
                { error: "Steadfast API credentials not configured" },
                { status: 400 }
            )
        }

        const { orders } = await req.json()

        if (!Array.isArray(orders) || orders.length === 0) {
            return NextResponse.json({ error: "Orders array required" }, { status: 400 })
        }

        const headers = {
            "Api-Key": apiKey,
            "Secret-Key": secretKey,
            "Content-Type": "application/json"
        }

        const sanitizePhone = phone => {
            if (!phone) return ""
            const p = phone.replace(/\D/g, "")
            if (p.length === 10 && p.startsWith("1")) return "0" + p
            return p
        }

        const mappedOrders = orders?.map(order => ({
            invoice: order?.invoice,
            recipient_name: order?.recipient_name,
            recipient_address: order?.recipient_address,
            recipient_phone: sanitizePhone(order?.recipient_phone),
            cod_amount: Number(order.cod_amount) || 0,
            note: order.note || "",
            delivery_type: 0
        }))

        // Strict validation
        for (const o of mappedOrders) {
            if (!o?.invoice || !o?.recipient_phone || o?.recipient_phone.length !== 11) {
                return NextResponse.json(
                    { error: `Invalid order data for invoice ${o.invoice}` },
                    { status: 400 }
                )
            }
        }

        let result


        // SINGLE ORDER

        if (mappedOrders?.length === 1) {
            const res = await fetch(`${baseUrl}/create_order`, {
                method: "POST",
                headers,
                body: JSON.stringify(mappedOrders[0])
            })

            result = await res.json();
            // console.log("in courier api response",result)

            if (result?.status === 200 && result?.consignment) {
                await db.collection("orders").updateOne(
                    { orderNumber: result.consignment.invoice },
                    {
                        $set: {
                            courierConsignmentId: result.consignment.consignment_id,
                            courierTrackingCode: result.consignment.tracking_code,
                            courierStatus: "sent_to_courier"
                        }
                    }
                )
            }

            return NextResponse.json(result)
        }


        // BULK ORDER

        const res = await fetch(`${baseUrl}/create_order/bulk-order`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                data: JSON.stringify(mappedOrders)
            })
        })

        result = await res.json()

        if (Array.isArray(result)) {
            const bulkOps = result
                .filter(r => r.status === "success")
                .map(r => ({
                    updateOne: {
                        filter: { orderNumber: r.invoice },
                        update: {
                            $set: {
                                courierConsignmentId: r.consignment_id,
                                courierTrackingCode: r.tracking_code,
                                courierStatus: "sent_to_courier"
                            }
                        }
                    }
                }))

            if (bulkOps.length) {
                await db.collection("orders").bulkWrite(bulkOps)
            }
        }

        return NextResponse.json(result)
    } catch (err) {
        console.error("Steadfast Error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
