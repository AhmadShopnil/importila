"use client"

import { useEffect, useMemo, useState } from "react"
import CategoryToggle from "@/components/Shop/CategoryToggle"
import ProductGallery from "@/components/Shop/ProductGallery"
import ItemList from "@/components/Shop/ItemList"
import SummaryBar from "@/components/Shop/SummaryBar"
import Container from "@/components/Container"

export default function ShopPageClient({ products = [] }) {
  //  Default = all
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItems, setSelectedItems] = useState({})
  const [selectedOnView, setSelectedOnView] = useState(null)

  //  Filter products
  const categoryProducts = useMemo(() => {
    if (selectedCategory === "all") return products
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  // Auto select first visible product
  useEffect(() => {
    setSelectedOnView(categoryProducts[0] || null)
  }, [categoryProducts])

  const handleItemUpdate = (_id, color, size, quantity) => {
    setSelectedItems((prev) => {
      const key = `${_id}-${color}-${size}`
      const updated = { ...prev }

      if (quantity === 0) {
        delete updated[key]
      } else {
        updated[key] = { _id, color, size, quantity }
      }

      return updated
    })
  }

  const handleRemoveItem = (key) => {
    setSelectedItems((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const totalSets = Object.values(selectedItems).reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-background">


      {/* Body */}
      <Container className=" pt-8 mb-22">
        {/* Category */}
        <CategoryToggle
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT – Fixed */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductGallery selectedOnView={selectedOnView} />
          </div>

          {/* RIGHT – Scrollable but NO scrollbar */}
          <div
            className="lg:col-span-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE / Edge
            }}
          >
            <ItemList
              products={categoryProducts}
              onItemUpdate={handleItemUpdate}
              selectedItems={selectedItems}
              setSelectedOnView={setSelectedOnView}
            />
          </div>

          {/* Component-scoped scrollbar removal */}
          <style jsx>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>
        </div>

      </Container>

      {/* Summary */}
      <div className="p-6 ">
        <SummaryBar
          totalSets={totalSets}
          selectedItems={selectedItems}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </div>
  )
}
