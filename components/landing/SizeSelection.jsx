"use client";


import { useBundle } from "@/context/BundleContext";

const SizeSelection = ({ combo }) => {
    const { state, selectSize } = useBundle();
    const disabled = !state.selectedBundle;
    const sizes = combo?.sizes;

    return (
        <section className="pt-12 ">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {combo?.sizeSelectionTitle || "Select Size for Your Bundle"}
                    </h2>
                    <p className="text-muted-foreground">
                        One size applies to all items in your bundle
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
                    {sizes?.map((size) => (
                        <button
                            key={size}
                            onClick={() => selectSize(size)}
                            disabled={disabled}
                            className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 ${state.selectedSize === size
                                ? "bg-primary text-primary-foreground shadow-elevated scale-105"
                                : disabled
                                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                    : "bg-card text-foreground border-2 border-border hover:border-primary hover:shadow-soft"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                {disabled && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Please select a bundle size first
                    </p>
                )}
            </div>
        </section>
    );
};

export default SizeSelection;
