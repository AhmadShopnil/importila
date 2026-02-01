// lib/calcComboStock.js
import { products } from "./data";

export function calculateComboStock(comboProducts, sizes) {
  let minStock = Infinity;

  comboProducts.forEach((item) => {
    const product = products.find((p) => p._id === item.product);

    sizes.forEach((size) => {
      const variant = product.variants.find(
        (v) =>
          v.colorName === item.colorName &&
          v.size === size
      );

      if (!variant) {
        minStock = 0;
        return;
      }

      minStock = Math.min(minStock, variant.stock);
    });
  });

  return minStock === Infinity ? 0 : minStock;
}
