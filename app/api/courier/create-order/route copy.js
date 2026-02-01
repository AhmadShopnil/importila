// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import { getAdminAuth } from '@/lib/auth';

// export async function POST(req) {
//     const admin = await getAdminAuth();
//     if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     try {
//         const { db } = await connectToDatabase();

//         // Try getting from new Courier settings first
//         let settings = await db.collection('settings').findOne({ type: 'courier' });
//         let provider = settings?.providers?.find(p => p.isActive && (p.name.toLowerCase().includes("steadfast") || p.baseUrl?.includes("packzy")));

//         let apiKey = provider?.apiKey;
//         let secretKey = provider?.secretKey;
//         let baseUrl = provider?.baseUrl || 'https://portal.packzy.com/api/v1';

//         // Fallback to General settings (legacy)
//         if (!apiKey || !secretKey) {
//             console.log("Steadfast: Falling back to general settings for API keys.");
//             const generalSettings = await db.collection('settings').findOne({ type: 'general' });
//             if (generalSettings?.steadfastApiKey && generalSettings?.steadfastSecretKey) {
//                 apiKey = generalSettings.steadfastApiKey;
//                 secretKey = generalSettings.steadfastSecretKey;
//             }
//         }

//         if (!apiKey || !secretKey) {
//             console.error("Steadfast: API credentials not configured.");
//             return NextResponse.json({ error: 'Steadfast API credentials not configured. Please go to Settings > Courier Integration.' }, { status: 400 });
//         }

//         const { orders, isBulk } = await req.json();

//         const headers = {
//             'Api-Key': apiKey,
//             'Secret-Key': secretKey,
//             'Content-Type': 'application/json'
//         };

//         // Helper to sanitize phone numbers
//         const sanitizePhoneNumber = (phone) => {
//             if (!phone) return '';
//             const cleaned = phone.replace(/\D/g, ''); // Remove all non-digits
//             // Steadfast expects 11 digits for Bangladeshi numbers, often starting with 01
//             // If it's 10 digits and starts with 1, prepend 0
//             if (cleaned.length === 10 && cleaned.startsWith('1')) {
//                 return '0' + cleaned;
//             }
//             return cleaned;
//         };

//         let result;

//         if (isBulk) {
//             // Bulk Create
//             // Map orders to the bulk format
//             // Bulk Create
//             // Map orders to the bulk format
//             const bulkData = orders.map(order => ({
//                 invoice: order.invoice,
//                 recipient_name: order.recipient_name,
//                 recipient_address: order.recipient_address,
//                 recipient_phone: sanitizePhoneNumber(order.recipient_phone),
//                 cod_amount: Number(order.cod_amount) || 0,
//                 note: order.note
//             }));

//             // Check for empty required fields
//             const invalidOrder = bulkData.find(o => !o.recipient_phone || o.recipient_phone.length < 11);
//             if (invalidOrder) {
//                 console.warn("Steadfast: Invalid phone number found in bulk order", invalidOrder);
//                 // We proceed, but Steadfast might reject it.
//             }

//             console.log("Steadfast Bulk Payload (first item):", bulkData[0]);

//             const response = await fetch(`${baseUrl}/create_order/bulk-order`, {
//                 method: 'POST',
//                 headers,
//                 body: JSON.stringify({
//                     data: JSON.stringify(bulkData)
//                 })
//             });
//             try {
//                 result = await response.json();
//             } catch (e) {
//                 const text = await response.text();
//                 console.error("Steadfast Non-JSON response:", text);
//                 throw new Error("Invalid response from Courier API");
//             }

//         } else {
//             // Single Create
//             // Single Create
//             const order = orders[0];
//             const body = {
//                 invoice: order.invoice,
//                 recipient_name: order.recipient_name,
//                 recipient_phone: sanitizePhoneNumber(order.recipient_phone),
//                 recipient_address: order.recipient_address,
//                 cod_amount: Number(order.cod_amount) || 0,
//                 note: order.note
//             };

//             console.log("Steadfast Single Payload:", body);

//             const response = await fetch(`${baseUrl}/create_order`, {
//                 method: 'POST',
//                 headers,
//                 body: JSON.stringify(body)
//             });

//             try {
//                 result = await response.json();
//             } catch (e) {
//                 const text = await response.text();
//                 console.error("Steadfast Non-JSON response:", text);
//                 throw new Error("Invalid response from Courier API");
//             }
//         }

//         // Update Database with Consignment Details
//         if (result) {
//             if (isBulk && Array.isArray(result)) {
//                 const bulkOps = result.map(item => {
//                     if (item.status === 'success') {
//                         return {
//                             updateOne: {
//                                 filter: { orderNumber: item.invoice },
//                                 update: {
//                                     $set: {
//                                         courierConsignmentId: item.consignment_id,
//                                         courierTrackingCode: item.tracking_code,
//                                         courierStatus: 'sent_to_courier'
//                                     }
//                                 }
//                             }
//                         };
//                     }
//                     return null;
//                 }).filter(Boolean);

//                 if (bulkOps.length > 0) {
//                     await db.collection('orders').bulkWrite(bulkOps);
//                 }
//             } else if (!isBulk && result.status === 200 && result.consignment) {
//                 await db.collection('orders').updateOne(
//                     { orderNumber: result.consignment.invoice },
//                     {
//                         $set: {
//                             courierConsignmentId: result.consignment.consignment_id,
//                             courierTrackingCode: result.consignment.tracking_code,
//                             courierStatus: 'sent_to_courier'
//                         }
//                     }
//                 );
//             }
//         }

//         return NextResponse.json(result);

//     } catch (error) {
//         console.error('Steadfast API Error:', error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
