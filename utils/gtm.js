"use client"

import { sendGTMEvent } from '@next/third-parties/google'

/**
 * Enhanced GTM event tracking utility
 * @param {string} event - The event name
 * @param {object} value - Additional parameters for the event
 */
export const trackEvent = (event, value = {}) => {
    if (typeof window !== 'undefined') {
        sendGTMEvent({
            event,
            ...value
        })
    }
}

//  Events
export const trackViewItem = (product) => {
    trackEvent('view_item', {
        ecommerce: {
            currency: 'BDT',
            value: product.offerPrice || product.price,
            items: [{
                item_id: product._id,
                item_name: product.name,
                price: product?.offerPrice || product.price,
                quantity: 1,
                item_category: product?.category?.name
            }]
        }
    })
}

export const trackAddToCart = (product, variant, quantity) => {
    trackEvent('add_to_cart', {
        ecommerce: {
            currency: 'BDT',
            value: (product?.offerPrice || product?.price) * quantity,
            items: [{
                item_id: product._id,
                item_name: product.name,
                item_variant: variant.sku,
                price: product?.offerPrice || product?.price,
                quantity: quantity,
                item_category: product?.category?.name
            }]
        }
    })
}

export const trackRemoveFromCart = (product, variant, quantity) => {
    trackEvent('remove_from_cart', {
        ecommerce: {
            currency: 'BDT',
            value: (product?.offerPrice || product?.price) * quantity,
            items: [{
                item_id: product._id,
                item_name: product.name,
                item_variant: variant?.sku,
                price: product?.offerPrice || product?.price,
                quantity: quantity,
                item_category: product?.category?.name
            }]
        }
    })
}

export const trackAddToWishlist = (product) => {
    trackEvent('add_to_wishlist', {
        ecommerce: {
            currency: 'BDT',
            value: product?.offerPrice || product?.price,
            items: [{
                item_id: product._id,
                item_name: product.name,
                price: product?.offerPrice || product?.price,
                quantity: 1,
                item_category: product?.category?.name
            }]
        }
    })
}

export const trackAddShippingInfo = (cartItems, total, shippingTier) => {
    trackEvent('add_shipping_info', {
        ecommerce: {
            currency: 'BDT',
            value: total,
            shipping_tier: shippingTier,
            items: cartItems.map(item => ({
                item_id: item._id,
                item_name: item.name,
                price: item.offerPrice || item.price,
                quantity: item.quantity
            }))
        }
    })
}

export const trackBeginCheckout = (cartItems, total) => {
    trackEvent('begin_checkout', {
        ecommerce: {
            currency: 'BDT',
            value: total,
            items: cartItems.map(item => ({
                item_id: item._id,
                item_name: item.name,
                price: item.offerPrice || item.price,
                quantity: item.quantity
            }))
        }
    })
}

export const trackPurchase = (orderId, total, cartItems) => {
    trackEvent('purchase', {
        ecommerce: {
            transaction_id: orderId,
            value: total,
            currency: 'BDT',
            payment_type: 'Cash on Delivery',
            items: cartItems.map(item => ({
                item_id: item?._id,
                item_name: item?.name,
                price: item?.offerPrice || item?.price,
                quantity: item?.quantity
            }))
        }
    })
}
