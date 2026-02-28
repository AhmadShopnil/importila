
import ProductsList from '@/components/Home/ProductList/ProductList'
import ShopPage from '@/components/Shop/ShopPage'
import { BASE_URL } from "@/utils/baseUrl"



export const revalidate = 60

export default async function Page() {
  let products = []

  try {
    const res = await fetch(`${BASE_URL}/api/products`, {
      next: { revalidate: 30 },
    })
    if (res.ok) {
      products = await res.json()
    } else {
      console.error('Failed to fetch products', res.status)
    }
  } catch (err) {
    console.error('Error fetching products shop page:', err)
  }


  return (
    <div>
      <ShopPage />

    </div>
  )
}
