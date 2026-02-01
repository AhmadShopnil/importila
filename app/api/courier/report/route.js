import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAdminAuth } from '@/lib/auth';

export async function GET(req) {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    try {
        const { db } = await connectToDatabase();
        const settings = await db.collection('settings').findOne({ type: 'courier' });
        const provider = settings?.providers?.find(p => p.isActive && (p.name.includes("Steadfast") || p.baseUrl?.includes("packzy")));

        if (!provider || !provider.apiKey || !provider.secretKey) {
            return NextResponse.json({ error: 'Steadfast API credentials not configured' }, { status: 400 });
        }

        const BASE_URL = provider.baseUrl || 'https://portal.packzy.com/api/v1';
        const headers = {
            'Api-Key': provider.apiKey,
            'Secret-Key': provider.secretKey,
            'Content-Type': 'application/json'
        };

        let result = {};
        let endpoint = '';

        switch (type) {
            case 'balance':
                endpoint = '/get_balance';
                break;
            case 'payments':
                endpoint = '/payments';
                break;
            case 'returns':
                endpoint = '/get_return_requests';
                break;
            default:
                return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers
        });

        // Some endpoints return list directly, others assume object
        const text = await response.text();
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error(`Steadfast ${type} Parse Error:`, text);
            result = { error: "Failed to parse API response", raw: text };
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Steadfast Report API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
