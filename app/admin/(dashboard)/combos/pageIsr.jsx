
import CombosClient from "@/components/Dashboard/Combos/CombosClient"
import { getCombos } from "@/utils/apiActions"
import { BASE_URL } from "@/utils/baseUrl"

export const revalidate = 60 // cache for 60 seconds


export default async function CombosPage() {
  const combos = await getCombos()
  // console.log("combos",combos)

  return <CombosClient initialCombos={combos} />
}
