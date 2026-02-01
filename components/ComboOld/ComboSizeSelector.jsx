export default function ComboSizeSelector({
  sizes,
  selectedSize,
  onSelect,
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Select Size</h2>

      <div className="flex gap-3 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`px-5 py-2 rounded-lg border font-medium transition
              ${
                selectedSize === size
                  ? "bg-primary text-white"
                  : "hover:border-primary"
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </section>
  )
}
