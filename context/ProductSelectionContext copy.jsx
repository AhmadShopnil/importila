// "use client"

// import { createContext, useContext, useReducer } from "react"

// const ProductSelectionContext = createContext()

// /* ---------------- REDUCER ---------------- */

// function reducer(state, action) {
//   switch (action.type) {
//     case "UPDATE_ITEM": {
//       const { productId, variant, quantity } = action.payload
//       const key = `${productId}-${variant.sku}`

//       // Stock guard
//       const safeQuantity = Math.min(quantity, variant.stock, 10)

//       if (safeQuantity <= 0) {
//         const newState = { ...state }
//         delete newState[key]
//         return newState
//       }

//       return {
//         ...state,
//         [key]: {
//           productId,
//           ...variant,
//           quantity: safeQuantity,
//         },
//       }
//     }

//     case "REMOVE_ITEM": {
//       const newState = { ...state }
//       delete newState[action.payload]
//       return newState
//     }

//     case "CLEAR_ALL":
//       return {}

//     default:
//       return state
//   }
// }

// /* ---------------- PROVIDER ---------------- */

// export function ProductSelectionProvider({ children }) {
//   const [selectedItems, dispatch] = useReducer(reducer, {})

//   const updateItem = (productId, variant, quantity) => {
//     dispatch({
//       type: "UPDATE_ITEM",
//       payload: { productId, variant, quantity },
//     })
//   }

//   const removeItem = (key) => {
//     dispatch({ type: "REMOVE_ITEM", payload: key })
//   }

//   const clearAll = () => {
//     dispatch({ type: "CLEAR_ALL" })
//   }

//   const totalItems = Object.values(selectedItems).reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   )

//   return (
//     <ProductSelectionContext.Provider
//       value={{
//         selectedItems,
//         updateItem,
//         removeItem,
//         clearAll,
//         totalItems,
//       }}
//     >
//       {children}
//     </ProductSelectionContext.Provider>
//   )
// }

// /* ---------------- HOOK ---------------- */

// export const useProductSelection = () =>
//   useContext(ProductSelectionContext)
