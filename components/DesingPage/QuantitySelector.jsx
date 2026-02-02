"use client"

export default function QuantitySelector({ currentQuantity, maxQuantity = 5000, onQuantityChange }) {
  const handleIncrement = () => {
    if (currentQuantity < maxQuantity) onQuantityChange(currentQuantity + 1)
  }

  const handleDecrement = () => {
    if (currentQuantity > 0) onQuantityChange(currentQuantity - 1)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrement}
        className="flex h-6 w-6 md:h-8 md:w-8   items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:bg-secondary disabled:opacity-50"
        disabled={currentQuantity === 0}
      >
        −
      </button>
      <div className="w-12 text-center">
        <span className="text-lg font-semibold text-foreground">{currentQuantity}</span>
      </div>
      <button
        onClick={handleIncrement}
        className="flex h-6 w-6 md:h-8 md:w-8  items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:bg-secondary"
      >
        +
      </button>
    </div>
  )
}
