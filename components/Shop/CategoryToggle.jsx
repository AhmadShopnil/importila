"use client"

export default function CategoryToggle({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: "all", label: "All", icon: "👧" },
    { id: "boys", label: "Boys", icon: "👦" },
    { id: "girls", label: "Girls", icon: "👧" },
  ]

  return (
    <div className="flex items-center gap-4">
      
      <div className="flex gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all cursor-pointer ${
              selectedCategory === category.id
                ? "bg-[#1C546D] text-primary-foreground shadow-md"
                : "border border-border bg-background text-foreground hover:border-primary hover:bg-secondary"
            }`}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
