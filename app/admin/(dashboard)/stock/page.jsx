"use client"

import { useEffect, useState } from "react"
import {
  AlertTriangle,
  LayoutGrid,
  Layers,
  Search,
  Save,
  Package,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Boxes
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Loading from "@/components/Loader/Loading"
import Image from "next/image"

import { useGetProductsQuery, useUpdateProductStockMutation } from "@/lib/redux/api/productApi"

export default function StockPage() {
  const { data: productsData, isLoading: loading } = useGetProductsQuery()
  const [updateProductStock] = useUpdateProductStockMutation()

  const [activeView, setActiveView] = useState("grouped")
  const [filterLowStock, setFilterLowStock] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [localStock, setLocalStock] = useState({})
  const [savingStock, setSavingStock] = useState({})
  const [expandedProducts, setExpandedProducts] = useState(new Set())
  const [lowStockThreshold, setLowStockThreshold] = useState(10)

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data.lowStockThreshold !== undefined) {
         setLowStockThreshold(data.lowStockThreshold)
      }
    }).catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (productsData) {
      // Initialize local stock state
      const stockObj = {}
      productsData.forEach((product) => {
        product.variants?.forEach((variant) => {
          stockObj[`${product._id}-${variant.sku}`] = variant.stock || 0
        })
      })
      setLocalStock(stockObj)
    }
  }, [productsData])

  const products = productsData || []

  const handleInputChange = (productId, sku, value) => {
    setLocalStock((prev) => ({ ...prev, [`${productId}-${sku}`]: value }))
  }

  const toggleProductExpansion = (productId) => {
    const newExpanded = new Set(expandedProducts)
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId)
    } else {
      newExpanded.add(productId)
    }
    setExpandedProducts(newExpanded)
  }

  const handleSaveStock = async (productId, sku) => {
    const stockKey = `${productId}-${sku}`
    const newStock = Number(localStock[stockKey])
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Invalid stock value")
      return
    }

    try {
      setSavingStock((prev) => ({ ...prev, [stockKey]: true }))

      const product = products.find((p) => p._id === productId)
      if (!product) return

      const updatedVariant = product.variants?.find((v) => v.sku === sku)
      if (!updatedVariant) return

      await updateProductStock({
        id: productId,
        body: { variants: [{ ...updatedVariant, stock: newStock }] }
      }).unwrap()

      toast.success(`Stock updated for ${sku}`)
    } catch (error) {
      console.error("Failed to save stock:", error)
      toast.error(`Failed to update stock for ${sku}`)
    } finally {
      setSavingStock((prev) => ({ ...prev, [stockKey]: false }))
    }
  }

  if (loading) return <Loading />

  // Filter and process products
  const filteredProducts = products.filter(product => {
    if (product.isTrashed) return false

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variants.some(v => v.sku.toLowerCase().includes(searchTerm.toLowerCase()))

    if (!matchesSearch) return false

    if (filterLowStock) {
      return product.variants.some(v => v.stock < lowStockThreshold)
    }

    return true
  })

  // Flatten variants for the flattened view
  const allVariants = []
  products.forEach((product) => {
    if (product.isTrashed) return
    product.variants?.forEach((variant) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.sku.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return
      if (filterLowStock && variant.stock >= lowStockThreshold) return

      allVariants.push({
        productId: product._id,
        productName: product.name,
        productImage: product.featuredImage || product.images?.[0],
        ...variant,
      })
    })
  })

  // Calculate statistics for the dashboard
  const activeProducts = products.filter(p => !p.isTrashed)
  const totalOverallStock = activeProducts.reduce((acc, p) =>
    acc + (p.variants?.reduce((vAcc, v) => vAcc + (Number(localStock[`${p._id}-${v.sku}`]) || 0), 0) || 0), 0
  )
  const totalVariantsCount = activeProducts.reduce((acc, p) => acc + (p.variants?.length || 0), 0)
  const lowStockVariantsCount = activeProducts.reduce((acc, p) =>
    acc + (p.variants?.filter(v => (Number(localStock[`${p._id}-${v.sku}`]) || 0) < lowStockThreshold).length || 0), 0
  )

  return (
    <div className="space-y-8 ">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
            <Package className="w-10 h-10 text-indigo-600" />
            Stock Inventory
          </h1>
          <p className="mt-2 text-gray-500 font-medium">Manage your product variants and track stock levels efficiently.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveView("grouped")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeView === "grouped"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Grouped
            </button>
            <button
              onClick={() => setActiveView("flattened")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeView === "flattened"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Layers className="w-4 h-4" />
              Flattened
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 tracking-tight">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Products</p>
            <p className="text-3xl font-black text-gray-900">{activeProducts.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Variants</p>
            <p className="text-3xl font-black text-gray-900">{totalVariantsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow ring-2 ring-indigo-500/10">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Stock</p>
            <p className="text-3xl font-black text-blue-600">{totalOverallStock}</p>
          </div>
        </div>

        {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Low Stock Items</p>
            <p className="text-3xl font-black text-amber-600 font-mono">{lowStockVariantsCount}</p>
          </div>
        </div> */}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={filterLowStock}
                onChange={(e) => setFilterLowStock(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${filterLowStock ? 'bg-red-500' : 'bg-gray-200'}`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${filterLowStock ? 'translate-x-6' : ''}`}></div>
            </div>
            <span className={`text-sm font-semibold transition-colors ${filterLowStock ? 'text-red-600' : 'text-gray-600'}`}>
              Low Stock Only
            </span>
          </label>
        </div>

        <div className="lg:justify-self-end text-sm text-gray-500 font-medium">
          Showing <span className="text-gray-900">{activeView === 'grouped' ? filteredProducts.length : allVariants.length}</span> items
        </div>
      </div>

      {/* Main Content Area */}
      <div className="transition-all duration-300">
        {activeView === "grouped" ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredProducts.map((product) => {
              const isExpanded = expandedProducts.has(product._id)
              const lowStockCount = product.variants.filter(v => (localStock[`${product._id}-${v.sku}`] || 0) < lowStockThreshold).length
              const totalStock = product.variants.reduce((acc, v) => acc + (localStock[`${product._id}-${v.sku}`] || 0), 0)

              return (
                <div
                  key={product._id}
                  className={`bg-white rounded-2xl border transition-all duration-200 ${isExpanded ? 'border-indigo-200 ring-4 ring-indigo-50 shadow-md' : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
                    }`}
                >
                  {/* Product Header Row */}
                  <div
                    className="p-5 flex flex-wrap items-center gap-4 cursor-pointer"
                    onClick={() => toggleProductExpansion(product._id)}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      {(product.featuredImage || product.images?.[0]) ? (
                        <Image
                          src={product.featuredImage || product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {product.variants.length} Variants
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <span className="text-sm font-medium text-gray-500">
                          Total Stock: <span className={totalStock < lowStockThreshold ? "text-red-500 font-bold" : "text-gray-900 font-bold"}>{totalStock}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {lowStockCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {lowStockCount} Low
                        </div>
                      )}

                      <div className={`p-2 rounded-full bg-gray-50 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content: Variants Table */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100/50 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                              <th className="px-6 py-3 text-left">Internal SKU</th>
                              <th className="px-6 py-3 text-left">Attributes</th>
                              <th className="px-6 py-3 text-left">Current Stock</th>
                              <th className="px-6 py-3 text-left">Status</th>
                              <th className="px-6 py-3 text-center">Update</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {product.variants.map((variant) => (
                              <tr key={variant.sku} className="hover:bg-white transition-colors group/row">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3 font-mono text-xs text-gray-600">
                                    <div className="relative w-8 h-8 rounded bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                      {variant.image ? (
                                        <Image src={variant.image} alt={variant.sku} fill className="object-cover" />
                                      ) : (
                                        <Package className="w-full h-full p-1.5 text-gray-300" />
                                      )}
                                    </div>
                                    {variant.sku}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-2">
                                    {variant.colorName && (
                                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                                        Color: {variant.colorName}
                                      </span>
                                    )}
                                    {variant.size && (
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium border border-emerald-100">
                                        Size: {variant.size}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="number"
                                      min="0"
                                      value={localStock[`${product._id}-${variant.sku}`] ?? ''}
                                      onChange={(e) => handleInputChange(product._id, variant.sku, e.target.value)}
                                      className={`w-20 px-3 py-1.5 bg-white border rounded-lg text-sm font-semibold transition-all outline-none focus:ring-2 ${(localStock[`${product._id}-${variant.sku}`] < lowStockThreshold)
                                        ? 'border-red-200 focus:ring-red-500/20 text-red-600'
                                        : 'border-gray-200 focus:ring-indigo-500/20 text-gray-900'
                                        }`}
                                      disabled={savingStock[`${product._id}-${variant.sku}`]}
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {(localStock[`${product._id}-${variant.sku}`] || 0) < lowStockThreshold ? (
                                    <span className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      Low
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Healthy
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSaveStock(product._id, variant.sku);
                                    }}
                                    disabled={savingStock[`${product._id}-${variant.sku}`]}
                                    className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${savingStock[`${product._id}-${variant.sku}`]
                                      ? 'bg-gray-100 text-gray-400'
                                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95'
                                      }`}
                                    title="Save Stock"
                                  >
                                    {savingStock[`${product._id}-${variant.sku}`] ? (
                                      <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                      <Save className="w-5 h-5" />
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* Flattened View - Improved Table */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-md border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:table-cell">Variant (SKU)</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Attributes</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Level</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allVariants.map((variant, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                            {variant.productImage ? (
                              <Image
                                src={variant.productImage}
                                alt={variant.productName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="w-full h-full p-2 text-gray-400" />
                            )}
                          </div>
                          <span className="font-bold text-gray-900 line-clamp-1">{variant.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{variant.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {variant.colorName && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-medium">{variant.colorName}</span>}
                          {variant.size && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-medium">{variant.size}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="0"
                            value={localStock[`${variant.productId}-${variant.sku}`] ?? ''}
                            onChange={(e) => handleInputChange(variant.productId, variant.sku, e.target.value)}
                            className={`w-20 px-3 py-1.5 border rounded-xl text-sm font-semibold transition-all focus:ring-2 ${(localStock[`${variant.productId}-${variant.sku}`] || 0) < lowStockThreshold
                              ? 'border-red-200 bg-red-50 text-red-600 focus:ring-red-500/20'
                              : 'border-gray-200 bg-white text-gray-900 focus:ring-indigo-500/20'
                              }`}
                            disabled={savingStock[`${variant.productId}-${variant.sku}`]}
                          />
                          {(localStock[`${variant.productId}-${variant.sku}`] || 0) < lowStockThreshold && (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSaveStock(variant.productId, variant.sku)}
                          disabled={savingStock[`${variant.productId}-${variant.sku}`]}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 ${savingStock[`${variant.productId}-${variant.sku}`]
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
                            }`}
                        >
                          {savingStock[`${variant.productId}-${variant.sku}`] ? "..." : "Update"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeView === 'grouped' ? filteredProducts.length : allVariants.length) === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matching products found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Tailor your search or adjust the filters to find what you're looking for.
            </p>
            {(searchTerm || filterLowStock) && (
              <button
                onClick={() => { setSearchTerm(""); setFilterLowStock(false) }}
                className="mt-6 text-indigo-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
