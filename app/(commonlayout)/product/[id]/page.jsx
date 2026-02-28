import { BASE_URL } from "@/utils/baseUrl"
import ProductDetailsClient from "@/components/Shop/ProductDetailsClient"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }) {
  const { id } = await params
  const res = await fetch(`${BASE_URL}/api/products/${id}`)
  const product = await res.json()

  if (!product || product.error) return { title: 'Product Not Found' }

  return {
    title: `${product.name} | Importila`,
    description: product.description,
    openGraph: {
      images: [product.featuredImage],
    },
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  let product = null

  try {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      next: { revalidate: 60 }
    })
    if (res.ok) {
      product = await res.json()
    }
  } catch (err) {
    console.error('Error fetching product:', err)
  }

  if (!product || product.error) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <ProductDetailsClient product={product} />
    </main>
  )
}
