"use client"

import { useCart } from "@/context/CartContext"
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import CheckoutModal from "./CheckoutModal"

const CartDrawer = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        cartTotal,
        updateQuantity,
        removeFromCart
    } = useCart()

    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isCartOpen])

    const handleCheckout = () => {
        setIsCheckoutModalOpen(true)
    }

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-[101] transition-transform duration-500 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-foreground">Shopping Cart</h2>
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {cartItems.length} Items
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Free Shipping Incentive */}
                    {cartItems.length > 0 && (
                        <div className="mx-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black uppercase tracking-tighter text-primary">
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0) >= 3
                                        ? "🎉 Free Shipping Applied!"
                                        : `Add ${3 - cartItems.reduce((acc, item) => acc + item.quantity, 0)} more items for Free Shipping`}
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground">Threshold: 3 Items</p>
                            </div>
                            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{ width: `${Math.min((cartItems.reduce((acc, item) => acc + item.quantity, 0) / 3) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        {cartItems.length > 0 ? (
                            <div className="space-y-6">
                                {cartItems.map((item, index) => (
                                    <div key={`${item._id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4 group">
                                        <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-muted border border-border/50 flex-shrink-0">
                                            <img
                                                src={item.featuredImage || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(index)}
                                                    className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-2">
                                                {item.selectedColor && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full border border-border" style={{ backgroundColor: item.selectedColorHex }} />
                                                        {item.selectedColor}
                                                    </span>
                                                )}
                                                {item.selectedSize && <span>| Size: {item.selectedSize}</span>}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-border rounded-lg p-1 bg-muted/50">
                                                    <button
                                                        onClick={() => updateQuantity(index, -1)}
                                                        className="p-1 hover:text-primary transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(index, 1)}
                                                        className="p-1 hover:text-primary transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-primary">
                                                        ৳{(item.offerPrice || item.price) * item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-20" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h3>
                                <p className="text-muted-foreground mb-8 max-w-[250px]">
                                    Looks like you haven't added anything to your cart yet.
                                </p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-border bg-muted/30">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-muted-foreground font-bold">Total Amount</p>
                                <p className="text-2xl font-black text-primary">৳{cartTotal}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                                >
                                    Buy Now <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                items={cartItems}
                total={cartTotal}
            />
        </>
    )
}

export default CartDrawer
