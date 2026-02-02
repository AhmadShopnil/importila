"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, Plus, Trash2, X, UploadCloud } from "lucide-react"
import { BASE_URL } from "@/utils/baseUrl"
import CategoryMultiSelect from "@/components/Dashboard/Products/CategoryMultiSelect"

/* ---------- SKU Generator ---------- */
const generateSKU = (color, size) => {
  if (!color || !size) return ""
  return `${color.replace(/\s+/g, "-").toUpperCase()}-${size.toUpperCase()}`
}

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categories: [], // Array of category IDs
    price: "",
    offerPrice: "",
    purchasePrice: "",
    featuredImage: null,
    images: [],
    variants: [],
    isFeatured: false,
    isActive: true,
    designName: "",
  })

  /* ---------- Fetch Categories ---------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories/flat`)
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  /* ---------- Fetch Product ---------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products/${id}`)
        const data = await res.json()
        if (!res.ok) {
          toast.error("Failed to load product")
          return
        }

        setFormData({
          ...data,
          price: String(data.price),
          featuredImage: data.featuredImage || null,
          images: data.images || [],
          categories: Array.isArray(data.categories)
            ? data.categories
            : (data.category ? [data.category] : []),
          isFeatured: !!data.isFeatured,
          isActive: data.isActive !== undefined ? !!data.isActive : true,
          designName: data.designName || "",
          purchasePrice: data.purchasePrice ? String(data.purchasePrice) : "",
          variants: data.variants.map((v) => ({
            ...v,
            stock: String(v.stock),
            sku: generateSKU(v.colorName, v.size),
          })),
        })
      } catch {
        toast.error("Something went wrong")
      } finally {
        setFetching(false)
      }
    }

    fetchProduct()
  }, [id])

  /* ---------- Product fields ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* ---------- Image fields ---------- */
  const handleFeaturedImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFormData((prev) => ({ ...prev, featuredImage: file }))
  }

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const removeExtraImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  /* ---------- Variants ---------- */
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { colorName: "", colorHex: "#000000", size: "", stock: "", sku: "" },
      ],
    }))
  }

  const updateVariant = (index, field, value) => {
    const updated = [...formData.variants]
    updated[index][field] = value
    const { colorName, size } = updated[index]
    updated[index].sku = generateSKU(colorName, size)
    setFormData({ ...formData, variants: updated })
  }

  const removeVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    })
  }

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || formData.categories.length === 0 || !formData.featuredImage) {
      toast.error("Please fill all required product fields")
      return
    }

    if (!formData.price || isNaN(formData.price)) {
      toast.error("Price must be a valid number")
      return
    }

    if (!formData.variants.length) {
      toast.error("Please add at least one variant")
      return
    }

    for (const v of formData.variants) {
      if (!v.colorName || !v.size || !v.stock) {
        toast.error("All variant fields are required")
        return
      }
      if (isNaN(v.stock)) {
        toast.error("Stock must be a number")
        return
      }
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("description", formData.description)
      fd.append("categories", JSON.stringify(formData.categories))
      fd.append("price", formData.price)
      fd.append("offerPrice", formData.offerPrice)
      fd.append("purchasePrice", formData.purchasePrice)
      fd.append("isFeatured", formData.isFeatured)
      fd.append("isActive", formData.isActive)
      fd.append("designName", formData.designName)

      // Featured image (File or URL)
      if (formData.featuredImage instanceof File) {
        fd.append("featuredImage", formData.featuredImage)
      } else {
        fd.append("featuredImageURL", formData.featuredImage)
      }

      // Extra images (Files or URL strings)
      formData.images.forEach((img) => {
        if (img instanceof File) {
          fd.append("images", img)
        } else {
          fd.append("imageURLs", img)
        }
      })

      fd.append(
        "variants",
        JSON.stringify(formData.variants.map((v) => ({ ...v, stock: Number(v.stock) })))
      )

      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "PUT",
        body: fd,
      })

      if (res.ok) {
        toast.success("Product updated successfully")
        router.push("/admin/products")
      } else {
        toast.error("Update failed")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // if (fetching) return <p className="text-center py-10">Loading product...</p>

  return (
    <div className="w-full">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 md:text-lg text-blue-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-8">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Product Info */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Product Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Product Name"
                />
              </div>

              <div>
                <label className="form-label">Design Name</label>
                <input
                  name="designName"
                  value={formData.designName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="E.g. DT-123"
                />
              </div>

              <div className="md:col-span-2">
                <CategoryMultiSelect
                  selectedIds={formData.categories}
                  categories={categories}
                  onChange={(ids) => setFormData(prev => ({ ...prev, categories: ids }))}
                />
              </div>

              <div className="flex flex-wrap gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                    Featured Product
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                    Active (Product visible to customers)
                  </label>
                </div>
              </div>

              <div>
                <label className="form-label">Price *</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Offer Price </label>
                <input
                  type="text"
                  name="offerPrice"
                  value={formData?.offerPrice}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Purchase Price</label>
                <input
                  type="text"
                  name="purchasePrice"
                  value={formData?.purchasePrice}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Buying price"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Featured Image */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Featured Image <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  {formData?.featuredImage ? (
                    <div className="relative border border-border rounded-2xl overflow-hidden group w-52 h-52 bg-gray-50 flex items-center justify-center shadow-sm">
                      <img
                        src={
                          formData.featuredImage instanceof File
                            ? URL.createObjectURL(formData.featuredImage)
                            : formData.featuredImage
                        }
                        alt="Featured"
                        className="max-h-full max-w-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                        <div className="relative">
                          <button
                            type="button"
                            className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:scale-105 transition-transform"
                          >
                            <UploadCloud size={18} />
                            Change Featured Image
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFeaturedImage}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <p className="text-white text-[11px] font-medium">Click button or drop new image to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl p-12 transition-all flex flex-col items-center justify-center gap-4 group relative cursor-pointer bg-muted/20">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                        <UploadCloud size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground">Upload Featured Image</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImage}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Images */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">Extra Images</label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 group relative cursor-pointer bg-muted/20 min-h-[120px]">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                      <Plus size={24} />
                    </div>
                    <p className="text-xs font-bold text-foreground">Add Gallery Images</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleExtraImages}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative group aspect-square">
                          <img
                            src={img instanceof File ? URL.createObjectURL(img) : img}
                            className="w-full h-full rounded-xl border border-border object-cover shadow-sm transition-transform group-hover:scale-[1.02]"
                          />
                          <button
                            type="button"
                            onClick={() => removeExtraImage(i)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 text-red-500 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Variants */}
          <section>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Variants & Stock</h2>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1 text-primary"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 bg-gray-50"
                >
                  <div>
                    <label className="form-label">Color Name *</label>
                    <input
                      value={variant.colorName}
                      onChange={(e) =>
                        updateVariant(index, "colorName", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Color *</label>
                    <input
                      type="color"
                      value={variant.colorHex}
                      onChange={(e) =>
                        updateVariant(index, "colorHex", e.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="form-label">Size *</label>
                    <input
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, "size", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Stock *</label>
                    <input
                      type="text"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, "stock", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">SKU</label>
                    <input
                      value={variant.sku}
                      disabled
                      className="form-input bg-gray-100"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#1E556E] text-white font-semibold cursor-pointer"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  )
}
