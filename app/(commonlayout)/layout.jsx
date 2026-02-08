
import { Analytics } from "@vercel/analytics/next"
import { ProductSelectionProvider } from "@/context/ProductSelectionContext"
import Menubar from "@/components/Header/Menubar"
import BottomAppBar from "@/components/Footer/BottomAppBar"
import Footer from "@/components/Footer/Footer"
import { CartProvider } from "@/context/CartContext"
import CartDrawer from "@/components/Cart/CartDrawer"
import { GoogleTagManager } from '@next/third-parties/google'
import { BASE_URL } from "@/utils/baseUrl"
import PageViewTracker from "@/components/Tracking/PageViewTracker"
import { Suspense } from 'react'


export const metadata = {
  title: "Importila",
  description: "Shop for quality kids clothing with fun designs",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

async function getSettings() {
  try {
    const res = await fetch(`${BASE_URL}/api/settings`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return null
  }
}

export default async function RootLayout({ children }) {
  const settings = await getSettings()
  const gtmId = settings?.googleTagManagerId || settings?.gtmId


  // console.log("settings", settings)
  return (
    <>
      <CartProvider>
        <ProductSelectionProvider>

          {settings?.enableGTM && gtmId && (
            <GoogleTagManager gtmId={gtmId} />
          )}
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <Menubar />
          {children}
          {/* <BottomAppBar /> */}
          <Analytics />
          <CartDrawer />
        </ProductSelectionProvider>
      </CartProvider>

      <div className="">
        <BottomAppBar />
      </div>
      <Footer />
    </>
  )
}
