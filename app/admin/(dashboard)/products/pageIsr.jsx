// // app/admin/products/page.jsx

// import ProductsClient from "@/components/Dashboard/Products/ProductsClient"
// import { BASE_URL } from "@/utils/baseUrl"

// export const revalidate = 60 // ISR every 60 seconds

// async function getProducts() {
//   try {
//     const res = await fetch(`${BASE_URL}/api/products`, {
//       next: { revalidate: 60 },
//     })
//     if (!res.ok) throw new Error("Failed to fetch products")
//     return res.json()
//   } catch (error) {
//     console.error("Failed to fetch products:", error)
//     return []
//   }
// }

// export default async function ProductsPage() {
//   const products = await getProducts()

//   return <ProductsClient initialProducts={products} />
// }
