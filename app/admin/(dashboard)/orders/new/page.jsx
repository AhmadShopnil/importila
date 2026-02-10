"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Phone, MapPin, Notebook, Plus, Trash2, Search, CheckCircle, X, Printer, List, Package } from "lucide-react"

import { BASE_URL } from "@/utils/baseUrl"
import InvoicePrint from "@/components/Dashboard/Order/InvoicePrint"

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
    const [createdOrder, setCreatedOrder] = useState(null)
    const [selectedProductForVariant, setSelectedProductForVariant] = useState(null)
    const [activeSlotIndex, setActiveSlotIndex] = useState(null)
    const [activeColorTab, setActiveColorTab] = useState("All")

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
        note: "",
        orderSource: "facebook",
        deliveryLocation: "inside",
        shippingCharge: 60,
        items: [],
        totalPrice: 0, // This will be subtotal
        discount: 0,
        totalAmount: 0, // This will be subtotal + shipping - discount
    })

    const [shippingRates, setShippingRates] = useState({ inside: 60, outside: 120 })

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
        fetchRates()
    }, [])

    useEffect(() => {
        setFormData(prev => {
            const charge = prev.deliveryLocation === "inside" ? shippingRates.inside : shippingRates.outside
            // Rule from frontend: 3+ items is free shipping (for regular)
            const totalItems = prev.items.reduce((acc, item) => acc + (item.quantity || 1), 0)

            // For regular: 6+ items free. For combo: always use selected charge.
            const actualCharge = (orderType === "regular")
                ? (totalItems >= 6 ? 0 : charge)
                : charge

            return {
                ...prev,
                shippingCharge: actualCharge,
                totalAmount: Math.max(0, prev.totalPrice + actualCharge - (prev.discount || 0))
            }
        })
    }, [formData.items, formData.deliveryLocation, shippingRates, orderType, formData.discount])

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
            const productsList = Array.isArray(data) ? data : (data.products || [])
            setProducts(productsList)
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
                // Extract unique colors and set the first one as active
                const colors = [...new Set(item.variants.map(v => v.colorName || v.color || "No Color").filter(Boolean))]
                if (colors.length > 0) {
                    setActiveColorTab(colors[0])
                } else {
                    setActiveColorTab("All")
                }
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
            price: product.offerPrice || product.price,
            quantity: 1,
            sku: variant?.sku || product.sku || "N/A",
            design: variant?.design || "",
            color: variant?.colorName || variant?.color || "",
            size: variant?.size || "",
            image: product.featuredImage || product.image
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
        setActiveSlotIndex(null)
    }

    const [comboSlots, setComboSlots] = useState([])

    // Update slots when bundle option changes
    useEffect(() => {
        if (orderType === "combo" && formData.selectedBundleOption) {
            const pieces = formData.selectedBundleOption.pieces
            setComboSlots(Array(pieces).fill(null).map(() => ({ product: null, selectedColor: "" })))
        }
    }, [formData.selectedBundleOption, orderType])

    const handleUpdateComboSlot = (slotIndex, product, color = "") => {
        setComboSlots(prev => {
            const newSlots = [...prev]
            newSlots[slotIndex] = { product, selectedColor: color || (product?.colors?.[0]?.name || "N/A") }
            return newSlots
        })
    }

    const addComboItem = (combo, packageOption, size, slots) => {
        const isComplete = slots.every(s => s.product);
        if (!isComplete) {
            alert("Please select products for all slots");
            return;
        }

        const newItem = {
            productId: combo._id,
            name: combo.title,
            price: packageOption.price,
            quantity: 1,
            size: size,
            productSize: size,
            bundleSize: packageOption.pieces,
            shippingCharge: packageOption.shippingCharge,
            productType: "combo",
            items: slots.map(slot => ({
                productId: slot.product._id || slot.product.productId,
                name: slot.product.name,
                color: slot.selectedColor,
                image: slot.product.featuredImage || slot.product.image,
                price: slot.product.price || 0
            }))
        }

        setFormData(prev => ({
            ...prev,
            productType: "combo",
            items: [newItem],
            totalPrice: newItem.price,
            shippingCharge: newItem.shippingCharge
        }))
        setSelectedProductForVariant(null)
        setActiveSlotIndex(null)
        setComboSlots([])
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

        const phoneRegex = /^01\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Phone number must be exactly 11 digits and start with 01");
            return;
        }

        setSubmitting(true)
        try {
            const endpoint = orderType === "regular" ? `${BASE_URL}/api/orders` : `${BASE_URL}/api/orders/combo`

            let payload;
            if (orderType === "regular") {
                payload = {
                    customerName: formData.customerName,
                    phone: formData.phone,
                    address: formData.address,
                    note: formData.note,
                    orderSource: formData.orderSource,
                    deliveryLocation: formData.deliveryLocation,
                    shippingCharge: formData.shippingCharge,
                    discount: formData.discount || 0,
                    totalPrice: formData.totalPrice,
                    totalAmount: formData.totalAmount,
                    items: formData.items.map(item => ({
                        productId: item.productId,
                        name: item.name,
                        color: item.color,
                        size: item.size,
                        sku: item.sku,
                        image: item.image,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    productType: "regular",
                    status: "pending"
                }
            } else {
                const comboItem = formData.items[0];
                payload = {
                    customerName: formData.customerName,
                    phone: formData.phone,
                    address: formData.address,
                    note: formData.note,
                    orderSource: formData.orderSource,
                    deliveryLocation: formData.deliveryLocation,
                    items: comboItem.items, // the products inside the combo
                    totalAmount: formData.totalAmount,
                    price: comboItem.price,
                    discount: formData.discount || 0,
                    shippingCharge: formData.shippingCharge,
                    bundleSize: comboItem.bundleSize,
                    productSize: comboItem.size,
                    productType: "combo",
                    status: "pending"
                }
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                const data = await res.json()
                setCreatedOrder(data)
                // We don't redirect immediately so the user can see the success modal and print invoice
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
                    {/* <button
                        onClick={() => { setOrderType("combo"); setFormData(prev => ({ ...prev, items: [], totalPrice: 0 })) }}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${orderType === "combo" ? "bg-[#1E556E] text-white shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Combo System
                    </button> */}
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
                                                {orderType === "regular" ? (
                                                    <p className="text-[#1E556E] font-bold">৳ {item.offerPrice || item.price}</p>
                                                ) : (
                                                    <p className="text-[#1E556E] font-bold text-xs">
                                                        ৳ {item.bundleOptions?.length > 0
                                                            ? `${Math.min(...item.bundleOptions.map(o => o.price))} - ${Math.max(...item.bundleOptions.map(o => o.price))}`
                                                            : item.offerPrice || item.price}
                                                    </p>
                                                )}
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
                                    <div key={index} className="flex flex-col gap-4 p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold">{item.name}</h4>
                                                    {item.productType === "combo" && (
                                                        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Combo</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.design && <span className="mr-2">Design: {item.design}</span>}
                                                    {item.color && <span className="mr-2">Color: {item.color}</span>}
                                                    {item.size && <span>Size: {item.size}</span>}
                                                </p>
                                                <p className="text-[#1E556E] font-medium">৳ {item.price}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                {item.productType !== "combo" && (
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
                                                )}
                                                <p className="w-24 text-right font-bold text-lg">৳ {(item.price * (item.quantity || 1)).toLocaleString()}</p>
                                                <button
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Nested products for combos */}
                                        {item.productType === "combo" && item.items && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-4 border-t border-border/50">
                                                {item.items.map((subItem, sIdx) => (
                                                    <div key={sIdx} className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-border/30">
                                                        <img src={subItem.image} className="w-10 h-10 rounded object-cover" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold truncate">{subItem.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">Color: {subItem.color}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="pt-6 border-t-2 border-border space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subtotal</span>
                                        <span className="text-xl font-bold text-foreground">৳ {formData.totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Shipping</span>
                                        <span className="text-xl font-bold text-foreground">৳ {formData.shippingCharge.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Discount</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-destructive">- ৳</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.discount || 0}
                                                onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                                                className="w-24 px-2 py-1 text-right text-xl font-bold border border-border rounded-lg outline-none focus:border-[#1E556E] focus:ring-1 focus:ring-[#1E556E]"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                                        <span className="text-lg font-black text-muted-foreground uppercase tracking-widest">Total Amount</span>
                                        <span className="text-3xl font-black text-[#1E556E]">৳ {formData.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Customer Details & Order Source */}
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-border p-8 space-y-6 sticky top-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Customer Details</h2>
                            <div className="flex bg-muted p-1 rounded-lg text-sm font-bold">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, deliveryLocation: "inside" }))}
                                    className={`cursor-pointer px-2 py-1 rounded ${formData.deliveryLocation === "inside" ? "bg-[#1E556E] text-white  shadow-sm " : "text-muted-foreground"}`}
                                >
                                    Inside Dhaka
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, deliveryLocation: "outside" }))}
                                    className={`cursor-pointer px-2 py-1 rounded ${formData.deliveryLocation === "outside" ? "bg-[#1E556E] text-white  shadow-sm " : "text-muted-foreground"}`}
                                >
                                    Outside Dhaka
                                </button>
                            </div>
                        </div>

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
                                <div className="relative">
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "");
                                            if (val.length <= 11) {
                                                setFormData({ ...formData, phone: val });
                                            }
                                        }}
                                        placeholder="01XXXXXXXXX"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${formData.phone && !/^01\d{9}$/.test(formData.phone) ? "border-destructive focus:ring-destructive" : "border-border focus:ring-[#1E556E]"}`}
                                    />
                                    {formData.phone && !/^01\d{9}$/.test(formData.phone) && (
                                        <p className="text-[10px] text-destructive mt-1 font-bold uppercase tracking-tight">Must be 11 digits & start with 01</p>
                                    )}
                                </div>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${orderType === "combo" ? "w-full max-w-5xl" : "w-full max-w-md"}`}>
                        <div className="p-6 border-b border-border flex justify-between items-center bg-[#1E556E] text-white">
                            <h3 className="text-xl font-extrabold uppercase tracking-tight">
                                {orderType === "regular" ? "Select Product Variant" : "Configure Your Combo"}
                            </h3>
                            <button onClick={() => { setSelectedProductForVariant(null); setActiveSlotIndex(null); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            {orderType === "regular" ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-2xl border border-border/50">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm">
                                            <img src={selectedProductForVariant.featuredImage || selectedProductForVariant.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-[#1E556E]">{selectedProductForVariant.name}</p>
                                            <p className="text-primary font-black text-lg">৳ {selectedProductForVariant.offerPrice || selectedProductForVariant.price}</p>
                                        </div>
                                    </div>

                                    {/* Color Tabs */}
                                    <div className="flex gap-2 flex-wrap">
                                        {[...new Set(selectedProductForVariant.variants.map(v => v.colorName || v.color || "No Color").filter(Boolean))].map((color, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveColorTab(color)}
                                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border ${activeColorTab === color
                                                    ? "bg-[#1E556E] text-white border-[#1E556E] shadow-md"
                                                    : "bg-white text-muted-foreground border-border hover:border-[#1E556E] hover:text-[#1E556E]"
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {selectedProductForVariant.variants
                                            .filter(v => activeColorTab === "All" || (v.colorName || v.color || "No Color") === activeColorTab)
                                            .map((variant, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => addRegularItem(selectedProductForVariant, variant)}
                                                    className="flex items-center justify-between p-5 border-2 border-border/40 rounded-2xl hover:border-[#1E556E] hover:bg-[#1E556E]/5 hover:shadow-lg transition-all text-left"
                                                >
                                                    <div>
                                                        <p className="font-bold text-lg">{variant.design} {variant.color}</p>
                                                        <p className="font-bold text-muted-foreground bg-muted inline-block px-2 py-0.5 rounded text-xs mt-1">
                                                            Size: {variant.size} | SKU: {variant.sku}
                                                        </p>
                                                    </div>
                                                    <div className="bg-[#1E556E] text-white p-2 rounded-xl">
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                </button>
                                            ))}
                                        {selectedProductForVariant.variants.filter(v => activeColorTab === "All" || (v.colorName || v.color || "No Color") === activeColorTab).length === 0 && (
                                            <p className="text-center text-muted-foreground py-8">No variants found for this color.</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Left: Configuration Header & Slots */}
                                    <div className="lg:col-span-12 flex flex-col md:flex-row gap-6 mb-4 items-center justify-between p-6 bg-[#1E556E]/5 rounded-3xl border border-[#1E556E]/10">
                                        <div className="flex items-center gap-4">
                                            <img src={selectedProductForVariant.featuredImage || selectedProductForVariant.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                                            <div>
                                                <h4 className="font-black text-2xl text-[#1E556E]">{selectedProductForVariant.title}</h4>
                                                <p className="font-bold text-primary">৳ {selectedProductForVariant.offerPrice || selectedProductForVariant.price} Base Price</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            {/* Step 1: Package */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">1. Package</label>
                                                <div className="flex gap-2">
                                                    {selectedProductForVariant.bundleOptions?.map((opt, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setFormData(prev => ({ ...prev, selectedBundleOption: opt }))}
                                                            className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${formData.selectedBundleOption === opt ? "bg-[#1E556E] text-white border-[#1E556E] shadow-lg shadow-[#1E556E]/30" : "bg-white border-border hover:border-primary"}`}
                                                        >
                                                            {opt.pieces} Pcs
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Step 2: Size */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">2. Bundle Size</label>
                                                <div className="flex gap-2">
                                                    {selectedProductForVariant.sizes?.map((size, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setFormData(prev => ({ ...prev, selectedSize: size }))}
                                                            className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${formData.selectedSize === size ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" : "bg-white border-border hover:border-primary"}`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                                        {/* Slot Grid */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-1">
                                                <h5 className="font-black text-muted-foreground uppercase tracking-widest text-xs">3. Fill the Slots</h5>
                                                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                                    {comboSlots.filter(s => s.product).length} / {formData.selectedBundleOption?.pieces || 0} Ready
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar p-1">
                                                {formData.selectedBundleOption ? (
                                                    comboSlots.map((slot, sIdx) => (
                                                        <div
                                                            key={sIdx}
                                                            className={`relative group rounded-2xl border-2 transition-all duration-300 ${activeSlotIndex === sIdx ? "ring-4 ring-primary/20 border-primary shadow-xl" : "border-border hover:border-primary/50"}`}
                                                        >
                                                            {!slot.product ? (
                                                                <button
                                                                    onClick={() => setActiveSlotIndex(sIdx)}
                                                                    className="w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 bg-muted/10"
                                                                >
                                                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                        <Plus className="w-6 h-6 text-primary" />
                                                                    </div>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slot {sIdx + 1}</span>
                                                                </button>
                                                            ) : (
                                                                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                                                                    <img src={slot.product.featuredImage || slot.product.image} className="w-full h-full object-cover" />
                                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                                                        <p className="text-white text-[10px] font-black uppercase mb-2">{slot.product.name}</p>
                                                                        <div className="flex gap-1.5 flex-wrap justify-center border-t border-white/20 pt-2 mb-3 w-full">
                                                                            {slot.product.colors?.map(c => (
                                                                                <button
                                                                                    key={c.name}
                                                                                    onClick={(e) => { e.stopPropagation(); handleUpdateComboSlot(sIdx, slot.product, c.name); }}
                                                                                    style={{ backgroundColor: c.code }}
                                                                                    className={`w-4 h-4 rounded-full border border-white/50 ring-2 transition-all ${slot.selectedColor === c.name ? "ring-white" : "ring-transparent opacity-50"}`}
                                                                                    title={c.name}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <button onClick={() => setActiveSlotIndex(sIdx)} className="p-1.5 bg-white text-primary rounded-lg shadow-lg hover:scale-110 transition-transform"><Search className="w-4 h-4" /></button>
                                                                            <button onClick={() => handleUpdateComboSlot(sIdx, null)} className="p-1.5 bg-destructive text-white rounded-lg shadow-lg hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded text-[8px] font-black uppercase shadow-sm">Slot {sIdx + 1}</div>
                                                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#1E556E] text-white rounded text-[8px] font-black uppercase">Color: {slot.selectedColor}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full py-20 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-border/50">
                                                        <Notebook className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                                                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Select a package above first</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Selection for Active Slot */}
                                        <div className={`space-y-4 transition-all duration-300 ${activeSlotIndex !== null ? "opacity-100 translate-x-0" : "opacity-30 pointer-events-none translate-x-4 grayscale"}`}>
                                            <div className="flex justify-between items-center px-1">
                                                <h5 className="font-black text-muted-foreground uppercase tracking-widest text-xs">
                                                    {activeSlotIndex !== null ? `4. Picking for Slot ${activeSlotIndex + 1}` : "4. Pick a product"}
                                                </h5>
                                                {activeSlotIndex !== null && <button onClick={() => setActiveSlotIndex(null)} className="text-[10px] text-primary font-black uppercase flex items-center gap-1 hover:underline"><X className="w-3 h-3" /> Discard</button>}
                                            </div>

                                            <div className="bg-muted/10 rounded-3xl border-2 border-border/50 overflow-hidden">
                                                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4 max-h-[450px] overflow-y-auto custom-scrollbar">
                                                    {selectedProductForVariant.products?.map(p => (
                                                        <button
                                                            key={p._id}
                                                            onClick={() => {
                                                                handleUpdateComboSlot(activeSlotIndex, p);
                                                                // If next slot empty, auto set active to it
                                                                const nextIdx = comboSlots.findIndex((s, idx) => idx > activeSlotIndex && !s.product);
                                                                if (nextIdx !== -1) setActiveSlotIndex(nextIdx);
                                                                else setActiveSlotIndex(null);
                                                            }}
                                                            className="flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-border/50 hover:border-primary hover:shadow-xl transition-all group"
                                                        >
                                                            <div className="aspect-[4/5] relative">
                                                                <img src={p.featuredImage || p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                            <div className="p-3 text-left">
                                                                <p className="font-black text-[10px] uppercase truncate text-[#1E556E] mb-1">{p.name}</p>
                                                                <div className="flex gap-1">
                                                                    {p.colors?.slice(0, 4).map(c => (
                                                                        <div key={c.name} style={{ backgroundColor: c.code }} className="w-2.5 h-2.5 rounded-full border border-border shadow-sm" title={c.name} />
                                                                    ))}
                                                                    {p.colors?.length > 4 && <span className="text-[8px] font-bold text-muted-foreground">+{p.colors.length - 4}</span>}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="lg:col-span-12 mt-6 p-6 bg-white border-2 border-border/50 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="text-center sm:text-left">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Configuration Price</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-4xl font-black text-[#1E556E]">৳ {formData.selectedBundleOption?.price || 0}</span>
                                                <span className="bg-[#1E556E]/10 text-[#1E556E] text-[10px] font-black px-2 py-1 rounded-lg">
                                                    {formData.selectedBundleOption?.pieces || 0} PIECES INCLUDED
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            disabled={!formData.selectedBundleOption || !formData.selectedSize || !comboSlots.every(s => s.product)}
                                            onClick={() => addComboItem(selectedProductForVariant, formData.selectedBundleOption, formData.selectedSize, comboSlots)}
                                            className="w-full sm:w-auto px-12 py-5 bg-[#1E556E] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1E556E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
                                        >
                                            <CheckCircle className="w-6 h-6" /> SAVE CONFIGURATION
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {createdOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-[#1E556E] p-8 text-center relative">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-3xl" />
                                <div className="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full blur-3xl" />
                            </div>
                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Order Created Successfully!</h3>
                            <p className="text-white/70 font-medium">Order ID: <span className="text-white font-black">#{createdOrder.orderNumber}</span></p>
                        </div>

                        <div className="p-8 space-y-4">
                            {/* <button
                                onClick={() => window.print()}
                                className="w-full py-4 bg-[#1E556E] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-[#1E556E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Printer className="w-5 h-5" /> PRINT PDF INVOICE
                            </button> */}

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setCreatedOrder(null)
                                        setFormData({
                                            customerName: "",
                                            phone: "",
                                            address: "",
                                            note: "",
                                            items: [],
                                            totalPrice: 0,
                                            discount: 0,
                                            shippingCharge: 60,
                                            totalAmount: 0,
                                            orderSource: "website",
                                            deliveryLocation: "inside"
                                        })
                                    }}
                                    className="py-4 bg-gray-100 text-gray-800 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                                >
                                    <Plus className="w-4 h-4" /> NEW ORDER
                                </button>
                                <button
                                    onClick={() => router.push(orderType === "regular" ? "/admin/orders/regular" : "/admin/orders/combos")}
                                    className="py-4 border-2 border-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                                >
                                    <List className="w-4 h-4" /> VIEW LIST
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Printable Invoice Section */}
            {createdOrder && (
                <div id="printable-invoice" className="hidden print:block fixed inset-0 bg-white z-[200] p-8 text-black font-sans leading-relaxed">
                    <InvoicePrint order={createdOrder} />
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
