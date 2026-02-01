"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { BASE_URL } from "@/utils/baseUrl"
import CategoryMultiSelect from "@/components/Dashboard/Products/CategoryMultiSelect"

/* ---------- SKU Generator ---------- */
const generateSKU = (color, size) => {
  if (!color || !size) return ""
  return `${color.replace(/\s+/g, "-").toUpperCase()}-${size.toUpperCase()}`
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categories: [], // Selected category IDs
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

  /* ---------- Product fields ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* ---------- Images ---------- */
  const handleFeaturedImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFormData((prev) => ({ ...prev, featuredImage: file }))
  }

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  /* ---------- Variants ---------- */
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          colorName: "",
          colorHex: "#000000",
          size: "",
          stock: "",
          sku: "",
        },
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
      fd.append("featuredImage", formData.featuredImage)

      formData.images.forEach((img) => {
        fd.append("images", img)
      })

      fd.append("variants", JSON.stringify(
        formData.variants.map((v) => ({
          ...v,
          stock: Number(v.stock),
        }))
      ))
      // toast.success("try to created ")
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        body: fd,
      })
      console.log("res",res)

      if (res.ok) {
        toast.success("Product created successfully")
        router.push("/admin/products")
      } else {
        
        toast.error("Failed  create product")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Product Info */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Product Information
            </h2>

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
              <label className="form-label">Description (optional)</label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="form-label">Featured Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImage}
                  className="form-input cursor-pointer"
                />
              </div>

              <div>
                <label className="form-label">Extra Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleExtraImages}
                  className="form-input cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Variants (UNCHANGED) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Variants & Stock</h2>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1 text-sm md:text-base text-[#1E556E] font-bold"
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
                      className="form-input bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex justify-end items-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#1E556E] text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  )
}
