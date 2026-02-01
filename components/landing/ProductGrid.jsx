"use client";

// import { products } from "@/data/products";
import { Plus } from "lucide-react";
import { useBundle } from "@/context/BundleContext";

const ProductGrid = ({ combo }) => {
    const { state, addProductToSlot } = useBundle();
    const { selectedBundle, activeSlotIndex } = state;
    const disabled = !selectedBundle;

    return (
        <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Choose Your Favorite Styles
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
                        <button
                            key={product._id || product.id}
                            onClick={() => addProductToSlot(product)}
                            disabled={disabled}
                            className={`group relative aspect-square rounded-sm overflow-hidden bg-card shadow-soft transition-all duration-300 ${disabled
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
                                <p className="text-white text-sm font-semibold truncate mb-2">
                                    {product?.name}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1">
                                        {product?.variants?.map((variant, i) => (
                                            <div
                                                key={i}
                                                className="w-4 h-4 rounded-full border border-white/50"
                                                style={{ backgroundColor: variant?.colorHex }}
                                                title={variant?.colorName}
                                            />
                                        ))}
                                    </div>
                                    {/* <span className="text-white text-xs font-bold">৳{product?.price}</span> */}
                                </div>
                            </div>

                            {/* Add Button */}
                            {!disabled && (
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                    <Plus size={18} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
