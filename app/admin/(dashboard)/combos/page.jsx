"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import Loading from "@/components/Loader/Loading"
import ComboTableRow from "@/components/Dashboard/Combos/ComboTableRow"
import { useGetCombosQuery, useDeleteComboMutation } from "@/lib/redux/api/comboApi"

export default function CombosPage() {
  const { data: combos = [], isLoading: loading } = useGetCombosQuery()
  const [deleteCombo] = useDeleteComboMutation()
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this combo?")) return

    try {
      await deleteCombo(id).unwrap()
    } catch (error) {
      console.error("Failed to delete combo:", error)
    }
  }

  const filteredCombos =
    combos?.filter((combo) =>
      combo.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // if (loading) return <Loading />

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
            type="text"
            placeholder="Search combos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border
              rounded-lg bg-background text-foreground"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-card rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Combo</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">
                Products
              </th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">
                Sizes
              </th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
                Price
              </th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCombos.map((combo) => (
              <ComboTableRow
                key={combo._id}
                combo={combo}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {filteredCombos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {combos.length === 0
            ? "No combos yet. Create your first combo!"
            : "No combos match your search."}
        </div>
      )}
    </div>
  )
}
