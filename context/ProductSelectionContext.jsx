"use client"

import { createContext, useContext, useEffect, useReducer } from "react"

const ProductSelectionContext = createContext()

const STORAGE_KEY = "product-selection"

/* ---------------- REDUCER ---------------- */

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.payload || {}

    case "UPDATE_ITEM": {
      const { productId, variant, quantity } = action.payload
      const key = `${productId}-${variant.sku}`

      const safeQuantity = Math.min(quantity, variant.stock)

      if (safeQuantity <= 0) {
        const newState = { ...state }
        delete newState[key]
        return newState
      }

      return {
        ...state,
        [key]: {
          productId,
          ...variant,
          quantity: safeQuantity,
        },
      }
    }

    case "REMOVE_ITEM": {
      const newState = { ...state }
      delete newState[action.payload]
      return newState
    }

    case "CLEAR_ALL":
      return {}

    default:
      return state
  }
}

/* ---------------- PROVIDER ---------------- */

export function ProductSelectionProvider({ children }) {
  const [selectedItems, dispatch] = useReducer(reducer, {})

  /* 🔹 Load from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      dispatch({ type: "INIT", payload: JSON.parse(stored) })
    }
  }, [])

  /* 🔹 Save to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems))
  }, [selectedItems])

  const updateItem = (productId, variant, quantity) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { productId, variant, quantity },
    })
  }

  const removeItem = (key) => {
    dispatch({ type: "REMOVE_ITEM", payload: key })
  }

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" })
    localStorage.removeItem(STORAGE_KEY)
  }

  const totalItems = Object.values(selectedItems).reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <ProductSelectionContext.Provider
      value={{
        selectedItems,
        updateItem,
        removeItem,
        clearAll,
        totalItems,
      }}
    >
      {children}
    </ProductSelectionContext.Provider>
  )
}

/* ---------------- HOOK ---------------- */

export const useProductSelection = () => {
  const context = useContext(ProductSelectionContext)
  if (!context) {
    throw new Error(
      "useProductSelection must be used within ProductSelectionProvider"
    )
  }
  return context
}
