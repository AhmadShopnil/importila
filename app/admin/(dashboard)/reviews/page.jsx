"use client"

import { useState, useEffect } from "react"
import { UploadCloud, Trash2, Plus, X, MessageSquare } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newReview, setNewReview] = useState({
        customerName: "",
        imageUrl: "",
        isActive: true
    })

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews")
            const data = await res.json()
            if (res.ok) {
                setReviews(data)
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const fd = new FormData()
        fd.append("file", file)
        fd.append("folder", "reviews")

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd
            })
            const data = await res.json()
            if (res.ok) {
                setNewReview(prev => ({ ...prev, imageUrl: data.url }))
                toast.success("Image uploaded")
            } else {
                toast.error(data.error || "Upload failed")
            }
        } catch (error) {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newReview.imageUrl) {
            toast.error("Please upload a review screenshot")
            return
        }

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReview)
            })
            if (res.ok) {
                toast.success("Review added successfully")
                setShowAddModal(false)
                setNewReview({ customerName: "", imageUrl: "", isActive: true })
                fetchReviews()
            } else {
                toast.error("Failed to add review")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this review?")) return

        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                toast.success("Review deleted")
                setReviews(reviews.filter(r => r._id !== id))
            } else {
                toast.error("Failed to delete")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <MessageSquare className="text-primary" />
                        Customer Reviews
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage reviews/screenshots shown on landing pages</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all font-semibold"
                >
                    <Plus size={20} /> Add New Review
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-card border border-border rounded-2xl overflow-hidden group relative transition-all hover:shadow-lg">
                            <div className="aspect-[4/5] relative">
                                <img
                                    src={review.imageUrl}
                                    alt={review.customerName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="bg-white text-destructive p-3 rounded-xl hover:scale-110 transition-transform shadow-xl"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 border-t border-border bg-muted/20">
                                <h3 className="font-bold text-sm truncate">{review.customerName}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
                                    Added on: {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {reviews.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-border text-muted-foreground">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No reviews added yet. Start by uploading screenshots!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-nunito">Add Customer Review</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Customer Name / Reference</label>
                                <input
                                    type="text"
                                    value={newReview.customerName}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                                    placeholder="e.g. Happy Customer 1"
                                    className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-sm focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground inline-flex items-center gap-2">
                                    Review Screenshot <span className="text-red-500">*</span>
                                </label>
                                <div className={`relative border-2 border-dashed rounded-2xl p-4 min-h-[200px] flex flex-col items-center justify-center gap-3 transition-all ${newReview.imageUrl ? 'border-primary/30' : 'border-border hover:border-primary/50 bg-muted/20'}`}>
                                    {newReview.imageUrl ? (
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                                            <img src={newReview.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setNewReview(prev => ({ ...prev, imageUrl: "" }))}
                                                className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg text-destructive shadow-lg transition-transform hover:scale-110"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                                <UploadCloud size={24} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-foreground">{uploading ? "Uploading..." : "Click to upload screenshot"}</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max. 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                disabled={uploading}
                                                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!newReview.imageUrl || uploading}
                                className="w-full bg-primary text-white h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                Publish Review
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
