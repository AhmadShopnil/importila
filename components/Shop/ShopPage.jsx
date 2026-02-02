import ShopPageClient from '@/components/Shop/ShopPageClient'
import { BASE_URL } from "@/utils/baseUrl"

export const revalidate = 60

export default async function ShopPage() {
    let initialData = { products: [], pagination: { total: 0, page: 1, totalPages: 1 } }
    let categories = []

    try {
        // Fetch Categories and Products in parallel
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`${BASE_URL}/api/products?page=1&limit=12`, { next: { revalidate: 30 } }),
            fetch(`${BASE_URL}/api/categories`, { next: { revalidate: 60 } })
        ])

        if (productsRes.ok) {
            initialData = await productsRes.json()
        }

        if (categoriesRes.ok) {
            categories = await categoriesRes.json()
        }
    } catch (err) {
        console.error('Error fetching data for shop page:', err)
    }

    return (
        <div className='min-h-screen'>
            <ShopPageClient
                initialProducts={initialData.products}
                initialPagination={initialData.pagination}
                categories={categories}
            />
        </div>
    )
}
