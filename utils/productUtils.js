/**
 * Expands a list of products so that each unique color variant of a product 
 * appears as its own entry in the list.
 */
export const expandProductsByColor = (products) => {
    if (!products || !Array.isArray(products)) return [];

    const expandedList = [];

    products.forEach(product => {
        const variants = product.variants || [];

        if (variants.length === 0) {
            expandedList.push(product);
            return;
        }

        // Identify unique colors
        const colorVariants = [];
        const seenColors = new Set();

        variants.forEach(variant => {
            if (variant.colorName && !seenColors.has(variant.colorName)) {
                seenColors.add(variant.colorName);
                colorVariants.push(variant);
            }
        });

        if (colorVariants.length <= 1) {
            expandedList.push(product);
        } else {
            // Create a virtual product for each color
            colorVariants.forEach(cv => {
                const nameHasColor = product.name.toLowerCase().includes(cv.colorName.toLowerCase());
                const displayName = nameHasColor ? product.name : `${product.name} - ${cv.colorName}`;

                expandedList.push({
                    ...product,
                    _id: `${product._id}_${cv.colorName}`, // Unique key for rendering
                    originalId: product._id,
                    displayColor: cv.colorName,
                    colorHex: cv.colorHex,
                    displayName: displayName,
                    featuredImage: cv.image || product.featuredImage, // Use variant image if available
                    // We keep all variants so the product page can still access everything
                });
            });
        }
    });

    return expandedList;
};
