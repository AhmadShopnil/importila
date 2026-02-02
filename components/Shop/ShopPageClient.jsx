"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X, Filter } from "lucide-react"
import Link from "next/link"
import Container from "@/components/Container"
import { ProductCard } from "@/components/Home/ProductList/ProductList"
import { BASE_URL } from "@/utils/baseUrl"

export default function ShopPageClient({ initialProducts, initialPagination, categories: initialCategories }) {
    const [products, setProducts] = useState(initialProducts || [])
    const [pagination, setPagination] = useState(initialPagination || { page: 1, totalPages: 1, total: 0 })
    const [loading, setLoading] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Filters state
    const [search, setSearch] = useState("")
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
    const [sort, setSort] = useState("newest")
    const [currentPage, setCurrentPage] = useState(1)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.append("search", search)
            if (selectedCategories.length > 0) params.append("categories", selectedCategories.join(","))
            if (priceRange.min > 0) params.append("minPrice", priceRange.min)
            if (priceRange.max < 10000) params.append("maxPrice", priceRange.max)
            params.append("sort", sort)
            params.append("page", currentPage)
            params.append("limit", 12)

            const res = await fetch(`${BASE_URL}/api/products?${params.toString()}`)
            const data = await res.json()
            if (res.ok) {
                setProducts(data.products)
                setPagination(data.pagination)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }, [search, selectedCategories, priceRange, sort, currentPage])

    useEffect(() => {
        // Debounce search
        const delayDebounceFn = setTimeout(() => {
            fetchProducts()
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [search])

    useEffect(() => {
        // Other triggers immediate fetch
        if (currentPage === 1) {
            fetchProducts()
        } else {
            setCurrentPage(1)
        }
    }, [selectedCategories, priceRange, sort])

    useEffect(() => {
        fetchProducts()
    }, [currentPage])

    const toggleCategory = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange({ min: 0, max: 10000 })
        setSearch("")
        setSort("newest")
        setCurrentPage(1)
    }

    // Flatten categories for simpler list
    const flatCategories = useMemo(() => {
        const flatten = (items) => {
            return items.reduce((acc, item) => {
                acc.push(item)
                if (item.children && item.children.length > 0) {
                    acc.push(...flatten(item.children))
                }
                return acc
            }, [])
        }
        return flatten(initialCategories || [])
    }, [initialCategories])

    return (
        <section className="py-8 md:py-16 bg-background min-h-screen">
            <Container>
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-2">Our Collection</h1>
                        <p className="text-muted-foreground">Discover the latest styles for your little ones.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="p-2.5 bg-card border border-border rounded-xl md:hidden"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-24 h-fit">
                        {/* Categories */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-5">Categories</h3>
                            <div className="space-y-3">
                                {flatCategories.map((cat) => (
                                    <label key={cat._id} className="flex items-center gap-3 group cursor-pointer">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedCategories.includes(cat._id) ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`}>
                                            {selectedCategories.includes(cat._id) && <ChevronDown className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedCategories.includes(cat._id)}
                                            onChange={() => toggleCategory(cat._id)}
                                        />
                                        <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat._id) ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            {cat.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-5">Price Range</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Min</label>
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:bg-background outline-none transition-all"
                                        />
                                    </div>
                                    <div className="mt-4 text-muted-foreground">—</div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Max</label>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:bg-background outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="w-full py-3 text-sm font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center gap-2 border border-dashed border-border rounded-xl hover:border-destructive/50"
                        >
                            <X className="w-4 h-4" /> Clear All Filters
                        </button>
                    </aside>

                    {/* Product Main Area */}
                    <main className="lg:col-span-9 space-y-8">
                        {/* Status Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-card border border-border rounded-2xl px-6 py-4 shadow-sm gap-4">
                            <div className="text-sm font-medium text-muted-foreground">
                                Showing <span className="text-foreground">{products.length}</span> of <span className="text-foreground">{pagination.total}</span> items
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Sort By:</span>
                                <div className="relative group">
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="appearance-none bg-muted/50 border border-border rounded-lg px-4 py-1.5 pr-10 text-xs font-bold focus:bg-background outline-none transition-all cursor-pointer"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading && products.length === 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-card border border-border border-dashed rounded-[3rem] text-center px-6">
                                <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-full mb-6">
                                    <Search className="w-10 h-10 text-muted-foreground opacity-30" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
                                <p className="text-muted-foreground mb-8 text-balance max-w-sm">We couldn't find any items matching your current filters. Try adjusting your search.</p>
                                <button
                                    onClick={clearFilters}
                                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-10">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1 || loading}
                                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {[...Array(pagination.totalPages)].map((_, i) => {
                                        const pageNum = i + 1
                                        // Simple pagination logic: show current, first, last, and neighbors
                                        if (
                                            pageNum === 1 ||
                                            pageNum === pagination.totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === pageNum ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'border border-border hover:bg-muted'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                            return <span key={pageNum} className="text-muted-foreground font-bold px-1">...</span>
                                        }
                                        return null
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                    disabled={currentPage === pagination.totalPages || loading}
                                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </Container>

            {/* Mobile Filter Drawer */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-300 lg:hidden ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsFilterOpen(false)}
                />
                <div className={`absolute right-0 top-0 h-full w-[300px] bg-card shadow-2xl transition-transform duration-300 transform p-8 overflow-y-auto ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary" /> Filters
                        </h2>
                        <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-6 h-6 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="space-y-10">
                        {/* Mobile Categories */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Categories</h3>
                            <div className="space-y-3">
                                {flatCategories.map((cat) => (
                                    <label key={cat._id} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat._id)}
                                            onChange={() => toggleCategory(cat._id)}
                                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Price Range */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Price Range</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-border">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="w-full py-4 text-sm font-bold text-muted-foreground transition-colors"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
