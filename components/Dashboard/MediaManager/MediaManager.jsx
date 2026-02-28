"use client"

import { useState, useEffect } from "react"
import { X, Upload, Trash2, Copy, Check, Search, Filter, Image as ImageIcon } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Image from "next/image"

export default function MediaManager({ onSelect, folder = "general", multiple = false }) {
    const [media, setMedia] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filterFolder, setFilterFolder] = useState(folder)
    const [copiedId, setCopiedId] = useState(null)

    useEffect(() => {
        fetchMedia()
    }, [filterFolder])

    const fetchMedia = async () => {
        try {
            const url = filterFolder && filterFolder !== "all"
                ? `${BASE_URL}/api/media?folder=${filterFolder}`
                : `${BASE_URL}/api/media`

            const res = await fetch(url, { credentials: "include" })
            const data = await res.json()
            setMedia(data)
        } catch (error) {
            console.error("Failed to fetch media:", error)
            toast.error("Failed to load media")
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        setUploading(true)
        try {
            for (const file of files) {
                const fd = new FormData()
                fd.append("file", file)
                fd.append("folder", filterFolder === "all" ? "general" : filterFolder)

                const res = await fetch(`${BASE_URL}/api/media`, {
                    method: "POST",
                    body: fd,
                    credentials: "include"
                })

                if (res.ok) {
                    const newMedia = await res.json()
                    setMedia(prev => [newMedia, ...prev])
                } else {
                    toast.error(`Failed to upload ${file.name}`)
                }
            }
            toast.success("Upload complete")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (mediaId) => {
        if (!confirm("Delete this image? This action cannot be undone.")) return

        try {
            const res = await fetch(`${BASE_URL}/api/media?id=${mediaId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (res.ok) {
                setMedia(prev => prev.filter(m => m._id !== mediaId))
                toast.success("Media deleted")
            } else {
                toast.error("Failed to delete media")
            }
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Delete failed")
        }
    }

    const handleSelect = (mediaItem) => {
        if (multiple) {
            setSelectedMedia(prev => {
                const isSelected = prev.find(m => m._id === mediaItem._id)
                if (isSelected) {
                    return prev.filter(m => m._id !== mediaItem._id)
                } else {
                    return [...prev, mediaItem]
                }
            })
        } else {
            onSelect && onSelect(mediaItem.url)
        }
    }

    const handleConfirmSelection = () => {
        if (multiple && onSelect) {
            onSelect(selectedMedia.map(m => m.url))
        }
    }

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url)
        setCopiedId(url)
        toast.success("URL copied to clipboard")
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredMedia = media.filter(m =>
        m.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.folder?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const folders = ["all", "products", "sliders", "combos", "general", "categories"]

    return (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-[#1E556E]/5 to-transparent">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1E556E] flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Media Library</h2>
                            <p className="text-sm text-muted-foreground">
                                {filteredMedia.length} {filteredMedia.length === 1 ? 'image' : 'images'}
                            </p>
                        </div>
                    </div>

                    <label className="cursor-pointer">
                        <div className="flex items-center gap-2 bg-[#1E556E] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                            <Upload className="w-4 h-4" />
                            {uploading ? "Uploading..." : "Upload Images"}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by filename or folder..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white focus:ring-2 focus:ring-[#1E556E] outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            value={filterFolder}
                            onChange={(e) => setFilterFolder(e.target.value)}
                            className="pl-10 pr-8 py-2.5 rounded-xl border border-border bg-white focus:ring-2 focus:ring-[#1E556E] outline-none appearance-none cursor-pointer"
                        >
                            {folders.map(f => (
                                <option key={f} value={f}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Media Grid */}
            <div className="p-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-[#1E556E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-muted-foreground">Loading media...</p>
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                        <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-semibold">No images found</p>
                        <p className="text-sm text-muted-foreground mt-1">Upload some images to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredMedia.map((item) => {
                            const isSelected = multiple && selectedMedia.find(m => m._id === item._id)
                            return (
                                <div
                                    key={item._id}
                                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${isSelected
                                            ? 'border-[#1E556E] ring-4 ring-[#1E556E]/20'
                                            : 'border-border hover:border-[#1E556E]/50'
                                        }`}
                                    onClick={() => handleSelect(item)}
                                >
                                    <Image
                                        src={item.url}
                                        alt={item.fileName}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        <p className="text-white text-xs font-semibold text-center truncate w-full px-2">
                                            {item.fileName}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    copyToClipboard(item.url)
                                                }}
                                                className="p-2 bg-white rounded-lg hover:scale-110 transition-transform"
                                                title="Copy URL"
                                            >
                                                {copiedId === item.url ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-700" />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(item._id)
                                                }}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-[10px] text-white/80 text-center">
                                            {item.width} × {item.height}
                                        </div>
                                    </div>

                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#1E556E] rounded-full flex items-center justify-center shadow-lg">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Footer with selection actions */}
            {multiple && selectedMedia.length > 0 && (
                <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                    <p className="text-sm font-semibold">
                        {selectedMedia.length} {selectedMedia.length === 1 ? 'image' : 'images'} selected
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedMedia([])}
                            className="px-4 py-2 rounded-lg border border-border hover:bg-white transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleConfirmSelection}
                            className="px-6 py-2 bg-[#1E556E] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                        >
                            Use Selected
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
