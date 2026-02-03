"use client";

import HeroSection from "@/components/landing/HeroSection";
import BundleSelection from "@/components/landing/BundleSelection";
import SizeSelection from "@/components/landing/SizeSelection";
import ProductSlots from "@/components/landing/ProductSlots";
import ProductGrid from "@/components/landing/ProductGrid";
import CheckoutForm from "@/components/landing/CheckoutForm";
import DesktopCTA from "@/components/landing/DesktopCTA";
import StickyCTA from "@/components/landing/StickyCTA";
import Footer from "@/components/landing/Footer";
import ReviewSection from "@/components/landing/ReviewSection";
import ProductDetails from "@/components/landing/ProductDetails";
import { BundleProvider, useBundle } from "@/context/BundleContext";
import SizeChart from "./SizeChart";

const LandingContent = ({ combo }) => {
    const { state } = useBundle();

    return (
        <div className="landing-page-theme min-h-screen bg-background font-nunito overflow-x-hidden  ">
            <HeroSection combo={combo} />

            <BundleSelection combo={combo} />

            {state.selectedBundle && (
                <ProductSlots />
            )}

            <ProductGrid combo={combo} />

            <ProductDetails combo={combo} />
            <SizeChart />

            <SizeSelection combo={combo} />

            <ReviewSection />

            <CheckoutForm combo={combo} />

            <DesktopCTA combo={combo} />
            {/* <Footer /> */}
            <StickyCTA combo={combo} />
        </div>
    );
};

const ComboLandingPage = ({ combo }) => {
    return (
        <BundleProvider>
            <LandingContent combo={combo} />
        </BundleProvider>
    );
};

export default ComboLandingPage
