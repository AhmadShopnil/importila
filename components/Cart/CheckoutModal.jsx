"use client"

import { useCart } from "@/context/CartContext"
import { X, CheckCircle, User, Phone, MapPin, FileText, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { BASE_URL } from "@/utils/baseUrl"
import { trackBeginCheckout, trackPurchase, trackAddShippingInfo } from "@/utils/gtm"

const CheckoutModal = ({ isOpen, onClose, items, total }) => {
    const { clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [deliveryLocation, setDeliveryLocation] = useState("inside") // "inside" or "outside"
    const [shippingRates, setShippingRates] = useState({ inside: 60, outside: 120 })
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        note: ""
    })

    // Fetch shipping rates from settings
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/settings`)
                if (res.ok) {
                    const data = await res.json()
                    setShippingRates({
                        inside: data.insideDhakaCharge || 60,
                        outside: data.outsideDhakaCharge || 120
                    })
                }
            } catch (err) {
                console.error("Failed to fetch shipping rates", err)
            }
        }
        if (isOpen) fetchRates()
    }, [isOpen])

    useEffect(() => {
        if (isOpen && items?.length > 0) {
            trackBeginCheckout(items, total)
        }
    }, [isOpen, items, total])

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const shippingCharge = totalItems >= 3 ? 0 : (deliveryLocation === "inside" ? shippingRates.inside : shippingRates.outside)
    const finalTotal = total + shippingCharge

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Phone validation: exactly 11 digits
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(customerInfo.phone)) {
            alert("Please enter a valid 11-digit phone number.")
            return
        }

        setLoading(true)

        try {
            trackAddShippingInfo(items, finalTotal, deliveryLocation === "inside" ? "Inside Dhaka" : "Outside Dhaka")

            const orderData = {
                customerName: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                note: customerInfo.note,
                deliveryLocation,
                shippingCharge,
                items: items.map(item => ({
                    productId: item._id || item.id,
                    name: item.name,
                    color: item.selectedColor,
                    size: item.selectedSize,
                    sku: item.sku,
                    image: item.featuredImage || item.image,
                    price: item.offerPrice || item.price,
                    quantity: item.quantity
                })),
                totalAmount: finalTotal,
                productType: "regular",
                status: "pending"
            }

            const response = await fetch(`${BASE_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            })

            if (response.ok) {
                const data = await response.json()
                trackPurchase(data.orderId || data.result?.insertedId || 'order_' + Date.now(), finalTotal, items)
                alert("Order placed successfully! We will contact you shortly.")
                clearCart()
                onClose()
                window.location.href = "/thank-you"
            } else {
                const error = await response.json()
                alert(`Error: ${error.error || "Failed to place order"}`)
            }
        } catch (error) {
            console.error("Order submission error:", error)
            alert("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-background w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    {/* Order Summary (Mobile hidden or top) */}
                    <div className="w-full md:w-[250px] bg-muted/50 p-6 border-b md:border-b-0 md:border-r border-border overflow-y-auto hidden md:block">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Summary
                        </h3>
                        <div className="space-y-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <img
                                        src={item.featuredImage || "/placeholder.svg"}
                                        className="w-10 h-10 rounded-lg object-cover bg-background"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{item.quantity} x ৳{item.offerPrice || item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-4 border-t border-border space-y-2">
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                <span>Subtotal</span>
                                <span>৳{total}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                <span>Shipping</span>
                                <span>{shippingCharge === 0 ? "FREE" : `৳${shippingCharge}`}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-border/50">
                                <span className="text-xs font-bold">Total</span>
                                <span className="text-lg font-black text-primary">৳{finalTotal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-foreground">Checkout</h2>
                                <p className="text-xs text-muted-foreground">Please fill in your delivery details</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Location Selection */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryLocation("inside")}
                                    className={`py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${deliveryLocation === "inside" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                                >
                                    <span className={`text-xs font-black ${deliveryLocation === "inside" ? "text-primary" : "text-muted-foreground"}`}>Inside Dhaka</span>
                                    <span className="text-[10px] font-bold opacity-70">৳{shippingRates.inside}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryLocation("outside")}
                                    className={`py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${deliveryLocation === "outside" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                                >
                                    <span className={`text-xs font-black ${deliveryLocation === "outside" ? "text-primary" : "text-muted-foreground"}`}>Outside Dhaka</span>
                                    <span className="text-[10px] font-bold opacity-70">৳{shippingRates.outside}</span>
                                </button>
                            </div>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Full Name *"
                                    required
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    required
                                    minLength={11}
                                    maxLength={11}
                                    pattern="\d{11}"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value.replace(/\D/g, '') })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-4 top-5 text-muted-foreground w-4 h-4" />
                                <textarea
                                    placeholder="Full Delivery Address *"
                                    required
                                    rows={3}
                                    value={customerInfo.address}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium resize-none"
                                />
                            </div>

                            <div className="relative">
                                <FileText className="absolute left-4 top-5 text-muted-foreground w-4 h-4" />
                                <textarea
                                    placeholder="Additional Order Notes (Optional)"
                                    rows={2}
                                    value={customerInfo.note}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                >
                                    {loading ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Confirm Order - ৳{finalTotal}
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-center text-muted-foreground mt-4 italic">
                                    {totalItems >= 3 ? "Free shipping applied for 3+ items!" : "Flat shipping rates applied based on location."}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutModal
