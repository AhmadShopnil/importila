export function groupVariantsByColor(variants = []) {
  return variants.reduce((acc, variant) => {
    const { colorName, colorHex, size, stock, sku } = variant;

    if (!acc[colorName]) {
      acc[colorName] = {
        colorName,
        colorHex,
        sizes: []
      };
    }

    acc[colorName].sizes.push({
      size,
      stock,
      sku
    });

    return acc;
  }, {});
}
