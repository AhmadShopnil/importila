"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";

const initialState = {
    selectedBundle: null, // pieces
    selectedBundleData: null, // full bundle object
    selectedSize: null,
    slots: [],
    activeSlotIndex: null,
    customerInfo: {
        name: "",
        phone: "",
        address: "",
        note: "",
    },
    isProductModalOpen: false,
};

const BundleContext = createContext(null);

const getUniqueColors = (variants) => {
    if (!variants || variants.length === 0) return [];
    const seen = new Set();
    const uniqueColors = [];
    for (const v of variants) {
        if (!seen.has(v.colorName)) {
            seen.add(v.colorName);
            uniqueColors.push({ name: v.colorName, hex: v.colorHex });
        }
    }
    return uniqueColors;
};

function bundleReducer(state, action) {
    switch (action.type) {
        case "SELECT_BUNDLE": {
            const bundle = action.payload;
            const pieces = typeof bundle === 'object' ? bundle.pieces : bundle;

            // Pre-fill slots with products from the bundle data if available
            const comboProducts = state.selectedBundleData?.products || [];

            const initialSlots = Array(pieces)
                .fill(null)
                .map((_, index) => {
                    const product = comboProducts[index % comboProducts.length] || null;
                    if (product) {
                        const variants = product.variants || [];
                        const colors = getUniqueColors(variants);
                        const selectedColor = colors.length > 0 ? colors[0].name : null;

                        let initialImage = product.featuredImage || product.image;
                        if (selectedColor && variants.length > 0) {
                            const variant = variants.find(v => v.colorName === selectedColor);
                            if (variant?.image) {
                                initialImage = variant.image;
                            }
                        }

                        return {
                            product: {
                                ...product,
                                displayColors: colors,
                                id: product._id || product.id,
                                image: initialImage
                            },
                            selectedColor: selectedColor,
                        };
                    }
                    return { product: null, selectedColor: null };
                });

            return {
                ...state,
                selectedBundle: pieces,
                selectedBundleData: typeof bundle === 'object' ? bundle : null,
                slots: initialSlots,
                activeSlotIndex: initialSlots.findIndex(s => s.product === null) === -1 ? 0 : initialSlots.findIndex(s => s.product === null),
            };
        }
        case "SELECT_SIZE":
            return {
                ...state,
                selectedSize: action.payload,
            };
        case "SET_ACTIVE_SLOT":
            return {
                ...state,
                activeSlotIndex: action.payload,
            };
        case "ADD_PRODUCT_TO_SLOT": {
            if (state.activeSlotIndex === null) return state;

            const newSlots = [...state.slots];
            const { product, color, customImage } = action.payload.product ? action.payload : { product: action.payload, color: null, customImage: null };

            // Handle both 'colors' (demo data) and 'variants' (API data)
            const variants = product.variants || [];
            const colors = variants.length > 0
                ? getUniqueColors(variants)
                : (product.colors || []);

            // If no custom image provided but we have a color, try to find the variant image
            let displayImage = customImage;
            if (!displayImage && color && variants.length > 0) {
                const variant = variants.find(v => v.colorName === color);
                if (variant?.image) {
                    displayImage = variant.image;
                }
            }

            newSlots[state.activeSlotIndex] = {
                product: {
                    ...product,
                    displayColors: colors,
                    id: product._id || product.id,
                    image: displayImage || product.featuredImage || product.image
                },
                selectedColor: color || (colors.length > 0 ? colors[0].name : null),
            };

            // Auto-advance to next empty slot
            let nextActiveSlot = null;
            for (let i = 0; i < newSlots.length; i++) {
                if (!newSlots[i].product) {
                    nextActiveSlot = i;
                    break;
                }
            }

            return {
                ...state,
                slots: newSlots,
                activeSlotIndex: nextActiveSlot !== null ? nextActiveSlot : state.activeSlotIndex,
            };
        }
        case "UPDATE_SLOT_COLOR": {
            const { slotIndex, color } = action.payload;
            const newSlots = [...state.slots];
            if (newSlots[slotIndex]) {
                const product = newSlots[slotIndex].product;
                const variants = product?.variants || [];

                let newImage = product?.image;
                if (variants.length > 0) {
                    const variant = variants.find(v => v.colorName === color);
                    if (variant?.image) {
                        newImage = variant.image;
                    } else if (product.featuredImage || product.image) {
                        newImage = product.featuredImage || product.image;
                    }
                }

                newSlots[slotIndex] = {
                    ...newSlots[slotIndex],
                    selectedColor: color,
                    product: {
                        ...product,
                        image: newImage
                    }
                };
            }
            return {
                ...state,
                slots: newSlots,
            };
        }
        case "REMOVE_FROM_SLOT": {
            const index = action.payload;
            const newSlots = [...state.slots];
            newSlots[index] = { product: null, selectedColor: null };
            return {
                ...state,
                slots: newSlots,
                activeSlotIndex: index, // Make this slot active when cleared
            };
        }
        case "OPEN_PRODUCT_MODAL":
            return {
                ...state,
                isProductModalOpen: true,
            };
        case "CLOSE_PRODUCT_MODAL":
            return {
                ...state,
                isProductModalOpen: false,
            };
        case "UPDATE_CUSTOMER_INFO": {
            return {
                ...state,
                customerInfo: {
                    ...state.customerInfo,
                    [action.payload.field]: action.payload.value,
                },
            };
        }
        case "RESET":
            return initialState;
        default:
            return state;
    }
}

