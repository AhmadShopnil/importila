"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { trackAddToCart } from '@/utils/gtm'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('importila_cart')
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart from storage", e)
            }
        }
    }, [])

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('importila_cart', JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (product, variant, quantity = 1) => {
        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(item =>
                item._id === product._id &&
                item.sku === variant.sku
            )

            if (existingItemIndex > -1) {
                const updatedItems = [...prev]
                updatedItems[existingItemIndex].quantity += quantity
                return updatedItems
            }

            return [...prev, {
                ...product,
                selectedColor: variant.colorName,
                selectedColorHex: variant.colorHex,
                selectedSize: variant.size,
                sku: variant.sku,
                quantity
            }]
        })
        trackAddToCart(product, variant, quantity)
        setIsCartOpen(true)
    }

    const removeFromCart = (index) => {
        setCartItems(prev => prev.filter((_, i) => i !== index))
    }

    const updateQuantity = (index, delta) => {
        setCartItems(prev => {
            const updated = [...prev]
            updated[index].quantity = Math.max(1, updated[index].quantity + delta)
            return updated
        })
    }

    const clearCart = () => {
        setCartItems([])
    }

    const cartTotal = cartItems.reduce((total, item) =>
        total + (item.offerPrice || item.price) * item.quantity, 0
    )

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}
