"use client"

export default function SizeSelector({ sizes, selectedSize, onSizeChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeChange(size)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
            selectedSize === size
              ? "bg-primary text-primary-foreground shadow-md"
              : "border border-border bg-background text-foreground hover:border-primary hover:bg-secondary"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