export const BundleProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bundleReducer, initialState);

    const selectBundle = useCallback((pieces) => {
        dispatch({ type: "SELECT_BUNDLE", payload: pieces });
    }, []);

    const selectSize = useCallback((size) => {
        dispatch({ type: "SELECT_SIZE", payload: size });
    }, []);

    const setActiveSlot = useCallback((index) => {
        dispatch({ type: "SET_ACTIVE_SLOT", payload: index });
    }, []);

    const addProductToSlot = useCallback((product, color = null, customImage = null) => {
        dispatch({ type: "ADD_PRODUCT_TO_SLOT", payload: { product, color, customImage } });
    }, []);

    const updateSlotColor = useCallback((slotIndex, color) => {
        dispatch({ type: "UPDATE_SLOT_COLOR", payload: { slotIndex, color } });
    }, []);

    const removeFromSlot = useCallback((index) => {
        dispatch({ type: "REMOVE_FROM_SLOT", payload: index });
    }, []);

    const updateCustomerInfo = useCallback((field, value) => {
        dispatch({ type: "UPDATE_CUSTOMER_INFO", payload: { field, value } });
    }, []);

    const openProductModal = useCallback(() => {
        dispatch({ type: "OPEN_PRODUCT_MODAL" });
    }, []);

    const closeProductModal = useCallback(() => {
        dispatch({ type: "CLOSE_PRODUCT_MODAL" });
    }, []);

    const isComplete =
        !!state.selectedBundle &&
        !!state.selectedSize &&
        state.slots.length > 0 &&
        state.slots.every((slot) => {
            if (slot.product === null || slot.selectedColor === null) return false;
            
            // Check stock for the selected color and state.selectedSize
            if (slot.product.variants && slot.product.variants.length > 0) {
                const cleanSelectedSize = String(state.selectedSize || "").trim().toLowerCase();
                const cleanVariantColor = String(slot.selectedColor || "").trim().toLowerCase();
                const variantForSize = slot.product.variants.find(v => 
                    String(v.colorName || "").trim().toLowerCase() === cleanVariantColor && 
                    String(v.size || "").trim().toLowerCase() === cleanSelectedSize
                );
                
                if (!variantForSize) return false;
                const stockVal = Number(variantForSize.stock);
                if (isNaN(stockVal) || stockVal <= 0) return false;
            }
            
            return true;
        }) &&
        !!state.customerInfo.name &&
        !!state.customerInfo.name.trim() &&
        !!state.customerInfo.phone &&
        !!state.customerInfo.phone.trim() &&
        !!state.customerInfo.address &&
        !!state.customerInfo.address.trim();

    const getFilledSlotsCount = useCallback(() => {
        return state.slots.filter((slot) => slot.product !== null).length;
    }, [state.slots]);

    return (
        <BundleContext.Provider
            value={{
                state,
                selectBundle,
                selectSize,
                setActiveSlot,
                addProductToSlot,
                updateSlotColor,
                removeFromSlot,
                updateCustomerInfo,
                isComplete,
                getFilledSlotsCount,
                openProductModal,
                closeProductModal,
            }}
        >
            {children}
        </BundleContext.Provider>
    );
};

export const useBundle = () => {
    const context = useContext(BundleContext);
    if (context === null) {
        throw new Error("useBundle must be used within a BundleProvider");
    }
    return context;
};
