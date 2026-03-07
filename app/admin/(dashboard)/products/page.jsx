"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Trash2, X } from "lucide-react"
import Image from "next/image"
import Loading from "@/components/Loader/Loading"
import TableRow from "@/components/Dashboard/Products/TableRow"

import { useGetProductsQuery, useDeleteProductMutation } from "@/lib/redux/api/productApi"

export default function ProductsPage() {
  const { data: products = [], isLoading: loading } = useGetProductsQuery()
  const [deleteProduct] = useDeleteProductMutation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap()
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  const filteredProducts = products?.filter((p) =>
    !p.isTrashed && (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.designName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || []


  // if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your inventory and product listings.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/admin/products/trash"
            className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80 flex-1 sm:flex-initial justify-center"
          >
            <Trash2 className="w-5 h-5" />
            Trash List
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#1E556E] text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 flex-1 sm:flex-initial justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>
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
                onClickImage={setSelectedImage}
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

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-[4/5] md:aspect-auto md:h-[85vh] bg-transparent rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Large product preview"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>
        </div>
      )}
    </div>
  )
}
