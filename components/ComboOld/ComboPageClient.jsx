"use client"

import { useState } from "react"
import ComboList from "./ComboList"
import ComboOrderBar from "./ComboOrderBar"

export default function ComboPageClient({ combos = [] }) {
  const [selected, setSelected] = useState({})

  const handleSizeSelect = (comboId, size) => {
    setSelected((prev) => ({
      ...prev,
      [comboId]: { comboId, size },
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* HERO */}
      <section className="text-center py-12 px-4 bg-secondary">
        <h1 className="text-3xl font-bold">Combo Offers for Kids 👕</h1>
        <p className="mt-2 text-muted-foreground">
          Select size and order instantly
        </p>
      </section>

      {/* COMBO LIST */}
      <ComboList
        combos={combos}
        selected={selected}
        onSizeSelect={handleSizeSelect}
      />

      {/* ORDER BAR */}
      <ComboOrderBar selected={selected} combos={combos} />
    </div>
  )
}
