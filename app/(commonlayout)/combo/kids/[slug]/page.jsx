import { notFound } from "next/navigation"
import ComboLandingPage from "@/components/landing/ComboLandingPage"
import { BASE_URL } from "@/utils/baseUrl"


async function getCombo(slug) {
  try {


    const url = `${BASE_URL}/api/combos/${slug}`



    const res = await fetch(url
      ,
      {
        next: { revalidate: 60 }, // ISR
      }
    )

    if (!res.ok) return null

    return res.json()
  } catch (error) {
    return null
  }
}




export default async function Page({ params }) {

  const { slug } = await params;
  const combo = await getCombo(slug)

  if (!combo) {
    notFound()
  }

  return <ComboLandingPage
    combo={combo}
  />
}
