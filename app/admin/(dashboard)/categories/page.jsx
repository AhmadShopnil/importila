"use client"

import { useEffect, useState } from "react"
import { Edit2, Trash2, Plus, ChevronRight, ChevronDown } from "lucide-react"
import Loading from "@/components/Loader/Loading"
import { BASE_URL } from "@/utils/baseUrl"
import toast from "react-hot-toast"



export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: null,
    isActive: true,
    order: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/categories`)
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `${BASE_URL}/api/categories/${editingId}` : `${BASE_URL}/api/categories`

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingId ? "Category updated" : "Category created")
        setFormData({ name: "", description: "", parentId: null, isActive: true, order: 0 })
        setEditingId(null)
        fetchCategories()
      } else {
        toast.error("Failed to save category")
      }
    } catch (error) {
      console.error("Failed to save category:", error)
      toast.error("Something went wrong")
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Delete this category? All subcategories will also be deleted.")) {
      try {
        const res = await fetch(`${BASE_URL}/api/categories/${id}`, { method: "DELETE" })
        if (res.ok) {
          toast.success("Category deleted")
          fetchCategories()
        } else {
          toast.error("Failed to delete category")
        }
      } catch (error) {
        console.error("Failed to delete category:", error)
        toast.error("Something went wrong")
      }
    }
  }

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories[category._id?.toString()]

    return (
      <div key={category._id?.toString() || category.id} className="mb-2">
        <div
          className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(category._id?.toString())}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                <h3 className="text-lg font-semibold">{category.name}</h3>
                {category.slug && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">/{category.slug}</span>
                )}
                {!category.isActive && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Inactive</span>
                )}
              </div>
              {category.description && (
                <p className="text-muted-foreground text-sm mb-2">{category?.description}</p>
              )}
            </div>

            {category._id && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditingId(category._id)
                    setFormData({
                      name: category?.name,
                      description: category?.description || "",
                      parentId: category?.parentId || null,
                      isActive: category?.isActive !== false,
                      order: category?.order || 0
                    })
                  }}
                  className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 text-sm cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="flex items-center gap-1 bg-destructive text-white px-3 py-1.5 rounded hover:opacity-90 text-sm cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      name: "",
                      description: "",
                      parentId: category._id,
                      isActive: true,
                      order: 0
                    })
                    setEditingId(null)
                  }}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:opacity-90 text-sm cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add Sub
                </button>
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold">Categories</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., T-Shirts, Pants, Dresses"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parent Category</label>
            <select
              value={formData.parentId || ""}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="">Top Level</option>
              {categories.map(cat => {
                const renderOptions = (c, level = 0) => {
                  const items = [
                    <option key={c._id} value={c._id}>
                      {"- ".repeat(level)}{c.name}
                    </option>
                  ];
                  if (c.children) {
                    c.children.forEach(child => {
                      items.push(...renderOptions(child, level + 1));
                    });
                  }
                  return items;
                };
                return renderOptions(cat);
              })}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Category description..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-[#1E556E] text-primary-foreground py-2 rounded-lg hover:opacity-90 font-semibold cursor-pointer"
          >
            {editingId ? "Update Category" : "Add Category"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setFormData({ name: "", description: "", parentId: null, isActive: true, order: 0 })
              }}
              className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:opacity-90"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Categories Tree */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-4">Category Tree</h2>

        {categories.length > 0 ? (
          categories.map(cat => renderCategory(cat))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No categories yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  )
}
