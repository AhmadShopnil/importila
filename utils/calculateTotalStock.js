export const calculateTotalStock = (product) => {
  if (!product?.variants?.length) return 0

  return product.variants.reduce(
    (total, variant) => total + (variant.stock || 0),
    0
  )
}