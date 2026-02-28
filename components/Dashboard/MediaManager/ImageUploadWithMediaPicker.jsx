"use client"

import { useState } from "react"
import { Image as ImageIcon, X } from "lucide-react"
import MediaPicker from "../MediaManager/MediaPicker"
import Image from "next/image"

/**
 * ImageUploadWithMediaPicker Component
 * 
 * This component provides two ways to upload images:
 * 1. Direct file upload (traditional)
 * 2. Select from Media Library (reuse existing images)
 * 
 * Usage:
 * <ImageUploadWithMediaPicker
 *   value={imageUrl}
 *   onChange={(url) => setImageUrl(url)}
 *   folder="products"
 *   label="Product Image"
 * />
 */
export default function ImageUploadWithMediaPicker({
    value,
    onChange,
    folder = "general",
    label = "Image",
    required = false
}) {
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(value || null)

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)

        // Pass file to parent (for upload)
        onChange(file)
    }

    const handleMediaSelect = (url) => {
        setPreviewUrl(url)
        onChange(url)
        setShowMediaPicker(false)
    }

    const handleRemove = () => {
        setPreviewUrl(null)
        onChange(null)
    }

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {previewUrl ? (
                <div className="relative group border border-border rounded-2xl overflow-hidden h-64 bg-gray-50 flex items-center justify-center shadow-sm">
                    <Image
                        src={typeof previewUrl === 'string' ? previewUrl : URL.createObjectURL(previewUrl)}
                        alt={label}
                        fill
                        className="object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <button
                            type="button"
                            onClick={() => setShowMediaPicker(true)}
                            className="bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:scale-105 transition-transform"
                        >
                            Choose from Library
                        </button>
                        <label className="bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer">
                            Upload New
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-red-500 text-white p-2.5 rounded-xl shadow-xl hover:scale-105 transition-transform"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-8 transition-all bg-muted/20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <ImageIcon size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-foreground mb-2">Upload {label}</p>
                            <div className="flex gap-3 justify-center">
                                <label className="cursor-pointer bg-[#1E556E] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                                    Upload New
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowMediaPicker(true)}
                                    className="bg-white border-2 border-[#1E556E] text-[#1E556E] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E556E] hover:text-white transition-all"
                                >
                                    Choose from Library
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">PNG, JPG or WebP (max. 5MB)</p>
                        </div>
                    </div>
                </div>
            )}

            <MediaPicker
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                folder={folder}
            />
        </div>
    )
}
