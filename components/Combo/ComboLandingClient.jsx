"use client"

import { useState } from "react"
import ComboHero from "./ComboHero"
import ComboItems from "./ComboItems"
import ComboSizeSelector from "./ComboSizeSelector"
import ComboOrderSection from "./ComboOrderSection"
import Container from "@/components/Container"

export default function ComboLandingClient({ combo }) {
  const [selectedSize, setSelectedSize] = useState(null)

  return (
    <div className="min-h-screen bg-background pb-40">
      <ComboHero combo={combo} />

      <Container className=" space-y-12">
        <ComboItems items={combo.items} />

        <ComboSizeSelector
          sizes={combo.sizes}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />
      </Container>

      <ComboOrderSection combo={combo} selectedSize={selectedSize} />
    </div>
  )
}
