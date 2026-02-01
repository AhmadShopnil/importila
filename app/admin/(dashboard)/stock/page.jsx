"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Loading from "@/components/Loader/Loading"
import { BASE_URL } from "@/utils/baseUrl"

export default function StockPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterLowStock, setFilterLowStock] = useState(false)
  const [localStock, setLocalStock] = useState({}) // track input changes
  const [savingStock, setSavingStock] = useState({}) // track saving state per SKU

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/products`)
      const data = await res.json()
      setProducts(data)

      // Initialize local stock state
      const stockObj = {}
      data.forEach((product) => {
        product.variants.forEach((variant) => {
          stockObj[variant.sku] = variant.stock
        })
      })
      setLocalStock(stockObj)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (sku, value) => {
    setLocalStock((prev) => ({ ...prev, [sku]: value }))
  }

  const handleSaveStock = async (productId, sku) => {
    const newStock = Number(localStock[sku])
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Invalid stock value")
      return
    }

    try {
      setSavingStock((prev) => ({ ...prev, [sku]: true }))

      const product = products.find((p) => p._id === productId)
      if (!product) return

      const updatedVariant = product.variants.find((v) => v.sku === sku)
      if (!updatedVariant) return

      const res = await fetch(`${BASE_URL}/api/products/updatestocks/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variants: [{ ...updatedVariant, stock: newStock }] }),
      })

      if (!res.ok) throw new Error("Failed to update stock")

      // Update products state locally
      setProducts((prevProducts) =>
        prevProducts?.map((p) =>
          p._id === productId
            ? {
              ...p,
              variants: p.variants.map((v) =>
                v.sku === sku ? { ...v, stock: newStock } : v
              ),
            }
            : p
        )
      )

      toast.success(`Stock updated for ${sku}`)
    } catch (error) {
      console.error("Failed to save stock:", error)
      toast.error(`Failed to update stock for ${sku}`)
    } finally {
      setSavingStock((prev) => ({ ...prev, [sku]: false }))
    }
  }

  if (loading) return <Loading />

  // Flatten variants for table
  const allVariants = []
  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      allVariants.push({
        productId: product._id,
        productName: product.name,
        ...variant,
      })
    })
  })

  const filteredVariants = filterLowStock
    ? allVariants.filter((v) => v.stock < 10)
    : allVariants

  return (
    <div className="space-y-6">
      {/* Hot Toast Container */}
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Stock Management</h1>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Show low stock only</span>
        </label>
      </div>

      {/* Stock Table */}
      <div className="overflow-x-auto bg-card rounded-lg border border-border">
        <table className="w-full text-md">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
                Variant (SKU)
              </th>
              <th className="px-4 py-3 text-left font-semibold">Stock</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVariants.map((variant, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{variant.productName}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  {variant.sku}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {localStock[variant.sku] < 10 && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <input
                      type="number"
                      min="0"
                      value={localStock[variant.sku]}
                      onChange={(e) =>
                        handleInputChange(variant.sku, e.target.value)
                      }
                      className="w-16 px-2 py-1 border border-border rounded text-sm"
                      disabled={savingStock[variant.sku]}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() =>
                      handleSaveStock(variant.productId, variant.sku)
                    }
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:opacity-90"
                    disabled={savingStock[variant.sku]}
                  >
                    {savingStock[variant.sku] ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredVariants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {filterLowStock ? "No low stock items" : "No variants available"}
        </div>
      )}
    </div>
  )
}
