"use client"

import { useEffect, useState, use } from "react"
import Loading from "@/components/Loader/Loading"
import { BASE_URL } from "@/utils/baseUrl"
import Link from "next/link"
import {
    ArrowLeft,
    Printer,
    Truck,
    User,
    MapPin,
    Phone,
    Calendar,
    CreditCard,
    Package,
    ChevronRight,
    Shield,
    RefreshCw,
    CheckCircle2,
    Clock,
    AlertCircle,
    Gem
} from "lucide-react"
import toast from "react-hot-toast"

export default function ComboOrderDetailsPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const { id } = params
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/orders/${id}`)
            const data = await res.json()
            if (res.ok) setOrder(data)
            else toast.error("Failed to fetch order details")
        } catch (error) {
            console.error(error)
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (status) => {
        setUpdating(true)
        try {
            const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                toast.success(`Order status updated to ${status}`)
                fetchOrder()
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setUpdating(false)
        }
    }

    const handleCheckCourierStatus = async () => {
        if (!order?.courierConsignmentId) return
        const toastId = toast.loading("Syncing with courier...")
        try {
            const res = await fetch(`${BASE_URL}/api/courier/check-status?consignmentId=${order.courierConsignmentId}`)
            const data = await res.json()
            if (data.status === 200) {
                toast.success(`Sync Complete: ${data.delivery_status}`, { id: toastId })
                fetchOrder()
            } else {
                toast.error("Courier sync failed", { id: toastId })
            }
        } catch (error) {
            toast.error("Network error", { id: toastId })
        }
    }

    if (loading) return <Loading />
    if (!order) return <div className="p-10 text-center">Order not found</div>

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        confirmed: "bg-blue-100 text-blue-700 border-blue-200",
        shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
        delivered: "bg-green-100 text-green-700 border-green-200",
        cancelled: "bg-red-100 text-red-700 border-red-200"
    }

    const orderItems = order.items || order.products || []

    return (
        <div className="space-y-6 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders/combos" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E556E] flex items-center gap-2 ">
                            Combo Details
                            <span className="text-gray-400 font-normal">#{order?.orderNumber}</span>
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Placed on {new Date(order?.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window?.print()}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                    >
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                    <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />
                    <select
                        value={order.status}
                        disabled={updating}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm border-2 cursor-pointer transition-all focus:ring-0 ${statusColors[order.status]}`}
                    >
                        {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(s => (
                            <option key={s} value={s} className="bg-white text-gray-800">{s.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items & Payment */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Table */}
                    <div className="bg-white rounded-md border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/30">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                <Gem className="w-5 h-5" />
                                Bundle Selections ({orderItems.length || 1})
                            </h3>
                            <span className="text-[10px] font-black uppercase bg-indigo-600 text-white px-2 py-0.5 rounded shadow">Combo Offer</span>
                        </div>
                        <div className="overflow-x-auto">
                            {orderItems.length > 0 ? (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] tracking-widest">
                                        <tr>
                                            <th className="p-4">Product Details</th>
                                            <th className="p-4 text-center">Qty</th>
                                            <th className="p-4 text-right">Unit Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orderItems.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-indigo-50/20 transition-colors">
                                                <td className="p-4 flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50">
                                                        {item.image || item.mainImage ? (
                                                            <img src={item.image || item.mainImage} alt={item.name || item.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-8 h-8 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{item.name || item.title || "Selected Item"}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {item.sku && <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</p>}
                                                            {item.size && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold uppercase">Size: {item.size}</span>}
                                                            {item.color && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold uppercase">Color: {item.color}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center font-medium text-gray-700">x{item.quantity || 1}</td>
                                                <td className="p-4 text-right font-medium text-gray-700">৳ {(item.price || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-10 text-center space-y-2">
                                    <p className="font-bold text-gray-900 text-lg">{order.title || 'Combo Bundle'}</p>
                                    <p className="text-gray-500 text-sm italic">Detailed contents not available in primary list</p>
                                </div>
                            )}
                        </div>

                        {/* Totals Section */}
                        <div className="p-6 bg-indigo-50/20 border-t border-indigo-100">
                            <div className="flex justify-end">
                                <div className="w-full max-w-[240px] space-y-3">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Bundle Original Price</span>
                                        <span className="font-medium text-gray-900 ">৳ {(order.price || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-indigo-600 font-bold">
                                        <span>Shiping charge </span>
                                        <span className="">+ ৳ {(order.shippingCharge || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-indigo-100 my-2" />
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold text-gray-900">Paid Amount</span>
                                        <span className="font-black text-indigo-700">৳ {(order.totalAmount || (order?.price + order?.shippingCharge)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-md border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <CreditCard className="w-5 h-5 text-[#1E556E]" />
                            Payment Information
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Method</p>
                                <p className="font-bold text-gray-800 uppercase">{order?.paymentMethod || 'Cash on Delivery'}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${order?.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {order?.paymentStatus || 'Unpaid'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer Profile */}
                    <div className="bg-[#1E556E] rounded-md shadow-xl p-6 text-white relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{order?.customerName}</h4>
                                <p className="text-white/60 text-xs font-medium uppercase tracking-tighter">Verified VIP Customer</p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4 text-sm font-medium">
                            <div className="flex gap-3">
                                <Phone className="w-4 h-4 text-white/40 mt-0.5" />
                                <p>{order.phone}</p>
                            </div>
                            <div className="flex gap-3">
                                <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
                                <p className="line-clamp-3 leading-relaxed opacity-90">{order?.address}</p>
                            </div>
                        </div>

                        {order.note && (
                            <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[10px] uppercase font-black text-white/40 mb-1">Bundle Note</p>
                                <p className="text-xs italic opacity-90">"{order?.note}"</p>
                            </div>
                        )}
                    </div>

                    {/* Courier Info */}
                    <div className="bg-white rounded-md border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-[#1E556E]" />
                                Shipping Info
                            </h3>
                            {order.courierConsignmentId && (
                                <button
                                    onClick={handleCheckCourierStatus}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-blue-500"
                                    title="Refresh Status"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {order.courierConsignmentId ? (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Partner</p>
                                    <p className="font-bold text-gray-800">Steadfast Courier</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Consignment ID</p>
                                    <code className="bg-gray-50 px-2 py-1 rounded text-xs text-[#1E556E] font-black border border-gray-100">{order.courierConsignmentId}</code>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Courier Status</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="font-black text-xs text-[#1E556E] uppercase">{order.courierStatus || 'Processing'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">Not handed to courier</p>
                                <Link href="/admin/orders/combos" className="text-xs text-[#1E556E] font-bold hover:underline mt-2 inline-block">Go to list to send</Link>
                            </div>
                        )}
                    </div>

                    {/* Risk Card */}
                    {/* <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 space-y-4">
                        <h3 className="font-bold text-orange-900 flex items-center gap-2 border-b border-orange-200/50 pb-4">
                            <Shield className="w-5 h-5" />
                            Fraud Analysis
                        </h3>
                        <div className="space-y-2">
                            <p className="text-xs text-orange-700/70 font-medium italic">"Combo orders often have higher risk levels due to multiple items in single shipment."</p>
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-tighter">Safe Address Match</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
            {/* Hidden Printable Invoice Section */}
            {order && (
                <div id="printable-invoice" className="hidden print:block fixed inset-0 bg-white z-[200] p-8 text-black font-sans leading-relaxed">
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
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-1 mb-2">BILL TO RECIPIENT</h3>
                            <div className="space-y-1">
                                <p className="font-extrabold text-xl">{order.customerName}</p>
                                <p className="font-bold flex items-center gap-2">
                                    <span className="w-5 h-5 flex items-center justify-center bg-[#1E556E] text-white rounded text-[10px]">P</span>
                                    {order.phone}
                                </p>
                                <p className="text-sm leading-snug whitespace-pre-wrap">{order.address}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-1 mb-2">SHIPPING INFO</h3>
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
                                    <th className="py-3 px-4 rounded-tl-xl text-[10px] font-black uppercase tracking-wider">Product details</th>
                                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-center">Qty</th>
                                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-right">Unit Price</th>
                                    <th className="py-3 px-4 rounded-tr-xl text-[10px] font-black uppercase tracking-wider text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-4 px-4 align-top">
                                        <p className="font-black text-lg text-[#1E556E]">{order.name || order.title || "Combo Deal"}</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1">Bundle Size: {order.bundleSize} Pieces | Size: {order.productSize}</p>
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
                            </tbody>
                        </table>
                    </div>

                    {/* Totals & Notes */}
                    <div className="grid grid-cols-12 gap-12 mt-auto">
                        <div className="col-span-7 bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1E556E] mb-3">Order Note / Instructions</h3>
                            <p className="text-sm font-bold text-gray-500 italic leading-relaxed">
                                {order.note || "No special instructions provided."}
                            </p>
                        </div>
                        <div className="col-span-5 space-y-3 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-400">Subtotal:</span>
                                <span className="font-black">৳ {(order.totalAmount - order.shippingCharge)?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-400">Shipping:</span>
                                <span className="font-black">৳ {order.shippingCharge?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-[#1E556E] text-white p-4 rounded-2xl shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-widest">Total Payable</span>
                                <span className="text-3xl font-black">৳ {order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Warning for Courier */}
                    <div className="mt-20 pt-10 border-t-4 border-[#1E556E]/20 flex justify-between items-center grayscale opacity-80">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400">Authorized Signature</p>
                            <div className="w-40 h-10 border-b border-gray-200"></div>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[12px] font-black text-[#1E556E]">IMPORTILA OFFICIAL</p>
                            <p className="text-[8px] font-bold text-gray-400">Dhaka, Bangladesh | +880 1XXX-XXXXXX</p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
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
    )
}
