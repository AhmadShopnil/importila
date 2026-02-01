
import { Analytics } from "@vercel/analytics/next"
import { ProductSelectionProvider } from "@/context/ProductSelectionContext"
import Navbar from "@/components/Header/Navbar"
import Menubar from "@/components/Header/Menubar"
import BottomAppBar from "@/components/Footer/BottomAppBar"
import Footer from "@/components/Footer/Footer"


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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ProductSelectionProvider>

          <Menubar />
          {children}
          {/* <BottomAppBar /> */}
          <Analytics />
        </ProductSelectionProvider>

        <div className="">
          <BottomAppBar />
        </div>
        <Footer />
      </body>
    </html>
  )
}
