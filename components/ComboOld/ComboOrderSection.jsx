export default function ComboOrderSection({ combo, selectedSize }) {
  const handleOrder = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    console.log({
      comboId: combo._id,
      size: selectedSize,
      price: combo.offerPrice,
    })

    alert("Order placed (demo)")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Selected Size: {selectedSize || "None"}
          </p>
          <p className="text-lg font-bold">
            ৳ {combo.offerPrice}
          </p>
        </div>

        <button
          onClick={handleOrder}
          className="px-6 py-3 rounded-lg bg-primary text-white font-semibold"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
