"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import Image from "next/image";
import { useBundle } from "@/context/BundleContext";

const ProductGrid = ({ combo }) => {
    const { state, addProductToSlot } = useBundle();
    const { selectedBundle, activeSlotIndex } = state;
    const [selectedProductForColor, setSelectedProductForColor] = useState(null);
    const disabled = !selectedBundle;


    const getUniqueColors = (variants) => {
        if (!variants || variants.length === 0) return [];
        const seen = new Set();
        const unique = [];
        for (const v of variants) {
            if (!seen.has(v.colorName)) {
                seen.add(v.colorName);
                unique.push(v);
            }
        }
        return unique;
    };

    const handleProductClick = (product) => {
        if (disabled) return;

        // Always ask for color before adding if there are variants
        if (product.variants && product.variants.length > 0) {
            setSelectedProductForColor(product);
        } else {
            addProductToSlot(product);

            // Check if this was the last empty slot
            const emptySlots = state.slots.filter(s => s.product === null).length;
            if (emptySlots <= 1) {
                setTimeout(() => {
                    const sizeSection = document.getElementById("size-selection");
                    if (sizeSection) {
                        sizeSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }, 500);
            }
        }
    };

    const confirmColorAndAdd = (colorName, variantImage = null) => {
        if (selectedProductForColor) {
            addProductToSlot(selectedProductForColor, colorName, variantImage);
            setSelectedProductForColor(null);

            // Check if this was the last empty slot
            const rect = document.getElementById("product-grid")?.getBoundingClientRect();
            const emptySlots = state.slots.filter(s => s.product === null).length;

            if (emptySlots <= 1) { // 1 because the state hasn't updated yet in this closure
                setTimeout(() => {
                    const sizeSection = document.getElementById("size-selection");
                    if (sizeSection) {
                        sizeSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }, 500);
            }
        }
    };

    return (
        <section id="product-grid" className="py-6 md:py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    {!disabled && activeSlotIndex !== null && (
                        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full mb-4 animate-bounce-subtle shadow-md">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-wider">
                                Choosing for Slot {activeSlotIndex + 1}
                            </span>
                        </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1E556E] mb-2">
                        {combo?.productGridTitle || "Choose Your Favorite Styles"}
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {disabled
                            ? "Select a bundle size first to start picking items"
                            : activeSlotIndex !== null
                                ? `Select an item below to fill Slot ${activeSlotIndex + 1}. You can always change it later.`
                                : "All slots are filled! Click on a slot above if you want to replace an item."}
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {combo?.products?.map((product, idx) => (
                        <div
                            key={product._id || product.id}
                            onClick={() => handleProductClick(product)}
                            className={`group relative aspect-square rounded-[8px] overflow-hidden  bg-card shadow-sm transition-all
                                 duration-300 ${disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:shadow-elevated hover:scale-[1.02] cursor-pointer"
                                }`}
                        >
                            <Image
                                src={product?.featuredImage || product?.image}
                                alt={product?.name || "Product"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, 20vw"
                                priority={idx < 6}
                            />

                            {/* Desktop Overlay (Visible on hover) */}
                            <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-3 pointer-events-none">
                                <div className="space-y-2 pointer-events-auto">
                                    <p className="text-white text-sm font-semibold truncate">
                                        {product?.name}
                                    </p>
                                    <div className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-full text-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        সিলেক্ট করুন
                                    </div>
                                    <div className="flex gap-1">
                                        {getUniqueColors(product?.variants).map((variant, i) => (
                                            <div
                                                key={i}
                                                className="w-3 h-3 rounded-full border border-white/50"
                                                style={{ backgroundColor: variant?.colorHex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Selection Bar (Always visible) */}
                            <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-1  rounded-b-[5px] flex flex-col gap-1 shadow-[0_-4px_8px_rgba(0,0,0,0.05)]">
                                {/* <span className="text-[10px] font-bold text-foreground truncate w-full text-center px-1">
                                    {product?.name}
                                </span> */}
                                <div className="w-full bg-primary text-white text-[10px] font-bold py-1 rounded-[5px] flex items-center justify-center gap-1 active:scale-95 transition-transform">
                                    <Plus size={10} strokeWidth={3} />
                                    সিলেক্ট করুন
                                </div>
                            </div>



                            {/* Desktop Plus Button */}
                            {!disabled && (
                                <div className="hidden md:flex absolute top-2 right-2 w-8 h-8 rounded-full bg-primary text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                    <Plus size={18} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Color Selection Modal */}
            {selectedProductForColor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Select Color</h3>
                                <button
                                    onClick={() => setSelectedProductForColor(null)}
                                    aria-label="Close color selection"
                                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <h4 className="font-bold  mb-3">{selectedProductForColor.name}</h4>
                            <h4 className="font-bold  mb-3">Available Colours</h4>
                            {/* <div className="flex flex-wrap gap-4 items-center">
                                {
                                    selectedProductForColor?.images?.map((image, index) => (

                                        <div className="w-32 h-40 rounded-md overflow-hidden mb-4 border border-border shadow-soft">
                                            <img
                                                key={index}
                                                src={image}
                                                alt={selectedProductForColor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                    ))
                                }

                                <div className="w-32 h-40 rounded-md overflow-hidden mb-4 border border-border shadow-soft">
                                    <img
                                        src={selectedProductForColor.featuredImage || selectedProductForColor.image}
                                        alt={selectedProductForColor.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                            </div> */}


                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {getUniqueColors(selectedProductForColor?.variants).map((variant, i) => (
                                    <button
                                        key={i}
                                        onClick={() => confirmColorAndAdd(variant.colorName, variant.image)}
                                        aria-label={`Select ${variant.colorName} color`}
                                        className="w-32 h-40 flex flex-col items-center gap-2  rounded-sm border-2 border-border
                                         hover:border-primary hover:bg-primary/5 transition-all text-left"
                                    >
                                        {variant?.image && (
                                            <div className="relative w-full h-full  aspect-[4/5]  overflow-hidden  shadow-soft">
                                                <Image
                                                    src={variant?.image}
                                                    alt={variant.colorName}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 40vw, 150px"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center gap-2 ">
                                            <div
                                                className="w-4 h-4 md:w-5 md:h-5 rounded-full border shadow-sm"
                                                style={{ backgroundColor: variant.colorHex }}
                                            />
                                            <span className="text-sm font-semibold truncate">{variant.colorName}</span>

                                        </div>

                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductGrid;
