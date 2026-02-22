"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from '@/components/Container';

export const ProductCard = ({ product }) => {
    const productId = product.originalId || product._id || product.id;
    // const productName = `${product.designName} - ${product.name}`;
    const productName = ` ${product.name}`;
    const colorParam = product.displayColor
        ? `?color=${encodeURIComponent(product.displayColor)}`
        : "";

    // images fallback
    const images =
        product?.images?.length > 0
            ? product.images
            : [product?.featuredImage || "/placeholder.svg"];

    const [currentIndex, setCurrentIndex] = useState(0);

    // auto slide
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-border/50">
            <Link href={`/product/${productId}${colorParam}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                        src={images[currentIndex]}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        priority={false}
                    />

                    {product.offerPrice > 0 && (
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                            SAVE ৳{product.price - product.offerPrice}
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-3">
                <Link href={`/product/${productId}${colorParam}`}>
                    <h3 className="text-sm font-bold text-[#1C546D] mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {productName}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {product?.offerPrice > 0 ? (
                            <>
                                <span className="text-sm font-bold text-primary">
                                    ৳{product?.offerPrice}
                                </span>
                                <span className="text-[10px] text-muted-foreground line-through opacity-70">
                                    ৳{product?.price}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-[#1C546D]">
                                ৳{product?.price}
                            </span>
                        )}
                    </div>
                </div>

                <Link
                    href={`/product/${productId}${colorParam}`}
                    className="w-full py-2 bg-[#1C546D]/5 text-[#1C546D] text-[11px] font-bold rounded-lg flex items-center justify-center hover:bg-[#1C546D] hover:text-white transition-all duration-300"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

const ProductsList = ({ products }) => {
    return (
        <section id="products" className="py-6 md:py-10 bg-background">
            <Container>
                <div className="mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl mb-4 font-semibold text-[#1C546D]">
                        Our Products
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5 md:gap-6">
                    {products?.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default ProductsList;
