import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAdminAuth } from '@/lib/auth';

export async function GET(req) {
    const admin = await getAdminAuth();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
        return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();

        // Find all orders with this phone number
        const orders = await db.collection('orders').find({
            $or: [
                { phone: phone },
                { recipient_phone: phone },
                { customerPhone: phone }
            ]
        }).toArray();

        const totalOrders = orders.length;
        const cancelled = orders.filter(o => o.status === 'cancelled' || o.courierStatus === 'cancelled').length;
        const returned = orders.filter(o => o.status === 'returned' || o.courierStatus === 'returned').length;
        const delivered = orders.filter(o => o.status === 'delivered' || o.courierStatus === 'delivered').length;

        // Simple customized risk score logic
        // If cancellation rate > 50% and total orders > 2 => High Risk
        // If return rate > 30% => Medium Risk

        let riskLevel = 'Low';
        let recommendation = 'Safe to process';

        if (totalOrders > 0) {
            const badRate = (cancelled + returned) / totalOrders;

            if (totalOrders > 2 && badRate > 0.5) {
                riskLevel = 'High';
                recommendation = 'Verify with customer before processing';
            } else if (totalOrders > 2 && badRate > 0.2) {
                riskLevel = 'Medium';
                recommendation = 'Check customer history';
            }
        }

        return NextResponse.json({
            phone,
            totalOrders,
            cancelled,
            returned,
            delivered,
            riskLevel,
            recommendation
        });

    } catch (error) {
        console.error('Fraud Check API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
