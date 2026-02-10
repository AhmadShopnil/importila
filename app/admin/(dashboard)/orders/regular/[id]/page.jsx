"use client"

import { use } from "react"

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
    AlertCircle
} from "lucide-react"
import toast from "react-hot-toast"

import {
    useGetOrderQuery,
    useUpdateOrderMutation,
    useLazyCheckCourierStatusQuery
} from "@/lib/redux/api/orderApi"
import InvoicePrint from "@/components/Dashboard/Order/InvoicePrint"

export default function OrderDetailsPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const { id } = params

    const { data: order, isLoading: loading } = useGetOrderQuery(id)
    const [updateOrder, { isLoading: updating }] = useUpdateOrderMutation()
    const [checkCourierStatus] = useLazyCheckCourierStatusQuery()

    const handleUpdateStatus = async (status) => {
        try {
            await updateOrder({ id, status }).unwrap()
            toast.success(`Order status updated to ${status}`)
        } catch (error) {
            toast.error(error.data?.error || "Failed to update status")
        }
    }

    const handleCheckCourierStatus = async () => {
        if (!order?.courierConsignmentId) return
        const toastId = toast.loading("Syncing with courier...")
        try {
            const data = await checkCourierStatus(order.courierConsignmentId).unwrap()
            if (data.status === 200) {
                toast.success(`Sync Complete: ${data.delivery_status}`, { id: toastId })
            } else {
                toast.error("Courier sync failed", { id: toastId })
            }
        } catch (error) {
            toast.error("Network error", { id: toastId })
        }
    }

    if (loading) return <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    if (!order) return <div className="p-10 text-center text-muted-foreground">Order not found</div>

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        confirmed: "bg-blue-100 text-blue-700 border-blue-200",
        shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
        delivered: "bg-green-100 text-green-700 border-green-200",
        cancelled: "bg-red-100 text-red-700 border-red-200"
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders/regular" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Order Details
                            <span className="text-gray-400 font-normal">#{order?.orderNumber}</span>
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.print()}
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
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#1E556E]" />
                                Order Items ({order?.items?.length || 0})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[14px] tracking-widest">
                                    <tr>
                                        <th className="p-4">Product Details</th>
                                        <th className="p-4 text-center">Qty</th>
                                        <th className="p-4 text-right">Price</th>
                                        <th className="p-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-8 h-8 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-[14px] text-gray-400 font-mono mt-0.5">SKU: {item.sku}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center font-medium text-gray-700">x{item.quantity}</td>
                                            <td className="p-4 text-right font-medium text-gray-700">৳ {item.price.toLocaleString()}</td>
                                            <td className="p-4 text-right font-bold text-gray-900">৳ {(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex justify-end">
                                <div className="w-full max-w-[240px] space-y-3">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">৳ {(order?.totalPrice).toLocaleString()}</span>

                                        {/* <span className="font-medium text-gray-900">৳ {(order?.totalAmount - (order.shippingCharge || 0)).toLocaleString()}</span> */}
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Discount</span>
                                        <span className="font-medium text-gray-900">- ৳ {(order?.discount).toLocaleString()}</span>


                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Shipping Fee ({order.deliveryLocation === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                                        <span className={`font-medium ${order.shippingCharge > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                            {order.shippingCharge > 0 ? `+ ৳ ${order.shippingCharge.toLocaleString()}` : 'Free'}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-200 my-2" />
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-black text-[#1E556E]">৳ {order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <CreditCard className="w-5 h-5 text-[#1E556E]" />
                            Payment Information
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Method</p>
                                <p className="font-bold text-gray-800 uppercase">{order.paymentMethod || 'Cash on Delivery'}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                {/* <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-[14px] font-black uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {order.paymentStatus || 'Unpaid'}
                                </span> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer Profile */}
                    <div className="bg-[#1E556E] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{order.customerName}</h4>
                                <p className="text-white/60 text-xs font-medium">Customer Profile</p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4 text-sm font-medium">
                            <div className="flex gap-3">
                                <Phone className="w-4 h-4 text-white/40 mt-0.5" />
                                <p>{order.phone}</p>
                            </div>
                            <div className="flex gap-3">
                                <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
                                <p className="line-clamp-3 leading-relaxed opacity-90">{order.address}</p>
                            </div>
                        </div>

                        {order.note && (
                            <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[14px] uppercase font-black text-white/40 mb-1">Customer Note</p>
                                <p className="text-xs italic opacity-90">"{order.note}"</p>
                            </div>
                        )}
                    </div>

                    {/* Courier Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
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
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Partner</p>
                                    <p className="font-bold text-gray-800">Steadfast Courier</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Consignment ID</p>
                                    <code className="bg-gray-50 px-2 py-1 rounded text-xs text-[#1E556E] font-black border border-gray-100">{order.courierConsignmentId}</code>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="font-black text-xs text-[#1E556E] uppercase">{order.courierStatus || 'Processing'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">Not handed to courier</p>
                                <Link href="/admin/orders/regular" className="text-xs text-[#1E556E] font-bold hover:underline mt-2 inline-block">Go to list to send</Link>
                            </div>
                        )}
                    </div>

                    {/* Risk Card */}
                    {/* <div className="bg-red-50 rounded-2xl border border-red-100 p-6 space-y-4">
                        <h3 className="font-bold text-red-900 flex items-center gap-2 border-b border-red-200/50 pb-4">
                            <Shield className="w-5 h-5" />
                            Security Check
                        </h3>
                        <div className="space-y-2">
                            <p className="text-xs text-red-700/70 font-medium">Verified customer phone and address consistency check.</p>
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-tighter">Phone Verified</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Hidden Printable Invoice Section */}
            <InvoicePrint order={order} />
        </div>
    )
}
