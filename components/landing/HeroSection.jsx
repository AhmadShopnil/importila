"use client";

import { Gift, Truck, Shield, Star } from "lucide-react";
import ComboSlider from "./ComboSlider";

const HeroSection = ({ combo, comboSliders }) => {
    const scrollToBundles = () => {
        document.getElementById("bundle-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative  gradient-hero overflow-hidden py-6 md:py-10">
            {/* Decorative elements */}

            <div className="hidden md:flex absolute top-20 left-20 w-16 h-16 rounded-full bg-primary/10 animate-float" style={{ animationDelay: "1s" }} />
            <div className="hidden md:flex absolute top-40 right-20 w-16 h-16 rounded-full bg-primary/10 animate-float" style={{ animationDelay: "1s" }} />
            <div className="hidden md:flex absolute bottom-60 right-100 w-10 h-10 rounded-full bg-primary/10 animate-float" style={{ animationDelay: "1s" }} />

            <div className="absolute bottom-20 right-1/3 md:w-24 md:h-24 rounded-full bg-mint/30 animate-float" style={{ animationDelay: "1.5s" }} />

            <div className="container mx-auto px-4 md:pt-16 md:pb-10 flex flex-col items-center justify-center  ">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-slide-up">
                    <Gift size={18} />
                    <span className="text-sm font-semibold">{combo?.heroBadge || "Bundle & Save Up To 41%"}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-[26px] md:text-5xl lg:text-6xl font-bold text-center text-[#1E556E] leading-10 md:leading-20  mb-6
                 animate-slide-up text-balance max-w-4xl">
                    {combo?.landingPageTitle || "Adorable Kids Dress Sets"} <br />
                    {/* <span className="text-primary">Mix, Match & Save Big!</span> */}
                </h1>


                <ComboSlider comboSliders={comboSliders} />
                {/* Subheadline */}
                <p className="text-[14px] md:text-xl text-muted-foreground text-center max-w-2xl mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    {combo?.landingPageSubtitle || "Create the perfect wardrobe bundle for your little ones. Choose 3 to 10 pieces and enjoy massive savings on premium quality kids' clothing."}
                </p>

                {/* CTA Button */}
                <button
                    onClick={scrollToBundles}
                    className="bg-[#25D366] text-accent-foreground font-bold text-[15px] md:text-lg px-10 py-2.5 md:py-4 rounded-full shadow-cta hover:scale-105 transition-all
                     duration-300 animate-slide-up  "
                    style={{ animationDelay: "0.2s" }}
                >
                    {combo?.heroCTA || "পছন্দের বান্ডেলটি বেছে নিন"}
                </button>

                {/* Trust Badges */}
                {/* <div className="flex flex-wrap justify-center gap-6 md:gap-10 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck size={20} className="text-primary" />
                        <span className="text-sm font-medium">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield size={20} className="text-primary" />
                        <span className="text-sm font-medium">Quality Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Star size={20} className="text-primary" />
                        <span className="text-sm font-medium">5000+ Happy Parents</span>
                    </div>
                </div> */}
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path
                        d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
                        fill="hsl(var(--background))"
                    />
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;
