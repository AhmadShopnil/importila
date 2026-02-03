"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Menu,
  X,
  BarChart3,
  Package,
  Tag,
  ShoppingCart,
  TrendingUp,
  ChevronsLeft,
  LayoutList,
  Settings,
  ChevronDown,
  LogOut,
  GalleryVertical
} from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Sliders", href: "/admin/sliders", icon: GalleryVertical },
  { label: "Products", href: "/admin/products", icon: LayoutList },
  { label: "Combos", href: "/admin/combos", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },

  {
    label: "Orders",
    icon: ShoppingCart,
    children: [
      { label: "Regular Orders", href: "/admin/orders/regular" },
      { label: "Combo Orders", href: "/admin/orders/combos" },
      { label: "Manual Entry", href: "/admin/orders/new" },
    ],
  },

  { label: "Stock", href: "/admin/stock", icon: TrendingUp },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Sales Report", href: "/admin/reports" },
      { label: "Best Selling", href: "/admin/reports/best-selling" },
      { label: "Source Analysis", href: "/admin/reports/sources" },
    ],
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },

]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState({})
  const pathname = usePathname()
  const router = useRouter()

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/login", { method: "DELETE" })
      if (res.ok) {
        toast.success("Logged out successfully")
        router.push("/admin/login")
        router.refresh()
      }
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border px-4 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-primary">Kids Shop Admin</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-muted rounded"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full z-50 bg-card border-r border-border
        transition-all duration-300 flex flex-col
        ${mobileMenuOpen ? "w-64" : "w-0 lg:w-auto"} overflow-hidden
        ${sidebarOpen ? "lg:w-64" : "lg:w-20"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-border p-4">
          {sidebarOpen && (
            <Image src="/logo.svg" width={160} height={40} alt="Logo" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded hidden lg:block"
          >
            <ChevronsLeft
              className={`transition ${sidebarOpen ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2">
          {adminNavItems?.map((item) => {
            const Icon = item.icon
            const isParentActive =
              item.children?.some((c) => pathname === c.href)

            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-lg
                    ${isParentActive ? "bg-[#1E556E] text-white" : "text-[#1E556E] hover:bg-muted"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {(sidebarOpen || mobileMenuOpen) && (
                        <span>{item.label}</span>
                      )}
                    </div>
                    {(sidebarOpen || mobileMenuOpen) && (
                      <ChevronDown
                        className={`w-4 h-4 transition ${openMenus[item.label] ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </button>

                  {openMenus[item.label] && (sidebarOpen || mobileMenuOpen) && (
                    <div className="ml-9 mt-2 space-y-1">
                      {item?.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-md text-sm
                          ${pathname === child.href
                              ? "bg-muted font-semibold"
                              : "hover:bg-muted"
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg
                ${isActive ? "bg-[#1E556E] text-white" : "text-[#1E556E] hover:bg-muted"}`}
              >
                <Icon className="w-5 h-5" />
                {(sidebarOpen || mobileMenuOpen) && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-destructive text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <LogOut size={18} />
            {(sidebarOpen || mobileMenuOpen) && "Logout"}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
