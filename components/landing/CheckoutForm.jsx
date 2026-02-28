"use client";

import { Package, MapPin, Phone, User, FileText, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useBundle } from "@/context/BundleContext";
import { bundleOptions } from "@/data/products";
import { trackBeginCheckout, trackPurchase, trackAddShippingInfo } from "@/utils/gtm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CheckoutForm = ({ combo }) => {
    const router = useRouter();
    const { state, updateCustomerInfo, isComplete } = useBundle();
    const { slots, selectedBundle, selectedSize, customerInfo, selectedBundleData } = state;
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Use selectedBundleData from state if available, otherwise find from bundleOptions as fallback
    const selectedBundleOption = selectedBundleData || bundleOptions.find(
        (b) => b.pieces === selectedBundle
    );

    const [shippingRates, setShippingRates] = useState({ inside: 60, outside: 120 });
    const [deliveryLocation, setDeliveryLocation] = useState("inside"); // Default to inside

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    if (data?.shipping) {
                        setShippingRates({
                            inside: Number(data?.shipping?.insideDhaka) || 60,
                            outside: Number(data?.shipping?.outsideDhaka) || 120
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch shipping settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const bundlePrice = selectedBundleOption?.price || 0;

    //  shipping charge based on isShippingChargeable flag
    // If flag is true, use selected location rate. If false, free (0).
    const isShippingChargeable = selectedBundleOption?.isShippingChargeable === true;
    const shippingCharge = isShippingChargeable
        ? (deliveryLocation === "inside" ? shippingRates?.inside : shippingRates?.outside)
        : 0;

    const totalAmount = bundlePrice + shippingCharge;

    useEffect(() => {
        if (slots?.length > 0) {
            const items = slots.filter(s => s.product).map(s => ({
                ...s.product,
                quantity: 1,
                selectedColor: s.selectedColor
            }));
            if (items.length > 0) {
                trackBeginCheckout(items, totalAmount);
            }
        }
    }, [slots, totalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Phone validation: exactly 11 digits
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(customerInfo.phone)) {
            alert("Please enter a valid 11-digit phone number.");
            return;
        }


        if (!isComplete || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const items = slots.filter(s => s.product).map(s => ({
                ...s.product,
                quantity: 1,
                selectedColor: s.selectedColor
            }));

            trackAddShippingInfo(items, totalAmount, shippingCharge === 0 ? "Free Shipping" : "Standard Shipping");

            const orderData = {
                customerName: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                deliveryLocation: deliveryLocation,
                note: customerInfo.note,

                items: slots.map(slot => ({
                    productId: slot.product._id || slot.product.id,
                    name: slot.product.name,
                    color: slot.selectedColor,
                    image: slot.product.featuredImage || slot.product.image,
                    price: bundlePrice / selectedBundle
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
                const responseData = await response.json();
                const purchaseItems = slots.filter(s => s.product).map(s => ({
                    ...s.product,
                    quantity: 1,
                    selectedColor: s.selectedColor
                }));
                trackPurchase(responseData.orderId || responseData.result?.insertedId || 'order_' + Date.now(), totalAmount, purchaseItems);

                // Redirect to thank you page
                router.push("/thank-you");
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || "Failed to place order"}`);
            }
        } catch (error) {
            console.error("Order submission error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false); //  STOP LOADING
        }
    };

    const filledSlots = slots.filter((slot) => slot.product !== null);

    // if (!selectedBundle) return null;

    return (
        <section className="pb-20 pt-8 md:pt-14 md:pb-10  bg-background" id="checkout-section">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1E556E] mb-2">
                            {combo?.checkoutFormTitle || "Complete Your Order"}
                        </h2>
                        <p className="text-muted-foreground">
                            {combo?.checkoutFormSubtitle || "Fill in your details and we'll get your bundle ready"}
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
                                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border/50">
                                    <span className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Select Location</span>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="deliveryLocation"
                                                value="inside"
                                                checked={deliveryLocation === "inside"}
                                                onChange={() => setDeliveryLocation("inside")}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-base">Inside Dhaka</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="deliveryLocation"
                                                value="outside"
                                                checked={deliveryLocation === "outside"}
                                                onChange={() => setDeliveryLocation("outside")}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-base">Outside Dhaka</span>
                                        </label>
                                    </div>
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
                                                <div className="relative w-10 h-10 flex-shrink-0">
                                                    <Image
                                                        src={slot.product?.featuredImage || slot.product?.image}
                                                        alt={slot.product?.name || "Product"}
                                                        fill
                                                        className="rounded-lg object-cover"
                                                        sizes="40px"
                                                    />
                                                </div>
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
                                    minLength={11}
                                    maxLength={11}
                                    pattern="\d{11}"
                                    onChange={(e) => updateCustomerInfo("phone", e.target.value.replace(/\D/g, ''))}
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
                            <div className="flex flex-col gap-2 px-1">
                                <span className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Select Location</span>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryLocation"
                                            value="inside"
                                            checked={deliveryLocation === "inside"}
                                            onChange={() => setDeliveryLocation("inside")}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <span className="text-base">Inside Dhaka </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryLocation"
                                            value="outside"
                                            checked={deliveryLocation === "outside"}
                                            onChange={() => setDeliveryLocation("outside")}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <span className="text-base">Outside Dhaka</span>
                                    </label>
                                </div>
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
                                disabled={!isComplete || isSubmitting}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${isComplete && !isSubmitting
                                    ? "gradient-cta text-accent-foreground shadow-cta hover:scale-[1.02]"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        {combo?.checkoutCTA || "Place Order"}
                                    </>
                                )}
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
