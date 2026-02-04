"use client"

import { useState } from "react"
import { Plus, Trash2, Upload, Loader2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Image from "next/image"
import MediaPicker from "../MediaManager/MediaPicker"

export default function SliderForm({ initialData = null, onSubmit, loading: submitting }) {
    const [formData, setFormData] = useState(initialData || {
        name: "",
        location: "",
        isActive: true,
        slides: []
    })
    const [uploading, setUploading] = useState(false)
    const [activeSlideIndex, setActiveSlideIndex] = useState(null)
    const [showMediaPicker, setShowMediaPicker] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const addSlide = () => {
        setFormData(prev => ({
            ...prev,
            slides: [
                ...prev.slides,
                {
                    image: "",
                    link: "",
                    title: "",
                    subtitle: "",
                    order: prev.slides.length
                }
            ]
        }))
    }

    const updateSlide = (index, field, value) => {
        const updatedSlides = [...formData.slides]
        updatedSlides[index] = { ...updatedSlides[index], [field]: value }
        setFormData(prev => ({ ...prev, slides: updatedSlides }))
    }

    const removeSlide = (index) => {
        setFormData(prev => ({
            ...prev,
            slides: prev.slides.filter((_, i) => i !== index)
        }))
    }

    const moveSlide = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= formData.slides.length) return

        const updatedSlides = [...formData.slides]
        const temp = updatedSlides[index]
        updatedSlides[index] = updatedSlides[newIndex]
        updatedSlides[newIndex] = temp

        // Update labels if needed, but the array order is what matters
        setFormData(prev => ({ ...prev, slides: updatedSlides }))
    }

    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const fd = new FormData()
        fd.append("file", file)
        fd.append("folder", "sliders")

        try {
            const res = await fetch(`${BASE_URL}/api/media`, {
                method: "POST",
                body: fd,
                credentials: "include"
            })
            const data = await res.json()
            if (data.url) {
                updateSlide(index, "image", data.url)
                toast.success("Image uploaded")
            } else {
                toast.error("Upload failed")
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Error uploading image")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.location) {
            toast.error("Name and Location are required")
            return
        }
        onSubmit(formData)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-[#1E556E] rounded-full"></span>
                        General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/70">Slider Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Home Main Hero"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#1E556E] outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/70">Location Identifier *</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. home_hero (Must be unique)"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#1E556E] outline-none transition-all font-mono"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-border text-[#1E556E] focus:ring-[#1E556E]"
                            />
                            <label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">
                                Slider is Active
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#1E556E] rounded-full"></span>
                            Slides Configuration
                        </h2>
                        <button
                            type="button"
                            onClick={addSlide}
                            className="flex items-center gap-2 text-[#1E556E] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Slide
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.slides.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-muted rounded-2xl">
                                <p className="text-muted-foreground">No slides added yet. Click "Add Slide" to begin.</p>
                            </div>
                        ) : (
                            formData.slides.map((slide, index) => (
                                <div key={index} className="border border-border rounded-2xl p-6 bg-muted/30 relative group">
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => moveSlide(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1.5 bg-white border border-border shadow-sm rounded-lg hover:text-[#1E556E] disabled:opacity-30"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveSlide(index, 'down')}
                                            disabled={index === formData.slides.length - 1}
                                            className="p-1.5 bg-white border border-border shadow-sm rounded-lg hover:text-[#1E556E] disabled:opacity-30"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 bg-white border border-border rounded-md">
                                            Slide #{index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeSlide(index)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                        <div className="lg:col-span-4">
                                            <div className="relative aspect-[16/6] lg:aspect-square bg-white border-2 border-dashed border-border rounded-xl overflow-hidden flex flex-col items-center justify-center group/img">
                                                {slide.image ? (
                                                    <>
                                                        <Image
                                                            src={slide.image}
                                                            alt="Preview"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveSlideIndex(index)
                                                                    setShowMediaPicker(true)
                                                                }}
                                                                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold"
                                                            >
                                                                Choose from Library
                                                            </button>
                                                            <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-sm font-bold">
                                                                Upload New
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageUpload(e, index)}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                                            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                                                        </div>
                                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Upload Banner</span>
                                                        <div className="flex gap-2">
                                                            <label className="cursor-pointer bg-[#1E556E] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90">
                                                                Upload New
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageUpload(e, index)}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveSlideIndex(index)
                                                                    setShowMediaPicker(true)
                                                                }}
                                                                className="bg-white border-2 border-[#1E556E] text-[#1E556E] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1E556E] hover:text-white transition-all"
                                                            >
                                                                Choose from Library
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="lg:col-span-8 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title (Optional)</label>
                                                    <input
                                                        value={slide.title}
                                                        onChange={(e) => updateSlide(index, "title", e.target.value)}
                                                        placeholder="Ex: Spring Collection"
                                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white focus:ring-2 focus:ring-[#1E556E] outline-none text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subtitle (Optional)</label>
                                                    <input
                                                        value={slide.subtitle}
                                                        onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                                                        placeholder="Ex: Up to 50% Off"
                                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white focus:ring-2 focus:ring-[#1E556E] outline-none text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Redirect Link (URL)</label>
                                                <div className="relative">
                                                    <input
                                                        value={slide.link}
                                                        onChange={(e) => updateSlide(index, "link", e.target.value)}
                                                        placeholder="/products/new-arrivals"
                                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-border bg-white focus:ring-2 focus:ring-[#1E556E] outline-none text-sm"
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="bg-[#1E556E] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving Slider...
                            </>
                        ) : (
                            "Save Slider Configuration"
                        )}
                    </button>
                </div>
            </form>

            <MediaPicker
                isOpen={showMediaPicker}
                onClose={() => {
                    setShowMediaPicker(false)
                    setActiveSlideIndex(null)
                }}
                onSelect={(url) => {
                    if (activeSlideIndex !== null) {
                        updateSlide(activeSlideIndex, "image", url)
                    }
                    setShowMediaPicker(false)
                    setActiveSlideIndex(null)
                }}
                folder="sliders"
                multiple={false}
            />
        </>
    )
}
