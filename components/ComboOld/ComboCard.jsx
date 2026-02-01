// export default function ComboCard({ combo, selectedSize, onSizeSelect }) {
//   return (
//     <div className="rounded-xl border bg-white p-5 space-y-4">
//       <img
//         src={combo.image}
//         alt={combo.title}
//         className="w-full h-56 object-cover rounded-lg"
//       />

//       <h3 className="text-xl font-semibold">{combo.title}</h3>
//       <p className="text-sm text-muted-foreground">{combo.description}</p>

//       <div className="flex gap-2 flex-wrap">
//         {combo.sizes.map((size) => (
//           <button
//             key={size}
//             onClick={() => onSizeSelect(combo._id, size)}
//             className={`px-4 py-2 rounded-md border text-sm font-medium
//               ${
//                 selectedSize === size
//                   ? "bg-primary text-white"
//                   : "hover:border-primary"
//               }`}
//           >
//             {size}
//           </button>
//         ))}
//       </div>

//       <div className="text-lg font-bold text-primary">
//         ৳ {combo.price}
//       </div>
//     </div>
//   )
// }
