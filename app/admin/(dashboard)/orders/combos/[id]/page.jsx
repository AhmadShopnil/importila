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
    Gem,
    X,
    Edit2,
    Check,
    Save
} from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

import {
    useGetOrderQuery,
    useUpdateOrderMutation,
    useLazyCheckCourierStatusQuery
} from "@/lib/redux/api/orderApi"
import InvoicePrint from "@/components/Dashboard/Order/InvoicePrint"

export default function ComboOrderDetailsPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const { id } = params

    const { data: order, isLoading: loading } = useGetOrderQuery(id)
    const [updateOrder, { isLoading: updating }] = useUpdateOrderMutation()
    const [checkCourierStatus] = useLazyCheckCourierStatusQuery()
    const [selectedImage, setSelectedImage] = useState(null)

    // Edit states
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [editedAddress, setEditedAddress] = useState("")

    const [isEditingGlobalSize, setIsEditingGlobalSize] = useState(false)
    const [editedGlobalSize, setEditedGlobalSize] = useState("")

    const handleUpdateStatus = async (status) => {
        try {
            await updateOrder({ id, status }).unwrap()
            toast.success(`Order status updated to ${status}`)
        } catch (error) {
            toast.error(error.data?.error || "Failed to update status")
        }
    }

    const handleUpdateAddress = async () => {
        try {
            await updateOrder({ id, address: editedAddress }).unwrap()
            setIsEditingAddress(false)
            toast.success("Address updated successfully")
        } catch (error) {
            toast.error("Failed to update address")
        }
    }

    const handleUpdateGlobalSize = async () => {
        try {
            const updateData = { id, productSize: editedGlobalSize }
            if (order.items) updateData.items = order.items.map(i => ({ ...i, size: editedGlobalSize }))
            if (order.products) updateData.products = order.products.map(p => ({ ...p, size: editedGlobalSize }))

            await updateOrder(updateData).unwrap()
            setIsEditingGlobalSize(false)
            toast.success("Product size updated successfully")
        } catch (error) {
            toast.error("Failed to update size")
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
        cancelled: "bg-red-100 text-red-700 border-red-200",
        returned: "bg-gray-200 text-gray-700 border-gray-300"
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
                        {["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"].map(s => (
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
                        <div className="p-6 border-b border-indigo-50 flex flex-wrap items-center justify-between bg-indigo-50/30">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-lg">

                                Bundle Size :  {orderItems?.length || 1} Pieces
                            </h3>
                            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 group/size relative">
                                <h1 className="font-bold text-indigo-900 flex items-center gap-2 text-lg">
                                    Product Size: {isEditingGlobalSize ? (
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={editedGlobalSize}
                                                onChange={(e) => setEditedGlobalSize(e.target.value)}
                                                className="w-20 px-2 py-0.5 border-2 border-indigo-200 rounded text-sm focus:ring-0 focus:outline-none"
                                                placeholder="e.g. 5-6"
                                            />
                                            <span className="text-gray-400 text-sm">Years</span>
                                            <button
                                                onClick={handleUpdateGlobalSize}
                                                className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                                                title="Save"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setIsEditingGlobalSize(false)}
                                                className="p-1 border border-indigo-200 text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                                                title="Cancel"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {order?.productSize} Years
                                            <button
                                                onClick={() => {
                                                    setEditedGlobalSize(order.productSize)
                                                    setIsEditingGlobalSize(true)
                                                }}
                                                className="p-1 hover:bg-indigo-50 rounded text-indigo-400 opacity-0 group-hover/size:opacity-100 transition-all"
                                                title="Edit Size"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </h1>
                            </div>
                            <span className="text-[10px] font-black uppercase bg-indigo-600 text-white px-2 py-0.5 rounded shadow">Combo Offer</span>
                        </div>
                        <div className="overflow-x-auto">
                            {orderItems.length > 0 ? (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-base tracking-widest">
                                        <tr>
                                            <th className="p-4">Product Details</th>
                                            <th className="p-4 text-center">Qty</th>
                                            <th className="p-4 text-right">Unit Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orderItems?.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-indigo-50/20 transition-colors">
                                                <td className="p-4 flex  gap-4">
                                                    <div
                                                        className="w-18 h-18 md:w-28 md:h-28 bg-gray-100 rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50 cursor-zoom-in relative"
                                                        onClick={() => setSelectedImage(item?.image || item.mainImage)}
                                                    >
                                                        {item?.image || item.mainImage ? (
                                                            <Image
                                                                src={item?.image || item.mainImage}
                                                                alt={item.name || item.title}
                                                                fill
                                                                className="object-cover hover:scale-110 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <Package className="w-8 h-8 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div className="">
                                                        <p className="font-bold text-base text-gray-900">{item.name || item.title || "Selected Item"}</p>
                                                        <div className="flex items-center gap-2 mt-1 ">
                                                            {item.sku && <p className="text-base text-gray-400 font-mono">SKU: {item.sku}</p>}
                                                            {item.size && <span className="text-base bg-gray-100 px-1.5 py-0.5 rounded font-bold uppercase">Size: {item.size}</span>}
                                                            {item.color && <span className="text-base bg-gray-100 px-1.5 py-0.5 rounded font-bold uppercase">Color: {item.color}</span>}
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
                            <div className="flex gap-3 text-base">
                                <Phone className="w-4 h-4 text-white/40 mt-0.5" />
                                <p>{order.phone}</p>
                            </div>
                            <div className="flex gap-3 text-base group/address relative">
                                <MapPin className="w-4 h-4 text-white/40 mt-1" />
                                {isEditingAddress ? (
                                    <div className="flex-1 space-y-2">
                                        <textarea
                                            value={editedAddress}
                                            onChange={(e) => setEditedAddress(e.target.value)}
                                            className="w-full text-sm bg-white/10 border border-white/20 rounded p-2 focus:outline-none focus:ring-1 focus:ring-white/40 text-white"
                                            rows="3"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUpdateAddress}
                                                className="px-2 py-1 bg-white text-[#1E556E] rounded text-xs font-bold flex items-center gap-1"
                                            >
                                                <Check className="w-3 h-3" /> Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditingAddress(false)}
                                                className="px-2 py-1 text-white border border-white/20 rounded text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start flex-1 gap-2">
                                        <p className="text-base leading-relaxed opacity-90">{order?.address}</p>
                                        <button
                                            onClick={() => {
                                                setEditedAddress(order.address)
                                                setIsEditingAddress(true)
                                            }}
                                            className="p-1 hover:bg-white/10 rounded-md transition-all opacity-0 group-hover/address:opacity-100"
                                            title="Edit Address"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {order?.note && (
                            <div className="mt-6 p-4 bg-white/5 rounded-md border border-white/10 backdrop-blur-sm">
                                <p className="text-base uppercase font-black text-whitemb-1">Bundle Note</p>
                                <p className="text-base italic opacity-90">"{order?.note}"</p>
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
            <InvoicePrint order={order} />

            {/* Image Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div
                        className="relative w-full max-w-4xl aspect-[4/5] md:aspect-auto md:h-[85vh] bg-transparent rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedImage}
                            alt="Large product preview"
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 1024px) 100vw, 80vw"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
