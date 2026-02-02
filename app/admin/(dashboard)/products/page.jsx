"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import Loading from "@/components/Loader/Loading"
import TableRow from "@/components/Dashboard/Products/TableRow"
import { BASE_URL } from "@/utils/baseUrl"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // console.log("products from dashboard")
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {

      const res = await fetch(`${BASE_URL}/api/products`)
      const data = await res.json()
      //  console.log("products from dashboard",data )
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }


  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" })
        if (res.ok) {
          setProducts(products.filter((p) => p._id !== id))
        }
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.designName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []


  // if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#1E556E] text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
      </div>

      {/* Products Table - Responsive */}
      <div className="overflow-x-auto bg-card rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Design Name</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Price</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Stock</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts?.map((product) => (
              <TableRow
                key={product._id}
                product={product}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {products.length === 0 ? "No products yet. Add one to get started!" : "No products match your search."}
        </div>
      )}
    </div>
  )
}
