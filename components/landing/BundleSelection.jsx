"use client";

import { bundleOptions } from "@/data/products";
import { Check, Sparkles } from "lucide-react";
import { useBundle } from "@/context/BundleContext";

const BundleCard = ({
    bundle,
    isSelected,
    onSelect,
}) => {
    return (
        <button
            onClick={onSelect}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full ${isSelected
                ? "border-primary bg-primary/5 shadow-elevated scale-[1.02]"
                : "border-border bg-card hover:border-primary/50 hover:shadow-card"
                }`}
        >
            {bundle.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Sparkles size={12} />
                    Most Popular
                </div>
            )}

            {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={14} className="text-primary-foreground" />
                </div>
            )}

            <div className="mb-2">
                <span className="text-4xl font-extrabold text-foreground">{bundle?.pieces}</span>
                <span className="text-lg font-semibold text-muted-foreground ml-1">Pieces</span>
            </div>

            <div className="mb-3">
                <span className="text-2xl font-bold text-primary">৳{bundle?.price}</span>
                {bundle.originalPrice > 0 && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                        ৳{bundle.originalPrice}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="inline-block bg-mint/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                    Save {bundle.savings}
                </div>
                <div className={`text-[11px] font-semibold ${bundle.shippingCharge === 0 ? "text-green-600" : "text-muted-foreground"}`}>
                    {bundle.shippingCharge === 0 ? "✓ Free Shipping" : `+ ৳${bundle.shippingCharge} Shipping`}
                </div>
            </div>
        </button>
    );
};

const BundleSelection = ({ combo }) => {
    const { state, selectBundle } = useBundle();
    const options = combo?.bundleOptions?.length > 0 ? combo.bundleOptions : bundleOptions;

    return (
        <section id="bundle-section" className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                        Choose Your Bundle Size
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Select how many pieces you want. The more you bundle, the more you save!
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                    {options.map((bundle) => {
                        const savings = bundle.savings || (bundle.originalPrice ? `৳${bundle.originalPrice - bundle.price}` : null);
                        return (
                            <BundleCard
                                key={bundle?.pieces}
                                bundle={{ ...bundle, savings }}
                                isSelected={state?.selectedBundle === bundle?.pieces}
                                onSelect={() => selectBundle(bundle)}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default BundleSelection;
