import { notFound } from "next/navigation"
import ComboLandingPage from "@/components/landing/ComboLandingPage"
import { BASE_URL } from "@/utils/baseUrl"
import { getSliders } from "@/utils/apiActions"


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

export async function generateMetadata({ params }) {
  const { slug } = await params
  const combo = await getCombo(slug)

  if (!combo) {
    return {
      title: "Combo Not Found",
    }
  }

  return {
    title: `${combo.title} | Importila` || "Importila-Combo",
    description: combo?.shortDescription || combo.description || combo?.landingPageTitle || combo.title,
    openGraph: {
      title: combo.title,
      description: combo?.shortDescription || combo?.description || combo?.title,
      images: [
        {
          url: combo?.featuredImage || combo?.image,
          width: 800,
          height: 600,
          alt: combo?.title,
        },
      ],
    },
  }
}

export default async function Page({ params }) {

  const { slug } = await params;
  const combo = await getCombo(slug)
    const comboSliders = await getSliders("combo_hero_slider") || [];
    

  if (!combo) {
    notFound()
  }

  return <ComboLandingPage
    combo={combo}
    comboSliders={comboSliders}
  />
}
