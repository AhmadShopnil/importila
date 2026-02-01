"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BASE_URL } from "@/utils/baseUrl"


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

// Fetch All Products
  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then(res => res.json())
      .then(setProducts)
  }, [])

  //  Fetch Combo -
  useEffect(() => {
    fetch(`${BASE_URL}/api/combos/${id}`)
      .then(res => res.json())
      .then(data => {
        setComboData(data)
        setSelectedProducts(data.products || [])
        setSizes(data.sizes || [])
      })
  }, [id])

// Select Product 
  const addProduct = (product) => {
    if (selectedProducts.find(p => p.productId === product._id)) return

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
    setColor(index, v)
  }
  /* ---------- Set Color ---------- */
  const setColor = (index, variant) => {
    const updated = [...selectedProducts]
    updated[index].colorName = variant.colorName
    updated[index].colorHex = variant.colorHex
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

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    formData.append("products", JSON.stringify(selectedProducts))
    formData.append("sizes", JSON.stringify(sizes))
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

  if (!comboData) return <p>Loading...</p>

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className=" space-y-8">

      <Link
        href="/admin/combos"
        className="inline-flex items-center gap-2 md:text-lg text-blue-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Combo list
      </Link>
      <h1 className="text-3xl font-bold">Edit Combo</h1>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ================= BASIC INFO ================= */}
        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Combo Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Combo Title"
              required
              className="border rounded-lg px-4 py-2 w-full"
              defaultValue={comboData.title}
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              className="border rounded-lg px-4 py-2 w-full"
              defaultValue={comboData.price}
            />
            <input
              name="offerPrice"
              type="number"
              placeholder="Offer Price"
              className="border rounded-lg px-4 py-2 w-full"
              defaultValue={comboData.offerPrice}
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            className="border rounded-lg px-4 py-2 w-full"
            rows={3}
            defaultValue={comboData.description}
          />

          <input type="file" name="featuredImage" />
        </section>

        {/* ================= SIZES ================= */}
        <section className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Available Sizes (Combo)</h2>
          <div className="flex gap-3 flex-wrap">
            {["SM", "M", "L", "XL"].map(size => (
              <label key={size} className="flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </section>

        {/* ================= PRODUCT PICKER ================= */}
        <section className="grid lg:grid-cols-2 gap-6">

          {/* PRODUCT LIST */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Select Products</h2>

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full mb-3"
            />

            <div className="max-h-87.5 overflow-y-auto space-y-2">
              {filteredProducts.map(product => (
                <button
                  type="button"
                  key={product._id}
                  onClick={() => addProduct(product)}
                  className="w-full text-left border rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>


          {/* SELECTED PRODUCTS */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Selected Products</h2>

            {selectedProducts.length === 0 && (
              <p className="text-sm text-gray-500">
                No products selected yet
              </p>
            )}

            {selectedProducts?.map((p, index) => {
              const product = products.find(pr => pr._id === p.productId)

              /* ---------- REMOVE PRODUCT ---------- */
              const removeProduct = () => {
                setSelectedProducts(prev => prev.filter(item => item._id !== p._id))
              }

              return (
                <div key={p.productId} className="border rounded-lg p-4 relative">
                  <h4 className="font-medium mb-2">{p.name}</h4>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={removeProduct}
                    className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700"
                  >
                    ✕
                  </button>

                  <div className="flex gap-2 flex-wrap mt-2">
                    {p?.variants?.map(v => (
                      <button
                        type="button"
                        key={v?.sku}
                        onClick={() => handleSelectVarrient(v, index)}
                        // onClick={() => setColor(index, v)}
                        className={`px-3 py-1 rounded border text-white text-sm
                ${p.colorName === v?.colorName ? "ring-2 ring-black" : ""}
              `}
                        style={{ backgroundColor: v.colorHex }}
                      >
                        {v.colorName}
                      </button>
                    ))}
                  </div>

                  {p.colorName && (
                    <p className="text-sm mt-2">
                      Selected Color: <b>{p.colorName}</b>
                    </p>
                  )}
                </div>
              )
            })}
          </div>

        </section>

        {/* ================= SUBMIT ================= */}
        <button
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-lg text-lg"
        >
          {loading ? "Updating..." : "Update Combo"}
        </button>
      </form>
    </div>
  )
}
