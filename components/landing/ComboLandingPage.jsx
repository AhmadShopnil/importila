"use client";

import { useEffect } from "react";
import HeroSection from "@/components/landing/HeroSection";
import BundleSelection from "@/components/landing/BundleSelection";
import SizeSelection from "@/components/landing/SizeSelection";
import ProductSlots from "@/components/landing/ProductSlots";
import ProductGrid from "@/components/landing/ProductGrid";
import CheckoutForm from "@/components/landing/CheckoutForm";
import DesktopCTA from "@/components/landing/DesktopCTA";
import StickyCTA from "@/components/landing/StickyCTA";
import ReviewSection from "@/components/landing/ReviewSection";
import ProductDetails from "@/components/landing/ProductDetails";
import { BundleProvider, useBundle } from "@/context/BundleContext";
import SizeChart from "./SizeChart";
import TopOfferCountdown from "./TopOfferCountdown";
import Container from "../Container";
import ComboSlider from "./ComboSlider";
import ProductSelectionModal from "./ProductSelectionModal";

const LandingContent = ({ combo, comboSliders }) => {
    const { state, selectBundle } = useBundle();

    useEffect(() => {
        if (!state.selectedBundle && combo?.bundleOptions?.length > 0) {
            selectBundle(combo.bundleOptions[0]);
        }
    }, [combo, state.selectedBundle, selectBundle]);

    return (
        <div className="landing-page-theme min-h-screen bg-background font-sans overflow-x-hidden  ">

            <TopOfferCountdown />
            <HeroSection combo={combo} comboSliders={comboSliders} />
            {/* <ComboSlider comboSliders={comboSliders}/> */}
            <ProductDetails combo={combo} />
            <ReviewSection />
            <SizeChart />

            <BundleSelection combo={combo} />
            <ProductGrid combo={combo} />

            {state.selectedBundle && (
                <ProductSlots />
            )}
            <SizeSelection combo={combo} />

            <CheckoutForm combo={combo} />

            <DesktopCTA combo={combo} />
            {/* <Footer /> */}
            <StickyCTA combo={combo} />
            <ProductSelectionModal combo={combo} />
        </div>
    );
};

const ComboLandingPage = ({ combo, comboSliders }) => {
    return (
        <BundleProvider>
            <LandingContent combo={combo} comboSliders={comboSliders} />
        </BundleProvider>
    );
};

export default ComboLandingPage
