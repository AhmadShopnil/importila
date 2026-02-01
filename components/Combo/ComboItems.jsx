"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export default function ComboItems({ items = [] }) {
  const sliderRefs = useRef({})
  const [activeImage, setActiveImage] = useState(null)

  const slide = (id, direction) => {
    const slider = sliderRefs.current[id]
    if (!slider) return

    slider.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    })
  }

  return (
    <>
      <section className="space-y-8 overflow-hidden pt-10">
        <h2 className="text-xl sm:text-2xl font-bold">
          What’s inside this combo
        </h2>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 ">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="
                rounded-sm border bg-white p-4 sm:p-5
                space-y-4 overflow-hidden
              "
            >
              {/* Image Slider */}
              <div className="relative overflow-hidden">
                {/* Desktop arrows only */}
                <button
                  onClick={() => slide(idx, "left")}
                  className="
                    hidden md:flex
                    absolute left-2 top-1/2 -translate-y-1/2 z-10
                    h-9 w-9 rounded-full bg-white shadow
                    items-center justify-center
                    hover:bg-gray-100
                  "
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => slide(idx, "right")}
                  className="
                    hidden md:flex
                    absolute right-2 top-1/2 -translate-y-1/2 z-10
                    h-9 w-9 rounded-full bg-white shadow
                    items-center justify-center
                    hover:bg-gray-100
                  "
                >
                  <ChevronRight size={18} />
                </button>

                {/* Images */}
                <div
                  ref={(el) => (sliderRefs.current[idx] = el)}
                  className="
                    flex gap-3
                    overflow-x-auto scroll-smooth
                    snap-x snap-mandatory
                    [-ms-overflow-style:none]
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {item.images.map((img, i) => (
                    <div
                      key={i}
                      className="snap-start flex-shrink-0"
                    >
                      <img
                        src={img}
                        alt={item.name}
                        onClick={() => setActiveImage(img)}
                        className="
                          h-28 w-28
                          sm:h-32 sm:w-32
                          md:h-36 md:w-36
                          object-cover rounded-sm border
                          cursor-pointer
                          hover:scale-105 transition
                        "
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="
            fixed inset-0 z-50 bg-black/70
            flex items-center justify-center p-4
          "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="
                absolute -top-4 -right-4
                h-9 w-9 rounded-full bg-white shadow
                flex items-center justify-center
              "
            >
              <X size={18} />
            </button>

            <img
              src={activeImage}
              alt="Preview"
              className="
                w-full max-h-[80vh]
                object-contain rounded-sm bg-white
              "
            />
          </div>
        </div>
      )}
    </>
  )
}
