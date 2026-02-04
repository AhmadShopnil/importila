"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Trash2, Search } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Loading from "@/components/Loader/Loading"

export default function TrashProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchTrashedProducts()
    }, [])

    const fetchTrashedProducts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/products/trash`)
            const data = await res.json()
            setProducts(data)
        } catch (error) {
            console.error("Failed to fetch trashed products:", error)
            toast.error("Failed to load trash")
        } finally {
            setLoading(false)
        }
    }

    const handleRestore = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/products/restore/${id}`, { method: "POST" })
            if (res.ok) {
                setProducts(products.filter((p) => p._id !== id))
                toast.success("Product restored")
            } else {
                toast.error("Failed to restore product")
            }
        } catch (error) {
            console.error("Restore error:", error)
            toast.error("Something went wrong")
        }
    }

    const handleDeletePermanent = async (id) => {
        if (confirm("This action is permanent and cannot be undone. Are you sure?")) {
            try {
                const res = await fetch(`${BASE_URL}/api/products/${id}?permanent=true`, { method: "DELETE" })
                if (res.ok) {
                    setProducts(products.filter((p) => p._id !== id))
                    toast.success("Product permanently deleted")
                } else {
                    toast.error("Failed to delete product")
                }
            } catch (error) {
                console.error("Delete error:", error)
                toast.error("Something went wrong")
            }
        }
    }

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.designName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <Loading />

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-muted rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Trash List</h1>
                        <p className="text-muted-foreground text-sm">Review or permanently delete trashed products.</p>
                    </div>
                </div>
            </div>

            {products.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search in trash..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                    />
                </div>
            )}

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Product</th>
                            <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Design Name</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.featuredImage}
                                            alt=""
                                            className="w-10 h-10 rounded object-cover bg-muted"
                                        />
                                        <div>
                                            <div className="font-semibold text-foreground">{product.name}</div>
                                            <div className="text-xs text-muted-foreground">Original Price: ৳{product.price}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground font-medium">
                                    {product.designName || "N/A"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleRestore(product._id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold text-xs transition-colors"
                                            title="Restore Product"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => handleDeletePermanent(product._id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold text-xs transition-colors"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Trash is empty</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                            Any products you move to trash will appear here for 30 days before being permanently deleted (manual only for now).
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
