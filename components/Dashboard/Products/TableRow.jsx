import Link from 'next/link'
import { Edit2, Trash2, Star, Eye, EyeOff } from "lucide-react"
import { calculateTotalStock } from '@/utils/calculateTotalStock'

import Image from 'next/image'

export default function TableRow({ product, handleDelete, onClickImage }) {
  const totalStock = calculateTotalStock(product)

  // Handle categories array or legacy single category string
  const categoriesText = Array.isArray(product?.categories)
    ? product.categories.map(c => typeof c === 'object' ? c.name : c).join(", ")
    : (product?.category || "N/A");

  const productImage = product?.featuredImage || product?.images?.[0] || product?.image;

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="relative w-12 h-12 md:w-20 md:h-20 rounded-sm border border-border overflow-hidden bg-muted flex-shrink-0 cursor-zoom-in"
            onClick={() => onClickImage && onClickImage(productImage)}
          >
            {productImage ? (
              <Image
                src={productImage}
                alt={product?.name || "Product"}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
                sizes="100px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-[10px]">No Image</span>
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base truncate">{product?.name}</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {product?.isFeatured && (
                <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  <Star className="w-2.5 h-2.5 fill-yellow-700" /> Featured
                </span>
              )}
              {!product.isActive && (
                <span className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  <EyeOff className="w-2.5 h-2.5" /> Hidden
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 font-medium">
        {product.designName || <span className="text-gray-400 italic">None</span>}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground truncate max-w-[150px]">
        {categoriesText}
      </td>
      <td className="px-4 py-3 hidden md:table-cell">৳ {product?.price}</td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${totalStock > 10
            ? "bg-green-100 text-green-700"
            : totalStock > 0
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {totalStock} units
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex gap-2 justify-center">
          <Link href={`/admin/products/${product?._id}`} className="p-2 hover:bg-muted rounded text-primary" title="Edit Product">
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(product._id)}
            className="p-2 hover:bg-muted rounded text-destructive"
            title="Move to Trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
