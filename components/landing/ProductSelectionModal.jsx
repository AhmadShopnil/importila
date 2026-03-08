"use client";

import { useState, useEffect } from "react";
import { Plus, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useBundle } from "@/context/BundleContext";
import toast from "react-hot-toast";

const ProductSelectionModal = ({ combo }) => {
    const { state, addProductToSlot, closeProductModal } = useBundle();
    const { isProductModalOpen, activeSlotIndex } = state;
    const [selectedProductForColor, setSelectedProductForColor] = useState(null);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isProductModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isProductModalOpen]);

    if (!isProductModalOpen) return null;

    const products = combo?.products || [];

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
        if (product.variants && product.variants.length > 0) {
            setSelectedProductForColor(product);
        } else {
            addProductToSlot(product);
            toast.success(`${product.name} added in your list`);
            closeProductModal();
        }
    };

    const confirmColorAndAdd = (colorName, variantImage = null) => {
        if (selectedProductForColor) {
            addProductToSlot(selectedProductForColor, colorName, variantImage);
            toast.success(`${selectedProductForColor.name} (${colorName}) added in your list`);
            setSelectedProductForColor(null);
            closeProductModal();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-card rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
                {/* Modal Header */}
                <div className="p-4 md:p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        {selectedProductForColor && (
                            <button
                                onClick={() => setSelectedProductForColor(null)}
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h3 className="text-xl font-bold text-[#1E556E]">
                            {selectedProductForColor
                                ? "Back"
                                : `Choose Design for Slot ${activeSlotIndex !== null ? activeSlotIndex + 1 : ""}`
                            }
                        </h3>
                    </div>
                    <button
                        onClick={closeProductModal}
                        aria-label="Close modal"
                        className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 hover:text-foreground transition-all duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50/30">
                    {!selectedProductForColor ? (
                        /* Product Grid */
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {products.map((product, idx) => (
                                <div
                                    key={product._id || product.id}
                                    onClick={() => handleProductClick(product)}
                                    className="group relative aspect-square rounded-md overflow-hidden bg-white border border-border/50 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                                >
                                    <Image
                                        src={product?.featuredImage || product?.image}
                                        alt={product?.name || "Product"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 20vw"
                                        priority={idx < 10}
                                    />

                                    {/* Mobile/Overlay indicator */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 md:p-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-[10px] md:text-sm font-semibold truncate mb-1">
                                            {product?.name}
                                        </p>
                                        <div className="bg-primary text-white text-[10px] md:text-xs font-bold py-1.5 rounded-full flex items-center justify-center gap-1 shadow-lg">
                                            <Plus size={10} />
                                            {product.variants?.length > 0 ? "সিলেক্ট করুন" : "সিলেক্ট করুন"}
                                        </div>
                                    </div>

                                    {/* Variant Badge */}
                                    {product.variants?.length > 0 && (
                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-primary shadow-sm border border-primary/20">
                                            {getUniqueColors(product.variants).length} Colors
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Color Selection */
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-[#1E556E] mb-1">
                                    Design Name:
                                    <span className="text-blue-500 ml-2 "> {selectedProductForColor.name}</span>


                                </h4>

                            </div>
                            <p className=" text-lg font-semibold text-center text-[#1E556E] mb-1">Choose  Colour</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4">
                                {getUniqueColors(selectedProductForColor?.variants).map((variant, i) => (
                                    <button
                                        key={i}
                                        onClick={() => confirmColorAndAdd(variant.colorName, variant.image)}
                                        className="group flex flex-col items-center gap-3 p-1 md:p-2 rounded-md border-2 border-transparent bg-white shadow-sm hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all duration-300 text-left"
                                    >
                                        <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden shadow-sm">
                                            <Image
                                                src={variant?.image || selectedProductForColor.featuredImage || selectedProductForColor.image}
                                                alt={variant.colorName}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 40vw, 200px"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-5 h-5 rounded-full border shadow-sm"
                                                style={{ backgroundColor: variant.colorHex }}
                                            />
                                            <span className="text-sm font-bold text-slate-700">{variant.colorName}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer (Optional) */}
                <div className="p-4 bg-muted/30 border-t flex justify-end">
                    <button
                        onClick={closeProductModal}
                        className="px-6 py-2 rounded-full text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductSelectionModal;
