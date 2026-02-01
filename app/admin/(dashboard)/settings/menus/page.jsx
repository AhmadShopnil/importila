"use client"

import { useEffect, useState } from "react"
import { Save, Plus, Trash2, GripVertical, ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Loading from "@/components/Loader/Loading"

export default function MenuManagementPage() {
    const [menus, setMenus] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingMenu, setEditingMenu] = useState(null)

    useEffect(() => {
        fetchMenus()
    }, [])

    const fetchMenus = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/menus`)
            const data = await res.json()
            if (res.ok) {
                setMenus(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error("Failed to fetch menus:", error)
            toast.error("Failed to load menus")
        } finally {
            setLoading(false)
        }
    }

    const handleAddMenu = () => {
        setEditingMenu({
            _id: null,
            label: "",
            url: "/",
            position: menus.length,
            isExternal: false,
            openInNewTab: false,
            isActive: true,
            children: []
        })
    }

    const handleSaveMenu = async () => {
        if (!editingMenu.label || !editingMenu.url) {
            toast.error("Please fill in all required fields")
            return
        }

        setSaving(true)
        try {
            const method = editingMenu._id ? "PUT" : "POST"
            const res = await fetch(`${BASE_URL}/api/menus`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingMenu),
            })

            if (res.ok) {
                toast.success(`Menu ${editingMenu._id ? "updated" : "created"} successfully!`)
                setEditingMenu(null)
                fetchMenus()
            } else {
                toast.error("Failed to save menu")
            }
        } catch (error) {
            console.error("Failed to save menu:", error)
            toast.error("An error occurred")
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteMenu = async (id) => {
        if (!confirm("Are you sure you want to delete this menu item?")) return

        try {
            const res = await fetch(`${BASE_URL}/api/menus?id=${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                toast.success("Menu deleted successfully!")
                fetchMenus()
            } else {
                toast.error("Failed to delete menu")
            }
        } catch (error) {
            console.error("Failed to delete menu:", error)
            toast.error("An error occurred")
        }
    }

    if (loading) return <Loading />

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Navigation Menus</h2>
                        <p className="text-sm text-muted-foreground">
                            Create and manage navigation menus for your storefront
                        </p>
                    </div>
                    <button
                        onClick={handleAddMenu}
                        className="flex items-center gap-2 bg-[#1E556E] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Menu Item
                    </button>
                </div>
            </div>

            {/* Menu List */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                {menus.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="mb-4">No menu items yet</p>
                        <button
                            onClick={handleAddMenu}
                            className="text-[#1E556E] hover:underline font-semibold"
                        >
                            Create your first menu item
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {menus.map((menu) => (
                            <div
                                key={menu._id}
                                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{menu.label}</h3>
                                        {menu.isExternal && (
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                        )}
                                        {!menu.isActive && (
                                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{menu.url}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingMenu(menu)}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMenu(menu._id)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingMenu && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-xl font-semibold">
                                {editingMenu._id ? "Edit Menu Item" : "Add Menu Item"}
                            </h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-2">Menu Label *</label>
                                    <input
                                        type="text"
                                        value={editingMenu.label}
                                        onChange={(e) => setEditingMenu({ ...editingMenu, label: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                                        placeholder="Home, Shop, About Us"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-2">URL *</label>
                                    <input
                                        type="text"
                                        value={editingMenu.url}
                                        onChange={(e) => setEditingMenu({ ...editingMenu, url: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                                        placeholder="/shop, /about, https://example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Position</label>
                                    <input
                                        type="number"
                                        value={editingMenu.position}
                                        onChange={(e) => setEditingMenu({ ...editingMenu, position: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                                        min="0"
                                    />
                                </div>

                                <div className="flex items-center gap-6 pt-8">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingMenu.isActive}
                                            onChange={(e) => setEditingMenu({ ...editingMenu, isActive: e.target.checked })}
                                            className="w-4 h-4 text-[#1E556E] rounded"
                                        />
                                        <span className="text-sm font-medium">Active</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingMenu.openInNewTab}
                                            onChange={(e) => setEditingMenu({ ...editingMenu, openInNewTab: e.target.checked })}
                                            className="w-4 h-4 text-[#1E556E] rounded"
                                        />
                                        <span className="text-sm font-medium">Open in new tab</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-border flex gap-3">
                            <button
                                onClick={() => setEditingMenu(null)}
                                className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMenu}
                                disabled={saving}
                                className="flex-1 px-4 py-3 bg-[#1E556E] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Menu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
