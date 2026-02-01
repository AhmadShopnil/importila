// E-commerce tracking helper functions for GTM and FB Pixel

export const trackEvent = {
    // Page View
    pageView: (pageName) => {
        if (typeof window !== "undefined") {
            // GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: "page_view",
                page_name: pageName,
            })

            // FB Pixel
            if (window.fbq) {
                window.fbq("track", "PageView")
            }
        }
    },

    // View Product
    viewProduct: (product) => {
        if (typeof window !== "undefined") {
            // GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: "view_item",
                ecommerce: {
                    items: [
                        {
                            item_id: product._id,
                            item_name: product.name,
                            price: product.offerPrice || product.price,
                            item_category: product.category,
                        },
                    ],
                },
            })

            // FB Pixel
            if (window.fbq) {
                window.fbq("track", "ViewContent", {
                    content_ids: [product._id],
                    content_name: product.name,
                    content_type: "product",
                    value: product.offerPrice || product.price,
                    currency: "BDT",
                })
            }
        }
    },

    // Add to Cart
    addToCart: (product, quantity = 1) => {
        if (typeof window !== "undefined") {
            const value = (product.offerPrice || product.price) * quantity

            // GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                    items: [
                        {
                            item_id: product._id,
                            item_name: product.name,
                            price: product.offerPrice || product.price,
                            quantity: quantity,
                        },
                    ],
                },
            })

            // FB Pixel
            if (window.fbq) {
                window.fbq("track", "AddToCart", {
                    content_ids: [product._id],
                    content_name: product.name,
                    content_type: "product",
                    value: value,
                    currency: "BDT",
                })
            }
        }
    },

    // Begin Checkout
    beginCheckout: (items, totalValue) => {
        if (typeof window !== "undefined") {
            // GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: "begin_checkout",
                ecommerce: {
                    items: items.map((item) => ({
                        item_id: item._id || item.productId,
                        item_name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    value: totalValue,
                    currency: "BDT",
                },
            })

            // FB Pixel
            if (window.fbq) {
                window.fbq("track", "InitiateCheckout", {
                    content_ids: items.map((item) => item._id || item.productId),
                    contents: items.map((item) => ({
                        id: item._id || item.productId,
                        quantity: item.quantity,
                    })),
                    value: totalValue,
                    currency: "BDT",
                })
            }
        }
    },

    // Purchase
    purchase: (orderId, items, totalValue) => {
        if (typeof window !== "undefined") {
            // GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: "purchase",
                ecommerce: {
                    transaction_id: orderId,
                    value: totalValue,
                    currency: "BDT",
                    items: items.map((item) => ({
                        item_id: item._id || item.productId,
                        item_name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
            })

            // FB Pixel
            if (window.fbq) {
                window.fbq("track", "Purchase", {
                    content_ids: items.map((item) => item._id || item.productId),
                    contents: items.map((item) => ({
                        id: item._id || item.productId,
                        quantity: item.quantity,
                    })),
                    value: totalValue,
                    currency: "BDT",
                })
            }
        }
    },

    // Search
    search: (searchTerm) => {
        if (typeof window !== "undefined") {
            // GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: "search",
                search_term: searchTerm,
            })

            // FB Pixel
            if (window.fbq) {
                window.fbq("track", "Search", {
                    search_string: searchTerm,
                })
            }
        }
    },
}
