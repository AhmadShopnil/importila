"use client"

import { useState } from "react"
import QuantitySelector from "./QuantitySelector"
import { groupVariantsByColor } from "@/utils/groupVariantsByColor"
import { useProductSelection } from "@/context/ProductSelectionContext"

export default function DesignCard({ design, setSelectedOnView }) {
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  const { selectedItems, updateItem } = useProductSelection()

  const groupedVariants = groupVariantsByColor(design?.variants)
  // console.log("groupedVariants",groupedVariants)

  // derive selected variant from color + size
  const selectedVariant =
    selectedColor && selectedSize
      ? groupedVariants[selectedColor]?.sizes.find(
          (s) => s.size === selectedSize
        )
      : null

  const getSelectedQuantity = (variant) => {
    const key = `${design._id}-${variant.sku}`
    return selectedItems[key]?.quantity || 0
  }

  const handleQuantityChange = (quantity) => {
    if (!selectedVariant) return

    updateItem(
      design._id,
      {
        name: design.name,
        price: design.price,
        image: design.image,

        colorName: groupedVariants[selectedColor].colorName,
        colorHex: groupedVariants[selectedColor].colorHex,
        size: selectedVariant.size,
        stock: selectedVariant.stock,
        sku: selectedVariant.sku,
      },
      quantity
    )
  }

  const handleSelectedOnView = () => {
    setSelectedOnView(design)
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card hover:shadow-lg transition-all">
      {/* Image */}
      <div
        onClick={handleSelectedOnView}
        className="relative h-[250px] md:h-[390px] md: w-full overflow-hidden bg-secondary cursor-pointer"
      >
        <img
          src={design?.featuredImage || "/placeholder.svg"}
          alt={design?.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div 
       onClick={handleSelectedOnView}
      
      className="border-b border-border bg-secondary p-2 md:p-4 cursor-pointer">
        <h3 className="text-sm md:text-lg font-semibold">{design?.name}</h3>
        <p className="hidden lg:flex mt-1 text-sm text-muted-foreground">
          {design?.description}
        </p>
        <p className="mt-2 text-xs md:text-sm">Price: ৳{design?.price}</p>
      </div>

      <div className="space-y-4 p-2 md:p-4">
        {/* COLOR */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Select Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {Object.values(groupedVariants).map((color) => (
            <div
              key={color?.colorName}
                onClick={() => {
                  setSelectedColor(color.colorName)
                  setSelectedSize(null)
                }}
            className={`py-1 px-2 md:py-2 md:px-3 border border-gray-300 rounded-lg flex justify-between items-center gap-2 cursor-pointer
              ${
                    selectedColor === color.colorName
                      ? "border-gray-900 border"
                      : "border-border"
                  }
              `}
            
            >
                <button
              
                className={`h-4 w-4 md:h-6 md:w-6 rounded-md border transition
                  ${
                    selectedColor === color.colorName
                      ? "border-primary"
                      : "border-border"
                  }`}
                style={{ backgroundColor: color.colorHex }}
                title={color.colorName}
              /> <p className="text-xs sm:text-sm md:text-base">{color?.colorName}</p>
            </div>
            ))}
          </div>
        </div>

        {/* SIZE */}
        {selectedColor && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Select Size
            </label>
            <div className="flex gap-2 flex-wrap">
              {groupedVariants[selectedColor]?.sizes?.map((sizeObj) => (
                <button
                  key={sizeObj.sku}
                  disabled={sizeObj.stock === 0}
                  onClick={() => setSelectedSize(sizeObj?.size)}
                  className={`rounded-md py-1 px-2 md:py-2 md:px-3 text-xs sm:text-sm md:text-base border transition cursor-pointer
                    ${
                      selectedSize === sizeObj.size
                        ? "border-gray-500 bg-gray-100 "
                        : "border-border"
                    }
                    ${
                      sizeObj.stock === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUANTITY */}
        {selectedVariant && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Quantity
            </label>
            <QuantitySelector
              currentQuantity={getSelectedQuantity(selectedVariant)}
                maxQuantity={selectedVariant?.stock}
              // maxQuantity={Math.min(selectedVariant.stock, 10)}
              onQuantityChange={handleQuantityChange}
            />
            {/* <p className="mt-1 text-sm text-muted-foreground">
              Max {Math.min(selectedVariant.stock, 10)} items allowed
            </p> */}
          </div>
        )}

        {!selectedVariant && (
          <p className="text-sm text-muted-foreground">
            Please select color and size
          </p>
        )}
      </div>
    </div>
  )
}
