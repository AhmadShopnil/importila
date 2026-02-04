"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
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
        }
    };

    const confirmColorAndAdd = (colorName) => {
        if (selectedProductForColor) {
            addProductToSlot(selectedProductForColor, colorName);
            setSelectedProductForColor(null);
        }
    };

    return (
        <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {combo?.productGridTitle || "Choose Your Favorite Styles"}
                    </h2>
                    <p className="text-muted-foreground">
                        {disabled
                            ? "Select a bundle size first to start picking items"
                            : activeSlotIndex !== null
                                ? `Selecting for Slot ${activeSlotIndex + 1} - Click any item to add`
                                : "All slots are filled! Click on a slot above to replace an item"}
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {combo?.products?.map((product) => (
                        <div
                            key={product._id || product.id}
                            onClick={() => handleProductClick(product)}
                            className={`group relative aspect-square rounded-xl overflow-hidden bg-card shadow-soft transition-all duration-300 ${disabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-elevated hover:scale-[1.02] cursor-pointer"
                                }`}
                        >
                            <img
                                src={product?.featuredImage || product?.image}
                                alt={product?.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <p className="text-white text-xs font-semibold truncate mb-1">
                                    {product?.name}
                                </p>
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

                            {/* Add Button */}
                            {!disabled && (
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
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
                                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <h4 className="font-bold  mb-3">{selectedProductForColor.name}</h4>
                            {/* <h4 className="font-bold  mb-3">Available Colours</h4>
                            <div className="flex flex-wrap gap-4 items-center">
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


                            <div className="grid grid-cols-2 gap-3">
                                {getUniqueColors(selectedProductForColor?.variants).map((variant, i) => (
                                    <button
                                        key={i}
                                        onClick={() => confirmColorAndAdd(variant.colorName)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                                    >
                                        {variant?.image && (
                                            <div className="w-full h-full rounded-md overflow-hidden mb-4 border border-border shadow-soft">
                                                <img
                                                    key={i}
                                                    src={variant?.image}
                                                    alt={variant.colorName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full border shadow-sm"
                                                style={{ backgroundColor: variant.colorHex }}
                                            />
                                            <span className="text-sm font-semibold truncate">{variant.colorName}</span></div>

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
