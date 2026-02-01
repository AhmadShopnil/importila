// export default function ComboOrderBar({ selected, combos }) {
//   const selectedItems = Object.values(selected)

//   const total = selectedItems.reduce((sum, item) => {
//     const combo = combos.find((c) => c._id === item.comboId)
//     return sum + (combo?.price || 0)
//   }, 0)

//   const handleOrder = () => {
//     if (selectedItems.length === 0) {
//       alert("Please select size first")
//       return
//     }

//     console.log("Order payload:", selectedItems)
//     // 👉 redirect to checkout / call API
//   }

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         <div>
//           <p className="text-sm text-muted-foreground">
//             Selected Combos: {selectedItems.length}
//           </p>
//           <p className="text-lg font-bold">Total: ৳ {total}</p>
//         </div>

//         <button
//           onClick={handleOrder}
//           className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
//         >
//           Place Order
//         </button>
//       </div>
//     </div>
//   )
// }
