"use client"

import DesignCard from "./DesignCard"

export default function ItemList({
  products = [],
  onItemUpdate,
  selectedItems,
  setSelectedOnView,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        Available Designs ({products.length})
      </h2>

      {products.length === 0 && (
        <p className="text-sm text-muted-foreground">No products found</p>
      )}

      <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3">
        {products?.map((product) => (
          <DesignCard
            key={product._id}
            design={product}   
            onItemUpdate={onItemUpdate}
            selectedItems={selectedItems}
            setSelectedOnView={setSelectedOnView}
          />
        ))}
      </div>
    </div>
  )
}
