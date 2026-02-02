"use client"

import { useState, useEffect } from "react"

export default function ProductGallery({ selectedOnView }) {
  const [mainImage, setMainImage] = useState("/placeholder.svg")
  const [thumbnails, setThumbnails] = useState([])
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    price: 0,
    minOrder: 3,
  })

  // console.log("thubnails", thumbnails)


  useEffect(() => {
    if (selectedOnView) {
      // Set main image to the first variant's image or product image
      setMainImage(selectedOnView?.featuredImage || "/placeholder.svg")

      setThumbnails(selectedOnView?.images)

      // Set product info
      setProductInfo({
        name: selectedOnView.name,
        description: selectedOnView.description || "",
        price: selectedOnView.price || 0,
        minOrder: 3, // or you can get from selectedOnView if dynamic
      })
    }
  }, [selectedOnView])

  if (!selectedOnView) {
    return <div className="text-center text-muted-foreground">Select a product to view details</div>
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-sm border border-border bg-secondary">
        <img
          src={mainImage || "/placeholder.svg"}
          alt={productInfo?.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {thumbnails?.map((thumb, idx) => (
          <button
            key={idx}
            onClick={() => setMainImage(thumb)}
            className="cursor-pointer aspect-square w-20 overflow-hidden rounded-sm border-2 border-border transition-all hover:border-primary"
          >
            <img
              src={thumb || "/placeholder.svg"}
              alt={`Thumbnail ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Product Info */}
      <div className="space-y-2 rounded-sm bg-secondary p-4">
        <h2 className="font-semibold text-foreground">{productInfo.name}</h2>
        <p className="text-sm text-muted-foreground">{productInfo.description}</p>
        <div className="pt-2">
          <span className="text-lg font-bold text-primary">৳ {productInfo.price} per set</span>
          <p className="text-sm text-muted-foreground">
            Minimum {productInfo.minOrder} sets per order
          </p>
        </div>
      </div>
    </div>
  )
}
