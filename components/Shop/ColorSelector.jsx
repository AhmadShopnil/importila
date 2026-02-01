"use client"

export default function ColorSelector({ colors, selectedColor, onColorChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onColorChange(color.id)}
          className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
            selectedColor === color.id
              ? "border-2 border-primary bg-primary/10"
              : "border border-border bg-background hover:border-primary"
          }`}
          title={color.name}
        >
          {/* Color Swatch */}
          <div
            className="h-5 w-5 rounded-full border border-gray-300 transition-transform group-hover:scale-110"
            style={{ backgroundColor: color.hex }}
          />
          <span className="text-sm font-medium text-foreground">{color.name}</span>
        </button>
      ))}
    </div>
  )
}
