"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, UploadCloud, Edit3, Lock, Plus, Trash2, X, Search, Check } from "lucide-react"
import { BASE_URL } from "@/utils/baseUrl"
import RichTextEditor from "@/components/RichTextEditor"

export default function EditComboPage() {
  const { id } = useParams()
  const router = useRouter()

  const [products, setProducts] = useState([])
  const [comboData, setComboData] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedVarrient, setSelectedVarrient] = useState({})
  const [sizes, setSizes] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [slugEditMode, setSlugEditMode] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [bundleOptions, setBundleOptions] = useState([])
  const [landingPageDetails, setLandingPageDetails] = useState("")

  // Fetch All Products
  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then(res => res.json())
      .then(setProducts)
  }, [])

  // Fetch Combo
  useEffect(() => {
    fetch(`${BASE_URL}/api/combos/${id}`)
      .then(res => res.json())
      .then(data => {
        setComboData(data)
        setTitle(data.title || "")
        setSlug(data.slug || "")
        setSelectedProducts(data.products || [])
        setSizes(data.sizes || [])
        setBundleOptions(data.bundleOptions || [])
        setImagePreview(data.featuredImage || null)
        setLandingPageDetails(data.landingPageDetails || "")
      })
  }, [id])

  /* ---------- Slug Logic ---------- */
  const handleTitleChange = (e) => {
    const val = e.target.value
    setTitle(val)
    if (!slugEditMode) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const handleSlugChange = (e) => {
    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
  }

  /* ---------- Image Preview ---------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  /* ---------- Select Product ---------- */
  const addProduct = (product) => {
    if (selectedProducts.find(p => (p._id || p.productId) === product._id)) return

    setSelectedProducts(prev => [
      ...prev,
      {
        ...product,
        selectedVarrient
      }
    ])
  }

  const handleSelectVarrient = (v, index) => {
    setSelectedVarrient(v)
    const updated = [...selectedProducts]
    updated[index].colorName = v.colorName
    updated[index].colorHex = v.colorHex
    setSelectedProducts(updated)
  }

  /* ---------- Toggle Size ---------- */
  const toggleSize = (size) => {
    setSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  /* ---------- Bundle Options Handlers ---------- */
  const addBundleOption = () => {
    setBundleOptions([...bundleOptions, { pieces: 0, price: 0, originalPrice: 0, shippingCharge: 0, popular: false }])
  }

  const removeBundleOption = (index) => {
    setBundleOptions(bundleOptions.filter((_, i) => i !== index))
  }

  const updateBundleOption = (index, field, value) => {
    const updated = [...bundleOptions]
    updated[index][field] = field === "popular" ? value : Number(value)
    setBundleOptions(updated)
  }

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    formData.append("products", JSON.stringify(selectedProducts))
    formData.append("sizes", JSON.stringify(sizes))
    formData.append("bundleOptions", JSON.stringify(bundleOptions))
    formData.append("slug", slug)
    formData.append("landingPageDetails", landingPageDetails)
    formData.append("existingFeaturedImage", comboData.featuredImage || "")

    const res = await fetch(`${BASE_URL}/api/combos/${id}`, {
      method: "PUT",
      body: formData
    })

    setLoading(false)

    if (res.ok) {
      alert("Combo updated successfully!")
      router.push("/admin/combos")
    } else {
      alert("Failed to update combo")
    }
  }

  if (!comboData) return <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className=" py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/combos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Combo List
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Combo</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">

        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-8 space-y-8">

          {/* ================= BASIC INFO ================= */}
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <h2 className="text-xl font-bold">Combo Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Internal Title *</label>
                <input
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Kids Summer Collection 2024"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Slug *</label>
                <div className="relative">
                  <input
                    name="slug_display"
                    value={slug}
                    onChange={handleSlugChange}
                    readOnly={!slugEditMode}
                    placeholder="kids-summer-combo"
                    required
                    className={`flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${!slugEditMode ? 'bg-muted cursor-not-allowed' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setSlugEditMode(!slugEditMode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
                    title={slugEditMode ? "Lock Slug" : "Edit Slug"}
                  >
                    {slugEditMode ? <Lock className="w-4 h-4 text-primary" /> : <Edit3 className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Landing Page Title</label>
                <input
                  name="landingPageTitle"
                  defaultValue={comboData.landingPageTitle}
                  placeholder="e.g. Adorable Kids Dress Sets"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Landing Page Subtitle</label>
                <input
                  name="landingPageSubtitle"
                  defaultValue={comboData.landingPageSubtitle}
                  placeholder="e.g. Mix, Match & Save Big!"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground flex justify-between items-center">
                <span>Landing Page Details (Rich Content)</span>
                <span className="text-[10px] text-primary bg-primary/5 px-2 py-1 rounded">Visual Editor</span>
              </label>
              <RichTextEditor
                value={landingPageDetails}
                onChange={setLandingPageDetails}
                placeholder="Write detailed product information, feature lists, etc. with style..."
              />
              <p className="text-[11px] text-muted-foreground">This content appears in the "Why Choose Importila" section on the landing page.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Internal Description</label>
              <textarea
                name="description"
                defaultValue={comboData.description}
                placeholder="Details about this combo for admin reference..."
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </section>

          {/* ================= LANDING PAGE CUSTOMIZATION ================= */}
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <h2 className="text-xl font-bold">Landing Page Content & CTA</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Hero Section */}
              <div className="space-y-4 col-span-2">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Hero Section</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Hero Badge text</label>
                    <input name="heroBadge" defaultValue={comboData.heroBadge} placeholder="e.g. Bundle & Save Up To 41%" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Hero CTA Button</label>
                    <input name="heroCTA" defaultValue={comboData.heroCTA} placeholder="e.g. পছন্দের বান্ডেলটি বেছে নিন" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Bundle & Products Section */}
              <div className="space-y-4 col-span-2 pt-4 border-t border-border">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Bundle & Products Section</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Bundle Section Title</label>
                    <input name="bundleTitle" defaultValue={comboData.bundleTitle} placeholder="e.g. পছন্দের বান্ডেলটি বেছে নিন" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Bundle Section Subtitle</label>
                    <input name="bundleSubtitle" defaultValue={comboData.bundleSubtitle} placeholder="e.g. Select pieces and save!" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Product Grid Title</label>
                    <input name="productGridTitle" defaultValue={comboData.productGridTitle} placeholder="e.g. Choose Your Favorite Styles" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Size Selection Title</label>
                    <input name="sizeSelectionTitle" defaultValue={comboData.sizeSelectionTitle} placeholder="e.g. Select Size for Your Bundle" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Checkout Section */}
              <div className="space-y-4 col-span-2 pt-4 border-t border-border">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Checkout Section</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Checkout Form Title</label>
                    <input name="checkoutFormTitle" defaultValue={comboData.checkoutFormTitle} placeholder="e.g. Complete Your Order" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Checkout Form Subtitle</label>
                    <input name="checkoutFormSubtitle" defaultValue={comboData.checkoutFormSubtitle} placeholder="e.g. Fill in your details..." className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Checkout Button Text</label>
                    <input name="checkoutCTA" defaultValue={comboData.checkoutCTA} placeholder="e.g. Place Order" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Help & Social Section */}
              <div className="space-y-4 col-span-2 pt-4 border-t border-border">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Contact & Support</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">WhatsApp Number</label>
                    <input name="whatsappNumber" defaultValue={comboData.whatsappNumber} placeholder="e.g. +8801631314880" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Messenger Username</label>
                    <input name="messengerUsername" defaultValue={comboData.messengerUsername} placeholder="e.g. importila" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Help Title</label>
                    <input name="helpTitle" defaultValue={comboData.helpTitle} placeholder="e.g. Need Help? Chat With Us!" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Help Subtitle</label>
                    <input name="helpSubtitle" defaultValue={comboData.helpSubtitle} placeholder="e.g. Our team is ready to assist..." className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= BUNDLE OPTIONS ================= */}
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h2 className="text-xl font-bold">Bundle Options (Packs)</h2>
              <button
                type="button"
                onClick={addBundleOption}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Pack Option
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bundleOptions.map((opt, idx) => (
                <div key={idx} className="bg-muted/30 border border-border rounded-2xl p-4 space-y-4 relative group transition-all hover:bg-muted/50">
                  <button
                    type="button"
                    onClick={() => removeBundleOption(idx)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pieces</label>
                      <input
                        type="number"
                        value={opt.pieces}
                        onChange={(e) => updateBundleOption(idx, "pieces", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Price</label>
                      <input
                        type="number"
                        value={opt.price}
                        onChange={(e) => updateBundleOption(idx, "price", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Original</label>
                      <input
                        type="number"
                        value={opt.originalPrice}
                        onChange={(e) => updateBundleOption(idx, "originalPrice", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Shipping</label>
                      <input
                        type="number"
                        value={opt.shippingCharge}
                        onChange={(e) => updateBundleOption(idx, "shippingCharge", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      checked={opt.popular}
                      onChange={(e) => updateBundleOption(idx, "popular", e.target.checked)}
                      id={`popular-${idx}`}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary transition-all cursor-pointer"
                    />
                    <label htmlFor={`popular-${idx}`} className="text-sm font-medium cursor-pointer">Mark as Most Popular</label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= PRODUCT PICKER ================= */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PRODUCT LIST */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col h-[600px]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Select Products
                </h2>
                <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-full">{filteredProducts.length} Available</span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {filteredProducts?.map(product => {
                  const isSelected = selectedProducts.some(p => (p._id || p.productId) === product._id);
                  return (
                    <button
                      type="button"
                      key={product._id}
                      onClick={() => !isSelected && addProduct(product)}
                      disabled={isSelected}
                      className={`w-full group flex items-center justify-between p-3 rounded-xl border transition-all text-left ${isSelected
                        ? "bg-primary/10 border-primary shadow-sm cursor-not-allowed"
                        : "border-transparent hover:border-primary/20 hover:bg-primary/5 cursor-pointer"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          <img src={product.featuredImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium line-clamp-1">{product?.name}</span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-primary uppercase">Already Selected</span>
                          )}
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? "bg-primary text-white" : "bg-muted group-hover:bg-primary group-hover:text-white"
                        }`}>
                        {isSelected ? <Check size={16} /> : <Plus size={16} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELECTED PRODUCTS */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col h-[600px]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Selected Items
                </h2>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{selectedProducts.length} Added</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {selectedProducts?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Trash2 size={24} />
                    </div>
                    <p className="text-sm font-medium">No products selected</p>
                  </div>
                ) : (
                  selectedProducts.map((p, index) => (
                    <div key={p.productId || p._id} className="bg-muted/10 border border-border rounded-2xl p-4 relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <button
                        type="button"
                        onClick={() => setSelectedProducts(prev => prev.filter(item => (item.productId || item._id) !== (p.productId || p._id)))}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/30 shadow-sm transition-all z-10"
                      >
                        <X size={14} />
                      </button>

                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-border flex-shrink-0">
                          <img src={p.featuredImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="text-sm font-bold line-clamp-1 pr-6">{p.name}</h4>
                          <div className="flex gap-2 flex-wrap">
                            {p?.variants?.map(v => (
                              <button
                                type="button"
                                key={v.sku}
                                onClick={() => handleSelectVarrient(v, index)}
                                className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${p.colorName === v.colorName ? 'ring-2 ring-primary ring-offset-2 border-transparent' : 'border-border'}`}
                                style={{ backgroundColor: v.colorHex }}
                                title={v.colorName}
                              />
                            ))}
                          </div>
                          {p.colorName && (
                            <p className="text-[11px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded w-fit">
                              COLOR: {p.colorName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Settings & Actions */}
        <div className="lg:col-span-4 space-y-8">

          {/* ================= FEATURED IMAGE ================= */}
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Featured Image</h2>
            <div className="relative">
              <div className={`border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden ${imagePreview ? 'border-primary/30' : 'border-border hover:border-primary/50 bg-muted/20'}`}>
                {imagePreview ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all text-destructive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                      <UploadCloud size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">Click to upload image</p>
                      <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max. 5MB)</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  name="featuredImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* ================= SIZES ================= */}
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Available Sizes</h2>
            <div className="grid grid-cols-2 gap-2">
              {["1-2 Years", "2-3 Years", "3-4 Years", "4-5 Years", "5-6 Years", "6-7 Years", "7-8 Years", "8-9 Years", "9-10 Years", "10-11 Years", "11-12 Years", "12-13 Years"].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${sizes.includes(size) ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:bg-muted'}`}
                >
                  {size}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${sizes.includes(size) ? 'bg-primary border-transparent' : 'border-border'}`}>
                    {sizes.includes(size) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ================= SUBMIT ================= */}
          <div className="sticky top-8 space-y-4">
            <button
              disabled={loading}
              className="w-full bg-[#1E556E] text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating Combo...
                </>
              ) : (
                "Update Combo"
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              Make sure all information is correct before updating.
            </p>
          </div>

        </div>
      </form>
    </div>
  )
}
