"use client";

import { Plus, X, Check } from "lucide-react";
import Image from "next/image";
import { useBundle } from "@/context/BundleContext";

const ProductSlots = () => {
    const { state, setActiveSlot, removeFromSlot, updateSlotColor, openProductModal } = useBundle();
    const { slots, activeSlotIndex } = state;

    const handleSlotClick = (index) => {
        setActiveSlot(index);
        openProductModal();
    };

    if (slots.length === 0) return null;

    return (
        <section id="selected-slots" className="py-6 md:py-12  bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1E556E] mb-2">
                        Your Selected Items
                    </h2>
                    <p className="text-muted-foreground">
                        Click on a slot to select a product from the collections
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                    {slots?.map((slot, index) => {
                        const isActive = activeSlotIndex === index;
                        const isFilled = slot.product !== null;

                        return (
                            <div
                                key={index}
                                onClick={() => handleSlotClick(index)}
                                role="button"
                                aria-label={`${isFilled ? 'Filled' : 'Empty'} slot ${index + 1}. ${isFilled ? slot.product.name : 'Click to select a product'}`}
                                aria-current={isActive}
                                className={`relative aspect-square rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden  ${isActive
                                    ? "border-accent border-dashed bg-accent/5 shadow-elevated scale-[1.05] ring-4 ring-accent/20 z-20 animate-pulse-subtle"
                                    : isFilled
                                        ? "border-primary/50 bg-card"
                                        : "border-border bg-muted/30 hover:border-primary/30"
                                    }`}
                            >
                                {/* Slot Label */}
                                {/* <div
                                    className={`absolute top-2 left-2 z-10 text-xs font-bold px-2 py-1 rounded-full ${isFilled
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    Slot {index + 1}
                                </div> */}

                                {isFilled && slot?.product ? (
                                    <>
                                        {/* Product Image */}
                                        <Image
                                            src={slot?.product.image || slot?.product?.featuredImage}
                                            alt={slot?.product?.name || "Product"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 150px"
                                        />

                                        {/* Overlay with info */}
                                        <div className="absolute inset-0  flex flex-col justify-end p-3">
                                            {/* <p className="text-white text-sm md:text-base font-semibold truncate mb-2">
                                                {slot?.product.name}
                                            </p>
                                            <p className="text-white text-sm md:text-base font-bold truncate mb-2">
                                                Selected Colour:
                                            </p> */}
                                            {/* <p className="text-white text-sm md:text-base font-semibold truncate mb-2">
                                                {slot?.selectedColor}
                                            </p> */}


                                            {/* Color Selection */}
                                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                                                {slot.product.displayColors?.map((color) => (
                                                    <button
                                                        key={color.name}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateSlotColor(index, color.name);
                                                        }}
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${slot.selectedColor === color.name
                                                            ? "border-white scale-110"
                                                            : "border-transparent hover:scale-105"
                                                            }`}
                                                        style={{ backgroundColor: color.hex }}
                                                        title={color.name}
                                                    >
                                                        {slot.selectedColor === color.name && (
                                                            <Check size={10} className="text-white drop-shadow-lg" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromSlot(index);
                                            }}
                                            aria-label={`Remove ${slot.product.name} from slot ${index + 1}`}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                                        >
                                            <X size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center p-2">
                                        <div
                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            <Plus size={24} />
                                        </div>
                                        <span className="text-[10px] md:text-xs font-medium text-muted-foreground">
                                            {isActive ? "Add Item" : "Add Item"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductSlots;
