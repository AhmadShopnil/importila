"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import ComboTableRow from "@/components/Dashboard/Combos/ComboTableRow"
import { BASE_URL } from "@/utils/baseUrl"

export default function CombosClient({ initialCombos }) {
  const [combos, setCombos] = useState(initialCombos)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this combo?")) return

    const res = await fetch(`${BASE_URL}/api/combos/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setCombos(prev => prev.filter(c => c._id !== id))
    }
  }

  const filteredCombos = combos.filter(combo =>
    combo.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Combos</h1>

        <Link
          href="/admin/combos/create"
          className="flex items-center gap-2 bg-[#1E556E] text-primary-foreground
          px-4 py-2 rounded-lg hover:opacity-90 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Combo
        </Link>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search combos..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-card rounded-lg border">
        <table className="w-full text-sm">
          <tbody>
            {filteredCombos.map(combo => (
              <ComboTableRow
                key={combo._id}
                combo={combo}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filteredCombos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No combos found
        </div>
      )}
    </div>
  )
}
