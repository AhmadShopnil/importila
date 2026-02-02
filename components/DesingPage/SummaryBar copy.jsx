// "use client"

// import { useState } from "react"
// import { useProductSelection } from "@/context/ProductSelectionContext"
// import { CircleArrowUp, X } from "lucide-react"
// import Container from "@/components/Container"
// import { BASE_URL } from "@/utils/baseUrl"

// export default function SummaryBar() {
//   const MIN_SETS = 3
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const {
//     selectedItems,
//     totalItems: totalSets,
//     removeItem,
//     clearAll,
//   } = useProductSelection()

//   const isMinimumMet = totalSets >= MIN_SETS
//   const hasItems = Object.keys(selectedItems).length > 0

//   /*  BUY NOW  */

//   const handleBuyNow = async () => {
//     if (!isMinimumMet || loading) return

//     try {
//       setLoading(true)

//       const items = Object.values(selectedItems).map((item) => ({
//         productId: item.productId,
//         sku: item.sku,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//       }))

//       const totalPrice = items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       )

//       const res = await fetch(`${BASE_URL}/api/orders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customerName: "Guest User",
//           customerEmail: "guest@example.com",
//           items,
//           totalPrice,
//         }),
//       })

//       if (!res.ok) {
//         throw new Error("Order failed")
//       }

//       const data = await res.json()

//       //  Success
//       clearAll()
//       setOpen(false)

//       alert(`Order placed successfully!\nOrder ID: ${data.orderNumber}`)
//     } catch (error) {
//       console.error(error)
//       alert("Failed to place order. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }



//   return (
//     <div className="fixed bottom-4 left-3 right-3 lg:bottom-0 lg:left-0 lg:right-0 
//       shadow-2xl bg-white rounded-md lg:border-t lg:border-border transition-all duration-300">

//       {hasItems && (
//         <div className="flex justify-center -mt-3">
//           <span
//             onClick={() => setOpen((v) => !v)}
//             className={`cursor-pointer bg-white rounded-full transition-transform duration-300
//             ${open ? "rotate-180" : ""}`}
//           >
//             <CircleArrowUp size={26} />
//           </span>
//         </div>
//       )}

//       <Container className=" py-2">
//         {/* HEADER */}
//         <div
//           className="flex items-center justify-between  cursor-pointer"
//           onClick={() => setOpen((v) => !v)}
//         >
//           <div className="flex items-baseline gap-2">
//             <span className="text-sm text-muted-foreground">Total Sets:</span>
//             <span className="text-xl font-bold text-primary">{totalSets}</span>
//             <span className="text-sm text-muted-foreground">/ {MIN_SETS}</span>
//           </div>
//         </div>



//         <div className="py-2 flex justify-between items-center ">
//         <div>
//             {!isMinimumMet && totalSets > 0 && (
//             <p className="text-sm text-destructive font-medium">
//               ⚠️ Add {MIN_SETS - totalSets} more set
//               {MIN_SETS - totalSets !== 1 ? "s" : ""} to proceed
//             </p>
//           )}

//           {isMinimumMet && (
//             <p className="text-sm text-green-600 font-medium">
//               ✓ Ready to checkout!
//             </p>
//           )}
//         </div>


//           {/* ACTION */}
//           <div className=" flex justify-center items-center ">
//             <button
//               onClick={handleBuyNow}
//               disabled={!isMinimumMet || loading}
//               className={`w-full sm:w-auto rounded-lg px-4 py-2 md:px-8 lg:px-10 md:py-3
//             font-semibold transition-all text-sm md:text-sm  lg:text-base
//             ${isMinimumMet
//                   ? "bg-primary text-primary-foreground hover:scale-105"
//                   : "bg-muted text-muted-foreground cursor-not-allowed"
//                 }`}
//             >
//               {loading ? "Placing Order..." : "Buy Now"}
//             </button>
//           </div>

//         </div>


//         {/* DRAWER */}
//         <div
//           className={`overflow-hidden transition-all duration-300 flex flex-wrap gap-2
//           ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
//         >
//           {Object.entries(selectedItems).map(([key, item]) => (
//             <span key={key}
//               className="flex items-center gap-2 text-sm mb-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-xl">
//               <span>{item.name} × {item.quantity}</span>
//               <button
//                 className="cursor-pointer hover:bg-red-700 rounded-full p-1 hover:text-white"
//                 onClick={() => removeItem(key)}

//               >
//                 <X size={12} />
//               </button>
//             </span>
//           ))}
//         </div>

      
//       </Container>
//     </div>
//   )
// }
