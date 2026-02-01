import Image from "next/image"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"

export default function ComboTableRow({ combo, handleDelete }) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition">
      {/* NAME */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded overflow-hidden border">
            <Image
              src={combo.featuredImage}
              alt={combo.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="font-medium">{combo.title}</p>
            <p className="text-xs text-muted-foreground">
              {combo.products.length} products
            </p>
          </div>
        </div>
      </td>

      {/* PRODUCTS */}
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {combo.products.map((p, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-xs bg-muted"
            >
              {p.name}
            </span>
          ))}
        </div>
      </td>

      {/* SIZES */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex gap-1 flex-wrap">
          {combo.sizes.map((size) => (
            <span
              key={size}
              className="px-2 py-0.5 text-xs border rounded"
            >
              {size}
            </span>
          ))}
        </div>
      </td>

      {/* PRICE */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <div>
          {combo.offerPrice ? (
            <>
              <span className="font-semibold">৳{combo.offerPrice}</span>
              <span className="text-xs line-through text-muted-foreground ml-2">
                ৳{combo.price}
              </span>
            </>
          ) : (
            <span className="font-semibold">৳{combo.price}</span>
          )}
        </div>
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center gap-2">
          <Link
            href={`/admin/combos/${combo._id}`}
            className="p-2 rounded hover:bg-muted"
          >
            <Pencil className="w-4 h-4" />
          </Link>

          <button
            onClick={() => handleDelete(combo._id)}
            className="p-2 rounded hover:bg-red-100 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
