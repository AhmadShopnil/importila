
import SlidersClient from "@/components/Dashboard/Sliders/SlidersClient"
import { BASE_URL } from "@/utils/baseUrl"

export const revalidate = 60

async function getSliders() {
    const res = await fetch(`${BASE_URL}/api/sliders`, {
        next: { revalidate: 60 }, // ISR
    })

    if (!res.ok) {
        throw new Error("Failed to fetch sliders")
    }

    return res.json()
}

export default async function SlidersPage() {
    const sliders = await getSliders()

    return <SlidersClient initialSliders={sliders} />
}
