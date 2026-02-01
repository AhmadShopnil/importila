"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";

const initialState = {
    selectedBundle: null,
    selectedSize: null,
    slots: [],
    activeSlotIndex: null,
    customerInfo: {
        name: "",
        phone: "",
        address: "",
        note: "",
    },
};

const BundleContext = createContext(null);

function bundleReducer(state, action) {
    switch (action.type) {
        case "SELECT_BUNDLE":
            return {
                ...state,
                selectedBundle: action.payload,
                slots: Array(action.payload)
                    .fill(null)
                    .map(() => ({ product: null, selectedColor: null })),
                activeSlotIndex: 0,
            };
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
            const product = action.payload;

            // Handle both 'colors' (demo data) and 'variants' (API data)
            const colors = product.variants
                ? product.variants.map(v => ({ name: v.colorName, hex: v.colorHex }))
                : (product.colors || []);

            newSlots[state.activeSlotIndex] = {
                product: {
                    ...product,
                    // Standardize color format for the UI
                    displayColors: colors,
                    id: product._id || product.id,
                    image: product.featuredImage || product.image
                },
                selectedColor: colors.length > 0 ? colors[0].name : null,
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
                newSlots[slotIndex] = {
                    ...newSlots[slotIndex],
                    selectedColor: color,
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

    const addProductToSlot = useCallback((product) => {
        dispatch({ type: "ADD_PRODUCT_TO_SLOT", payload: product });
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

    const isComplete =
        !!state.selectedBundle &&
        !!state.selectedSize &&
        state.slots.length > 0 &&
        state.slots.every((slot) => slot.product !== null && slot.selectedColor !== null) &&
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
