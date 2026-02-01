import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ProductSelectionProvider } from "@/context/ProductSelectionContext"
import TrackingScripts from "@/components/TrackingScripts"
import { BASE_URL } from "@/utils/baseUrl"


const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

async function getSettings() {

  try {
    const res = await fetch(`${BASE_URL}/api/settings`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return null
  }
}


export async function generateMetadata() {
  const settings = await getSettings()

  return {
    title: settings?.metaTitle || "impoortila",
    description: settings?.metaDescription || "Shop for quality kids clothing with fun designs",
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
}

export default async function RootLayout({ children }) {


  const settings = await getSettings()
  // console.log("settings", settings)

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ProductSelectionProvider>
          <Toaster position="top-right" />

          {children}
          <Analytics />

          {/* Tracking Scripts */}
          <TrackingScripts
            gtmId={settings?.googleTagManagerId || ""}
            fbPixelId={settings?.facebookPixelId || ""}
            gaId={settings?.googleAnalyticsId || ""}
            tiktokPixelId={settings?.tiktokPixelId || ""}
            snapchatPixelId={settings?.snapchatPixelId || ""}
            enableGTM={settings?.enableGTM || false}
            enableFBPixel={settings?.enableFBPixel || false}
            enableGA={settings?.enableGA || false}
            enableTikTok={settings?.enableTikTok || false}
            enableSnapchat={settings?.enableSnapchat || false}
          />
        </ProductSelectionProvider>
      </body>
    </html>
  )
}
