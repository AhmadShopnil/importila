"use client"

import { useState } from "react"
import { useProductSelection } from "@/context/ProductSelectionContext"
import { ChevronUp, CircleArrowUp, X } from "lucide-react"
import Container from "@/components/Container"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"

export default function SummaryBar() {
  const MIN_SETS = 3

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
  })

  const {
    selectedItems,
    totalItems: totalSets,
    removeItem,
    clearAll,
  } = useProductSelection()

  const isMinimumMet = totalSets >= MIN_SETS
  const hasItems = Object.keys(selectedItems).length > 0

  /* ---------------- BUY NOW ---------------- */

  const handlePlaceOrder = async () => {
    if (!form.customerName || !form.phone || !form.address) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setLoading(true)

      const items = Object.values(selectedItems).map((item) => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const orderData = {
        ...form,
        items,
        totalPrice,
        productType: "regular",
      }

      console.log("order data", orderData)
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!res.ok) throw new Error("Order failed")

      const data = await res.json()

      clearAll()
      setShowModal(false)
      setOpen(false)

      toast.success(`Order placed! Order ID: ${data.orderNumber}`)
    } catch (err) {
      console.log("error", err)
      toast.error("Failed to place order")
    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      {/* SUMMARY BAR */}
      <div className="fixed bottom-14 left-3 right-3 lg:bottom-0 lg:left-0 lg:right-0 
        shadow-2xl bg-white rounded-md lg:border-t transition-all duration-300 z-40">

        {hasItems && (
          <div className="flex justify-center -mt-2">
            <span
              onClick={() => setOpen((v) => !v)}
              className={`cursor-pointer bg-[#5F9498] p-0.5 text-white rounded-full transition-transform
              ${open ? "rotate-180" : ""}`}
            >

              <ChevronUp size={20} />
            </span>
          </div>
        )}

        <Container className="pb-1 md:py-2 ">
          {/* HEADER */}
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Total Sets:</span>
              <span className="text-xl font-bold text-primary">{totalSets}</span>
              <span className="text-sm text-muted-foreground">/ {MIN_SETS}</span>
            </div>
          </div>

          {/* STATUS + ACTION */}
          <div className="py-2 flex justify-between items-center">
            <div>
              {!isMinimumMet && totalSets > 0 && (
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Add {MIN_SETS - totalSets} more set
                  {MIN_SETS - totalSets !== 1 ? "s" : ""}
                </p>
              )}

              {isMinimumMet && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Ready to checkout!
                </p>
              )}
            </div>

            <button
              disabled={!isMinimumMet}
              onClick={() => setShowModal(true)}
              className={`rounded-md px-4.5 py-1.5 md:px-6 md:py-2 text-sm md:text-sm lg:text-base cursor-pointer font-semibold transition
              ${isMinimumMet
                  ? "bg-[#1C546D] text-primary-foreground hover:scale-105"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
            >
              Buy Now
            </button>
          </div>

          {/* DRAWER */}
          <div
            className={`overflow-hidden transition-all duration-300 flex flex-wrap gap-2
            ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
          >
            {Object.entries(selectedItems).map(([key, item]) => (
              <span key={key}
                className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-xl">
                <span>{item.name} × {item.quantity}</span>
                <button
                  onClick={() => removeItem(key)}
                  className="hover:bg-red-600 p-1 rounded-full hover:text-white"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showModal && (
        <div className="fixed bottom-16 inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-md rounded-t-xl md:rounded-xl p-5">
            <h3 className="text-lg font-bold mb-4">Customer Details</h3>

            <div className="space-y-3">
              <input
                placeholder="Customer Name *"
                className="w-full border px-3 py-2 rounded-md"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />

              <input
                placeholder="Phone Number *"
                className="w-full border px-3 py-2 rounded-md"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <textarea
                placeholder="Delivery Address *"
                className="w-full border px-3 py-2 rounded-md"
                rows={2}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <textarea
                placeholder="Note (optional)"
                className="w-full border px-3 py-2 rounded-md"
                rows={2}
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="w-full border rounded-md py-2"
              >
                Cancel
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-md py-2 font-semibold"
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
