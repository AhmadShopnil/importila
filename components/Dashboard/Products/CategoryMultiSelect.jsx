"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Check, ChevronDown } from "lucide-react"

export default function CategoryMultiSelect({ selectedIds, onChange, categories }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const dropdownRef = useRef(null)

    // Normalize selectedIds to handle both array of IDs and array of objects
    const normalizedSelectedIds = selectedIds.map(item =>
        typeof item === 'object' ? item._id : item
    )

    // Filter categories based on search term
    const filteredCategories = categories.filter(cat =>
        cat.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Selected category objects
    const selectedCategories = categories.filter(cat => normalizedSelectedIds.includes(cat._id))

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const toggleCategory = (cat) => {
        const isSelected = normalizedSelectedIds.includes(cat._id)
        let newSelected
        if (isSelected) {
            newSelected = selectedCategories.filter(c => c._id !== cat._id)
        } else {
            newSelected = [...selectedCategories, cat]
        }
        // Pass array of objects with _id and name
        onChange(newSelected.map(c => ({ _id: c._id, name: c.name })))
    }

    const removeCategory = (e, id) => {
        e.stopPropagation()
        const newSelected = selectedCategories.filter(c => c._id !== id)
        onChange(newSelected.map(c => ({ _id: c._id, name: c.name })))
    }

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="form-label font-bold mb-2 block">Categories *</label>

            {/* Search/Selection Box */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`min-h-[44px] w-full flex flex-wrap gap-2 p-2 border rounded-xl bg-white cursor-pointer transition-all ${isOpen ? "ring-2 ring-primary/20 border-primary" : "border-gray-300 hover:border-gray-400"
                    }`}
            >
                {selectedCategories.length > 0 ? (
                    selectedCategories.map(cat => (
                        <span
                            key={cat._id}
                            className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-lg border border-primary/20"
                        >
                            {cat.name}
                            <button
                                onClick={(e) => removeCategory(e, cat._id)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                type="button"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))
                ) : (
                    <span className="text-gray-400 text-sm py-1 px-2">Select categories...</span>
                )}

                <div className="ml-auto flex items-center pr-1 text-gray-400">
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-3 border-b sticky top-0 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(cat => (
                                <div
                                    key={cat._id}
                                    onClick={() => toggleCategory(cat)}
                                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${normalizedSelectedIds.includes(cat._id)
                                        ? "bg-primary/5 text-primary"
                                        : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{cat.name}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                            {cat.fullName.includes(" > ") ? cat.fullName : "Root Category"}
                                        </span>
                                    </div>
                                    {normalizedSelectedIds.includes(cat._id) && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-gray-500 italic">
                                No categories found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
