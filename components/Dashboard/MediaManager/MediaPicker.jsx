"use client"

import { useState } from "react"
import { X, Image as ImageIcon } from "lucide-react"
import MediaManager from "./MediaManager"

export default function MediaPicker({
    isOpen,
    onClose,
    onSelect,
    folder = "general",
    multiple = false
}) {
    if (!isOpen) return null

    const handleSelect = (url) => {
        onSelect(url)
        if (!multiple) {
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-[#1E556E] to-[#2a6d8a]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Select Media</h2>
                            <p className="text-sm text-white/80">
                                Choose from your uploaded images or upload new ones
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Media Manager */}
                <div className="flex-1 overflow-y-auto">
                    <MediaManager
                        onSelect={handleSelect}
                        folder={folder}
                        multiple={multiple}
                    />
                </div>
            </div>
        </div>
    )
}
