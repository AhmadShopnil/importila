import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAdminAuth } from '@/lib/auth';

export async function GET(req) {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const consignmentId = searchParams.get('consignmentId');

    if (!consignmentId) {
        return NextResponse.json({ error: 'Consignment ID is required' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const settings = await db.collection('settings').findOne({ type: 'courier' });

        const provider = settings?.providers?.find(p => p.isActive && (p.name.includes("Steadfast") || p?.baseUrl?.includes("packzy")));
        // Or simplified: just take the first active one, or specifically steadfast for now.
        // Let's assume the user configures "Steadfast" as an active provider.

        if (!provider || !provider.apiKey || !provider.secretKey) {
            return NextResponse.json({ error: 'Steadfast API credentials not configured' }, { status: 400 });
        }

        const BASE_URL = provider.baseUrl || 'https://portal.packzy.com/api/v1';
        const headers = {
            'Api-Key': provider.apiKey,
            'Secret-Key': provider.secretKey,
            'Content-Type': 'application/json'
        };

        const response = await fetch(`${BASE_URL}/status_by_cid/${consignmentId}`, {
            method: 'GET',
            headers
        });

        const data = await response.json();

        if (data?.status === 200) {
            // Update order status in DB
            await db.collection('orders').updateOne(
                { courierConsignmentId: parseInt(consignmentId) }, // consignment_id is number in response example, assuming same for query
                {
                    $set: {
                        courierStatus: data.delivery_status,
                        courierLastChecked: new Date()
                    }
                }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Steadfast Status API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
