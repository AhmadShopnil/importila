import { Geist, Geist_Mono, Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ProductSelectionProvider } from "@/context/ProductSelectionContext"
import { Providers } from "@/lib/redux/Providers"
import { BASE_URL } from "@/utils/baseUrl"

import { Anek_Bangla } from "next/font/google";

const anekBangla = Anek_Bangla({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["bengali", "latin"],
  variable: "--font-anek-bangla",
  display: "swap",
});



const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
})

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
      <body className={`${geist.variable} ${geistMono.variable} ${nunito.variable} ${anekBangla.variable} font-sans`}>
        <Providers>
          <ProductSelectionProvider>
            <Toaster position="top-right" />

            <main id="main-content">
              {children}
            </main>
            <Analytics />


          </ProductSelectionProvider>
        </Providers>
      </body>
    </html>
  )
}
