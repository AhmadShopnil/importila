"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Phone, MapPin, Notebook, Plus, Trash2, Search, CheckCircle, X } from "lucide-react"

import { BASE_URL } from "@/utils/baseUrl"

const orderSources = [
    { label: "Website", value: "website" },
    { label: "Facebook", value: "facebook" },
    { label: "WhatsApp", value: "whatsapp" },
    { label: "Direct Call", value: "call" },
    { label: "Whole Sale", value: "wholesale" },
    { label: "Other", value: "other" },
]

export default function ManualOrderEntry() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [combos, setCombos] = useState([])
    const [orderType, setOrderType] = useState("regular") // regular or combo
    const [searchTerm, setSearchTerm] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [selectedProductForVariant, setSelectedProductForVariant] = useState(null)

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
        note: " ",
        orderSource: "facebook",
        items: [],
        totalPrice: 0,
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            if (orderType === "regular") {
                fetchProducts(searchTerm)
            } else {
                fetchCombos(searchTerm)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm, orderType])

    const fetchProducts = async (search = "") => {
        setLoading(true)
        try {
            const url = search
                ? `${BASE_URL}/api/products?search=${encodeURIComponent(search)}&limit=20`
                : `${BASE_URL}/api/products?limit=20`
            const res = await fetch(url)
            const data = await res.json()
            // The API returns an array directly
            setProducts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCombos = async (search = "") => {
        setLoading(true)
        try {
            // Check if combo API supports search, if not we'll filter client side for combos
            // (assuming combos are fewer than products)
            const res = await fetch(`${BASE_URL}/api/combos`)
            const data = await res.json()
            const allCombos = Array.isArray(data) ? data : []

            if (search) {
                setCombos(allCombos.filter(c =>
                    c.title.toLowerCase().includes(search.toLowerCase()) ||
                    c.description?.toLowerCase().includes(search.toLowerCase())
                ))
            } else {
                setCombos(allCombos)
            }
        } catch (error) {
            console.error("Failed to fetch combos:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectItem = (item) => {
        if (orderType === "regular") {
            if (item.variants && item.variants.length > 0) {
                setSelectedProductForVariant(item)
            } else {
                addRegularItem(item)
            }
        } else {
            // Combo selection might also need size
            if (item.sizes && item.sizes.length > 0) {
                setSelectedProductForVariant(item)
            } else {
                addComboItem(item)
            }
        }
    }

    const addRegularItem = (product, variant = null) => {
        const newItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            sku: variant?.sku || product.sku || "N/A",
            design: variant?.design || "",
            color: variant?.color || "",
            size: variant?.size || "",
            image: product.image
        }

        setFormData(prev => {
            const existing = prev.items.find(i => i.productId === newItem.productId && i.sku === newItem.sku)
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i),
                    totalPrice: prev.totalPrice + newItem.price
                }
            }
            return {
                ...prev,
                items: [...prev.items, newItem],
                totalPrice: prev.totalPrice + newItem.price
            }
        })
        setSelectedProductForVariant(null)
    }

    const addComboItem = (combo, size = "") => {
        const newItem = {
            ...combo, // Important to spread the whole combo for the API
            productId: combo._id,
            name: combo.title,
            price: combo.offerPrice || combo.price,
            quantity: 1,
            size: size,
            productType: "combo"
        }

        setFormData(prev => {
            // For manual combo entry, we might only allow one combo or multiple
            const existing = prev.items.find(i => i.productId === newItem.productId && i.size === size)
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i),
                    totalPrice: prev.totalPrice + newItem.price
                }
            }
            return {
                ...prev,
                items: [...prev.items, newItem],
                totalPrice: prev.totalPrice + newItem.price
            }
        })
        setSelectedProductForVariant(null)
    }

    const handleRemoveItem = (index) => {
        setFormData(prev => {
            const item = prev.items[index]
            const newItems = prev.items.filter((_, i) => i !== index)
            return {
                ...prev,
                items: newItems,
                totalPrice: prev.totalPrice - (item.price * item.quantity)
            }
        })
    }

    const handleUpdateQuantity = (index, delta) => {
        setFormData(prev => {
            const newItems = [...prev.items]
            const item = { ...newItems[index] }
            if (item.quantity + delta < 1) return prev

            item.quantity += delta
            newItems[index] = item

            const newTotalPrice = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)

            return {
                ...prev,
                items: newItems,
                totalPrice: newTotalPrice
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.items.length === 0) {
            alert("Please add at least one item")
            return
        }
        if (!formData.customerName || !formData.phone || !formData.address) {
            alert("Please fill in customer details")
            return
        }

        setSubmitting(true)
        try {
            const endpoint = orderType === "regular" ? `${BASE_URL}/api/orders` : `${BASE_URL}/api/orders/combo`

            let payload;
            if (orderType === "regular") {
                payload = {
                    ...formData,
                    productType: "regular",
                    totalItems: formData.items.reduce((sum, item) => sum + item.quantity, 0),
                }
            } else {
                // Combo API usually takes single combo per request based on the component logic
                // But here we might have multiple in items. We'll send the FIRST one as the primary.
                const comboItem = formData.items[0];
                payload = {
                    ...comboItem,
                    customerName: formData.customerName,
                    phone: formData.phone,
                    address: formData.address,
                    note: formData.note,
                    orderSource: formData.orderSource,
                    productType: "combo"
                }
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                alert("Order created successfully!")
                router.push(orderType === "regular" ? "/admin/orders/regular" : "/admin/orders/combos")
            } else {
                const errorData = await res.json()
                alert(`Error: ${errorData.error || "Failed to create order"}`)
            }
        } catch (error) {
            console.error("Failed to create order:", error)
            alert("An error occurred. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    // const filteredItems = (orderType === "regular" ? products : combos).filter(item =>
    //     (item.name || item.title).toLowerCase().includes(searchTerm.toLowerCase())
    // )

    return (
        <div className=" space-y-8 pb-20 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#1E556E]">Manual Order Entry</h1>
                <div className="flex bg-muted p-1 rounded-lg shadow-inner">
                    <button
                        onClick={() => { setOrderType("regular"); setFormData(prev => ({ ...prev, items: [], totalPrice: 0 })) }}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${orderType === "regular" ? "bg-[#1E556E] text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Regular Product
                    </button>
                    <button
                        onClick={() => { setOrderType("combo"); setFormData(prev => ({ ...prev, items: [], totalPrice: 0 })) }}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${orderType === "combo" ? "bg-[#1E556E] text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Combo System
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Product Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <ShoppingCart className="w-5 h-5 text-[#1E556E]" />
                            <h2 className="text-xl font-bold">Select {orderType === "regular" ? "Products" : "Combos"}</h2>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder={`Search ${orderType === "regular" ? 'products' : 'combos'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#1E556E] outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="col-span-full py-10 flex flex-col items-center justify-center text-muted-foreground">
                                    <div className="w-8 h-8 border-4 border-[#1E556E] border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p>Searching {orderType === "regular" ? "products" : "combos"}...</p>
                                </div>
                            ) : (
                                <>
                                    {(orderType === "regular" ? products : combos).map((item) => (
                                        <div
                                            key={item._id}
                                            onClick={() => handleSelectItem(item)}
                                            className="flex items-center gap-4 p-3 border border-border rounded-xl hover:border-[#1E556E] hover:bg-[#1E556E]/5 cursor-pointer transition-all group"
                                        >
                                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border">
                                                <img
                                                    src={item.image || item.featuredImage || "/placeholder.png"}
                                                    alt={item.name || item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold truncate">{item.name || item.title}</h3>
                                                <p className="text-[#1E556E] font-bold">৳ {item.offerPrice || item.price}</p>
                                                {item.variants && item.variants.length > 0 && (
                                                    <p className="text-xs text-muted-foreground">{item.variants.length} Variants Available</p>
                                                )}
                                                {item.sizes && item.sizes.length > 0 && (
                                                    <p className="text-xs text-muted-foreground">{item.sizes.length} Sizes Available</p>
                                                )}
                                            </div>
                                            <div className="bg-[#1E556E]/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Plus className="w-4 h-4 text-[#1E556E]" />
                                            </div>
                                        </div>
                                    ))}
                                    {(orderType === "regular" ? products : combos).length === 0 && (
                                        <p className="col-span-full text-center py-10 text-muted-foreground">No {orderType === "regular" ? "products" : "combos"} found</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Selected Items Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        {formData.items.length === 0 ? (
                            <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed border-border text-muted-foreground">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Add items from the list above</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors">
                                        <div className="flex-1">
                                            <h4 className="font-bold">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {item.design && <span className="mr-2">Design: {item.design}</span>}
                                                {item.color && <span className="mr-2">Color: {item.color}</span>}
                                                {item.size && <span>Size: {item.size}</span>}
                                            </p>
                                            <p className="text-[#1E556E] font-medium">৳ {item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-3 bg-white border border-border rounded-lg p-1">
                                                <button
                                                    onClick={() => handleUpdateQuantity(index, -1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-muted font-bold text-lg rounded-md"
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(index, 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-muted font-bold text-lg rounded-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="w-24 text-right font-bold text-lg">৳ {(item.price * item.quantity).toLocaleString()}</p>
                                            <button
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-6 border-t-2 border-border flex justify-between items-center">
                                    <span className="text-lg font-semibold text-muted-foreground">Subtotal</span>
                                    <span className="text-3xl font-extrabold text-[#1E556E]">৳ {formData.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Customer Details & Order Source */}
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-border p-8 space-y-6 sticky top-8">
                        <h2 className="text-xl font-bold mb-4">Customer Details</h2>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    <User className="w-4 h-4" /> CUSTOMER NAME
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    placeholder="e.g. Abdullah Al Mamun"
                                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#1E556E] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> PHONE NUMBER
                                </label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#1E556E] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> DELIVERY ADDRESS
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter full address..."
                                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#1E556E] outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    <Notebook className="w-4 h-4" /> ORDER NOTE
                                </label>
                                <input
                                    type="text"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    placeholder="Additional information..."
                                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#1E556E] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className="text-sm font-semibold text-muted-foreground">ORDER SOURCE</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {orderSources.map((source) => (
                                        <button
                                            key={source.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, orderSource: source.value })}
                                            className={`px-3 py-2 text-sm font-medium rounded-xl border transition-all ${formData.orderSource === source.value
                                                ? "bg-[#1E556E] text-white border-[#1E556E] shadow-md shadow-[#1E556E]/20"
                                                : "border-border hover:bg-muted/50 text-muted-foreground"
                                                }`}
                                        >
                                            {source.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#1E556E] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-[#1E556E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {submitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" /> Confirm & Place Order
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Variant Selection Modal */}
            {selectedProductForVariant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold">Select {orderType === "regular" ? "Variant" : "Size"}</h3>
                            <button onClick={() => setSelectedProductForVariant(null)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <img src={selectedProductForVariant.image || selectedProductForVariant.featuredImage} className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <p className="font-bold text-lg">{selectedProductForVariant.name || selectedProductForVariant.title}</p>
                                    <p className="text-[#1E556E] font-bold">৳ {selectedProductForVariant.offerPrice || selectedProductForVariant.price}</p>
                                </div>
                            </div>

                            {orderType === "regular" ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedProductForVariant.variants.map((variant, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => addRegularItem(selectedProductForVariant, variant)}
                                            className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-[#1E556E] hover:bg-[#1E556E]/5 text-left transition-all"
                                        >
                                            <div>
                                                <p className="font-semibold">{variant.design} {variant.color}</p>
                                                <p className="text-sm text-muted-foreground">Size: {variant.size} | SKU: {variant.sku}</p>
                                            </div>
                                            <Plus className="w-5 h-5 text-[#1E556E]" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedProductForVariant.sizes.map((size, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => addComboItem(selectedProductForVariant, size)}
                                            className="p-4 border border-border rounded-xl hover:border-[#1E556E] hover:bg-[#1E556E]/5 font-bold transition-all text-center"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
        </div>
    )
}
