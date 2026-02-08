"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ShoppingCart, Zap, Heart, Share2, Check, Minus, Plus, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react"
import Container from "@/components/Container"
import { useCart } from "@/context/CartContext"
import CheckoutModal from "@/components/Cart/CheckoutModal"
import { trackViewItem } from "@/utils/gtm"
import SizeChartProductPage from "./SizeChartProductPage"

const ProductDetailsClient = ({ product }) => {
    const { addToCart } = useCart()
    const [selectedImage, setSelectedImage] = useState(product.featuredImage)
    const [quantity, setQuantity] = useState(1)
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

    useEffect(() => {
        if (product) {
            trackViewItem(product)
        }
    }, [product])

    // Derived State for Variants
    const allVariants = product.variants || []

    // 1. Get Unique Sizes
    const uniqueSizes = useMemo(() => {
        const sizes = allVariants.map(v => v.size)
        return [...new Set(sizes)]
    }, [allVariants])

    const searchParams = useSearchParams()
    const colorFromQuery = searchParams.get("color")

    const [selectedSize, setSelectedSize] = useState(() => {
        if (colorFromQuery) {
            const variantWithColor = allVariants.find(v => v.colorName === colorFromQuery)
            if (variantWithColor) return variantWithColor.size
        }
        return uniqueSizes[0] || null
    })

    // 2. Get Available Colors for Selected Size
    const availableColorsForSize = useMemo(() => {
        if (!selectedSize) return []
        return allVariants.filter(v => v.size === selectedSize)
    }, [allVariants, selectedSize])

    const [selectedColorName, setSelectedColorName] = useState(colorFromQuery || availableColorsForSize[0]?.colorName || null)

    // Sync color when size changes
    useEffect(() => {
        if (selectedSize) {
            const colors = allVariants.filter(v => v.size === selectedSize)
            const exists = colors.find(c => c.colorName === selectedColorName)
            if (!exists && colors.length > 0) {
                setSelectedColorName(colors[0].colorName)
            }
        }
    }, [selectedSize])

    // 3. Get the Final Selected Variant SKU/Object
    const selectedVariant = useMemo(() => {
        return allVariants.find(v => v.size === selectedSize && v.colorName === selectedColorName)
    }, [allVariants, selectedSize, selectedColorName])

    useEffect(() => {
        if (selectedVariant?.image) {
            setSelectedImage(selectedVariant.image)
        }
    }, [selectedVariant])

    const allImages = useMemo(() => {
        return [product.featuredImage, ...(product.images || [])].filter(Boolean)
    }, [product])

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColorName || !selectedVariant) {
            alert("Please select size and color")
            return
        }
        addToCart(product, {
            colorName: selectedVariant.colorName,
            colorHex: selectedVariant.colorHex,
            size: selectedVariant.size,
            sku: selectedVariant.sku
        }, quantity)
    }

    const handleBuyNow = () => {
        if (!selectedSize || !selectedColorName || !selectedVariant) {
            alert("Please select size and color")
            return
        }
        setIsCheckoutModalOpen(true)
    }

    const buyNowItems = useMemo(() => ([{
        ...product,
        selectedColor: selectedVariant?.colorName,
        selectedColorHex: selectedVariant?.colorHex,
        selectedSize: selectedVariant?.size,
        sku: selectedVariant?.sku,
        quantity: quantity
    }]), [product, selectedVariant, quantity])

    return (
        <section className="py-8 md:py-16 bg-background">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
                    {/* Left: Image Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted border border-border shadow-soft group">
                            <img
                                src={selectedImage || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {product.offerPrice > 0 && (
                                <div className="absolute top-6 left-6 bg-primary text-primary-foreground text-xs font-black px-4 py-2 rounded-full shadow-large animate-slide-up">
                                    SAVE ৳{product.price - product.offerPrice}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-border opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">(4.9 • 120 Reviews)</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">{product.name}</h1>

                            <div className="flex items-end gap-3 mb-6">
                                {product.offerPrice > 0 ? (
                                    <>
                                        <span className="text-4xl font-black text-primary">৳{product.offerPrice}</span>
                                        <span className="text-xl text-muted-foreground line-through mb-1 opacity-50 font-bold">৳{product.price}</span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-black text-foreground">৳{product.price}</span>
                                )}
                            </div>

                            <p className="text-muted-foreground leading-relaxed text-balance">
                                {product.description || "Elevate your child's style with our premium quality collection. Designed for comfort and durability without compromising on the latest fashion trends."}
                            </p>
                        </div>

                        {/* Variants Selection */}
                        <div className="space-y-8 mb-10">
                            {/* Sizes */}
                            {uniqueSizes.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest">1. Select Size (Years)</h3>
                                        {selectedSize && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1
                                         rounded-md">Size: {selectedSize}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {uniqueSizes?.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedSize(s)}
                                                className={`px-4 py-1.5 md:px-6 md:py-3 cursor-pointer rounded-md text-sm font-black transition-all duration-300
                                                     ${selectedSize === s ? 'bg-[#1C546D] text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'bg-muted/50 border border-border hover:border-primary text-muted-foreground hover:bg-muted'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Colors */}
                            {availableColorsForSize.length > 0 && (
                                <div className="animate-slide-up">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest">2. Select Color</h3>
                                        {selectedColorName && <span className="text-primary font-bold text-sm">{selectedColorName}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {availableColorsForSize.map((v, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedColorName(v.colorName)}
                                                className={`group relative p-1 rounded-full border-2 transition-all duration-300 ${selectedColorName === v.colorName ? 'border-primary scale-110' : 'border-transparent hover:border-border'}`}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full shadow-inner border border-black/5"
                                                    style={{ backgroundColor: v.colorHex }}
                                                />
                                                {selectedColorName === v.colorName && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <Check className={`w-5 h-5 ${['#ffffff', '#fff', 'white', '#fff824'].includes(v.colorHex.toLowerCase()) ? 'text-black' : 'text-white'}`} />
                                                    </div>
                                                )}

                                                {/* Tooltip or Label on hover */}
                                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded pointer-events-none z-10">
                                                    {v.colorName}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-4">3. Quantity</h3>
                                <div className="flex items-center w-fit border-2 border-border rounded-2xl bg-muted/30 p-1">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 py-2 md:py-3 px-8 border-2 border-primary text-primary font-black rounded-md flex 
                                items-center justify-center gap-2 hover:bg-primary/5 transition-all active:scale-95 cursor-pointer"
                            >
                                <ShoppingCart className="w-5 h-5" /> Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-2.5 md:py-3 px-8 bg-[#1C546D] text-primary-foreground font-black rounded-md flex 
                                items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-primary/30 
                                active:scale-95 cursor-pointer"
                            >
                                Buy It Now
                            </button>
                        </div>

                        {/* Information Grid */}
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-t border-border mt-auto">
                            <div className="flex items-center gap-3 p-4 rounded-md bg-muted/30">
                                <Truck className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-xs font-black">Free Shipping</p>
                                    <p className="text-[10px] text-muted-foreground">On all orders above ৳1500</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-xs font-black">Secure Checkout</p>
                                    <p className="text-[10px] text-muted-foreground">SSL Encrypted Payments</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </Container>
            <SizeChartProductPage />
            {/* Rich Content / Product Details Section */}
            {product.richDescription && (
                <div className="border-t border-border py-6 md:py-10 bg-muted/5">
                    <Container>
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-black uppercase tracking-widest mb-3 md:mb-6 text-center">Product Detail</h2>
                            <div
                                className="rich-content-area break-words overflow-x-hidden
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4
                                [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl
                                [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg
                                [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full
                                [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4
                                [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3
                                [&_p]:mb-4 [&_p]:leading-relaxed
                                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4"
                                dangerouslySetInnerHTML={{ __html: product.richDescription }}
                            />
                        </div>
                    </Container>
                </div>
            )}

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                items={buyNowItems}
                total={(product.offerPrice || product.price) * quantity}
            />
        </section>
    )
}

export default ProductDetailsClient
