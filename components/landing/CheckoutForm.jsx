"use client";

import { Package, MapPin, Phone, User, FileText, CheckCircle } from "lucide-react";
import { useBundle } from "@/context/BundleContext";
import { bundleOptions } from "@/data/products";

const CheckoutForm = () => {
    const { state, updateCustomerInfo, isComplete } = useBundle();
    const { slots, selectedBundle, selectedSize, customerInfo, selectedBundleData } = state;

    // Use selectedBundleData from state if available, otherwise find from bundleOptions as fallback
    const selectedBundleOption = selectedBundleData || bundleOptions.find(
        (b) => b.pieces === selectedBundle
    );

    const bundlePrice = selectedBundleOption?.price || 0;
    const shippingCharge = selectedBundleOption?.shippingCharge || 0;
    const totalAmount = bundlePrice + shippingCharge;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isComplete) return;

        try {
            const orderData = {
                customerName: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                note: customerInfo.note,
                items: slots.map(slot => ({
                    productId: slot.product._id || slot.product.id,
                    name: slot.product.name,
                    color: slot.selectedColor,
                    image: slot.product.featuredImage || slot.product.image,
                    price: bundlePrice / selectedBundle // Rough estimate per item
                })),
                totalAmount: totalAmount,
                price: bundlePrice,
                shippingCharge: shippingCharge,
                bundleSize: selectedBundle,
                productSize: selectedSize,
                productType: "combo",
                status: "pending"
            };

            const response = await fetch("/api/orders/combo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                alert("Order placed successfully! We will contact you shortly.");
                // Clear context or redirect
                window.location.href = "/thank-you"; // Or wherever you want
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || "Failed to place order"}`);
            }
        } catch (error) {
            console.error("Order submission error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const filledSlots = slots.filter((slot) => slot.product !== null);

    // if (!selectedBundle) return null;

    return (
        <section className="py-16 bg-background" id="checkout-section">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Complete Your Order
                        </h2>
                        <p className="text-muted-foreground">
                            Fill in your details and we'll get your bundle ready
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <div className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card h-fit">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Package className="text-primary" size={20} />
                                Order Summary
                            </h3>

                            <div className="mb-4 pb-4 border-b border-border">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Bundle Size</span>
                                    <span className="font-semibold">{selectedBundle} Pieces</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Selected Size</span>
                                    <span className="font-semibold">{selectedSize || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Bundle Price</span>
                                    <span className="font-semibold">৳{bundlePrice}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping Charge</span>
                                    <span className="font-semibold">{shippingCharge === 0 ? "Free" : `৳${shippingCharge}`}</span>
                                </div>
                            </div>

                            {/* Selected Items */}
                            {filledSlots.length > 0 && (
                                <div className="mb-4 pb-4 border-b border-border">
                                    <p className="text-sm font-semibold text-foreground mb-3">
                                        Selected Items ({filledSlots.length}/{selectedBundle})
                                    </p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {filledSlots.map((slot, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                                            >
                                                <img
                                                    src={slot.product?.featuredImage || slot.product?.image}
                                                    alt={slot.product?.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {slot.product?.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Color: {slot.selectedColor}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-foreground">Total</span>
                                <span className="text-2xl font-extrabold text-primary">
                                    ৳{totalAmount}
                                </span>
                            </div>
                        </div>

                        {/* Customer Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    value={customerInfo.name}
                                    onChange={(e) => updateCustomerInfo("name", e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-0 outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Phone
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    size={18}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={customerInfo.phone}
                                    onChange={(e) => updateCustomerInfo("phone", e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-0 outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <MapPin
                                    className="absolute left-4 top-4 text-muted-foreground"
                                    size={18}
                                />
                                <textarea
                                    placeholder="Delivery Address *"
                                    value={customerInfo.address}
                                    onChange={(e) => updateCustomerInfo("address", e.target.value)}
                                    rows={3}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-0 outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <FileText
                                    className="absolute left-4 top-4 text-muted-foreground"
                                    size={18}
                                />
                                <textarea
                                    placeholder="Additional Notes (optional)"
                                    value={customerInfo.note}
                                    onChange={(e) => updateCustomerInfo("note", e.target.value)}
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-0 outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!isComplete}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${isComplete
                                    ? "gradient-cta text-accent-foreground shadow-cta hover:scale-[1.02]"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                                    }`}
                            >
                                <CheckCircle size={20} />
                                Place Order
                            </button>

                            {!isComplete && (
                                <p className="text-center text-sm text-muted-foreground">
                                    Please complete all required fields to place your order
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutForm;
