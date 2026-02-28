import React from 'react';

export default function InvoicePrint({ order }) {
    if (!order) return null;

    return (
        <div className="hidden print:block fixed inset-0 bg-white z-[200] p-8 text-black font-sans leading-relaxed" id="printable-invoice">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-[#1E556E] pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-[#1E556E] mb-1">IMPORTILA</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1E556E]/60">Your Premium Import Partner</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-black uppercase text-[#1E556E]">INVOICE</h2>
                    <p className="text-sm font-bold">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div className="space-y-3">
                    <h3 className="text-[14px] font-black uppercase tracking-widest text-gray-400 border-b pb-1 mb-2">BILL TO RECIPIENT</h3>
                    <div className="space-y-1">
                        <p className="font-semibold text-sm"><span className="mr-1 text-gray-400">Customer Name:</span>{order?.customerName}</p>

                        <p className="font-semibold text-sm"><span className="mr-1 text-gray-400">Phone::</span>{order?.phone}</p>
                        <p className="font-semibold text-sm"><span className="mr-1 text-gray-400">Address:</span>{order?.address}</p>
                        {/* <p className="text-sm leading-snug whitespace-pre-wrap">{order.address}</p> */}
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-[14px] font-black uppercase tracking-widest text-gray-400 border-b pb-1 mb-2">SHIPPING INFO</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm py-1 border-b border-dashed border-gray-100">
                            <span className="font-bold text-gray-400">Location:</span>
                            <span className="font-black uppercase">{order.deliveryLocation} Dhaka</span>
                        </div>
                        <div className="flex justify-between text-sm py-1 border-b border-dashed border-gray-100">
                            <span className="font-bold text-gray-400">Source:</span>
                            <span className="font-black uppercase">{order.orderSource}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Item Table */}
            <div className="mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#1E556E] text-white">
                            <th className="py-3 px-4 rounded-tl-xl text-[14px] font-black uppercase tracking-wider">Product details</th>
                            <th className="py-3 px-4 text-[14px] font-black uppercase tracking-wider text-center">Qty</th>
                            <th className="py-3 px-4 text-[14px] font-black uppercase tracking-wider text-right">Unit Price</th>
                            <th className="py-3 px-4 rounded-tr-xl text-[14px] font-black uppercase tracking-wider text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {order.productType === 'combo' ? (
                            <tr>
                                <td className="py-4 px-4 align-top">
                                    <p className="font-black text-lg text-[#1E556E]">{order.name || order.title || "Combo Deal"}</p>
                                    <p className="text-xs font-bold text-gray-400 mt-1">
                                        Bundle Size: {order.bundleSize} Pieces
                                        {order.productSize && ` | Size: ${order.productSize}`}
                                    </p>
                                    <div className="mt-4 grid grid-cols-1 gap-2 border-l-4 border-gray-100 pl-4">
                                        {(order.items || order.products || [])?.map((sub, sIdx) => (
                                            <div key={sIdx} className="flex items-center justify-between text-[11px] font-bold">
                                                <span>• {sub.name}</span>
                                                <span className="text-gray-400 uppercase">{sub.color}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center font-black">1</td>
                                <td className="py-4 px-4 text-right font-bold">৳ {order.price?.toLocaleString()}</td>
                                <td className="py-4 px-4 text-right font-black">৳ {order.price?.toLocaleString()}</td>
                            </tr>
                        ) : (
                            order.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-4 px-4">
                                        <p className="font-black text-lg text-[#1E556E]">{item.name}</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1">
                                            {item.variantName || `${item.design || ''} ${item.color || ''}`.trim()}
                                            {item.size && ` | Size: ${item.size}`}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4 text-center font-black">{item.quantity}</td>
                                    <td className="py-4 px-4 text-right font-bold">৳ {item.price?.toLocaleString()}</td>
                                    <td className="py-4 px-4 text-right font-black">৳ {(item.price * item.quantity)?.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Totals & Notes */}
            <div className="grid grid-cols-12 gap-12 mt-auto">
                <div className="col-span-7 bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200">
                    <h3 className="text-[14px] font-black uppercase tracking-widest text-[#1E556E] mb-3">Order Note / Instructions</h3>
                    <p className="text-sm font-bold text-gray-500 italic leading-relaxed">
                        {order.note || "No special instructions provided."}
                    </p>
                </div>
                <div className="col-span-5 space-y-3 pt-4">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-400">Subtotal:</span>
                        <span className="font-black">৳ {(order.totalPrice || order.price || (order.totalAmount - order.shippingCharge + (order.discount || 0)))?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-400">Shipping:</span>
                        <span className="font-black">৳ {order.shippingCharge?.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                            <span className="font-bold">Discount:</span>
                            <span className="font-black">- ৳ {order.discount?.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center bg-[#1E556E] text-white p-4 rounded-xl ">
                        <span className="text-[14px] font-black uppercase tracking-widest">Total Payable</span>
                        <span className="text-3xl font-black">৳ {order.totalAmount?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer Warning for Courier */}
            <div className="mt-20 pt-10 border-t-4 border-[#1E556E]/20 flex justify-between items-center grayscale opacity-80">
                <div className="space-y-1">
                    <p className="text-[14px] font-black text-gray-400">Authorized Signature</p>
                    <div className="w-40 h-10 border-b border-gray-200"></div>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-[12px] font-black text-[#1E556E]">IMPORTILA OFFICIAL</p>
                    <p className="text-[8px] font-bold text-gray-400">Dhaka, Bangladesh | +880 1XXX-XXXXXX</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-invoice, #printable-invoice * {
                        visibility: visible;
                    }
                    #printable-invoice {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
}
