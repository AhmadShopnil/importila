"use client";

import { Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="py-8 bg-primary text-primary-foreground pb-28 md:pb-8">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Little Stars Boutique</h3>
                    <p className="text-primary-foreground/80 text-sm mb-4">
                        Premium Kids Clothing Bundles
                    </p>
                    <div className="flex items-center justify-center gap-1 text-sm text-primary-foreground/70">
                        Made with <Heart size={14} className="text-accent fill-accent" /> for happy kids
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
