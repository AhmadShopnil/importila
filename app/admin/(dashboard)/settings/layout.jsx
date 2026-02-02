"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, Globe, Code, Tag, Menu as MenuIcon, Truck, Bell, Shield } from "lucide-react"

const settingsMenu = [
    // {
    //     label: "General",
    //     href: "/admin/settings",
    //     icon: Store,
    //     description: "Store information and basic settings"
    // },
    {
        label: "SEO & Meta",
        href: "/admin/settings/seo",
        icon: Globe,
        description: "Search engine optimization"
    },
    {
        label: "Tracking & Analytics",
        href: "/admin/settings/tracking",
        icon: Code,
        description: "GTM, Facebook Pixel, and analytics"
    },
    {
        label: "Menu Management",
        href: "/admin/settings/menus",
        icon: MenuIcon,
        description: "Configure navigation menus"
    },
    // {
    //     label: "Order Settings",
    //     href: "/admin/settings/orders",
    //     icon: Tag,
    //     description: "Order prefixes and configurations"
    // },
    // {
    //     label: "Shipping & Delivery",
    //     href: "/admin/settings/shipping",
    //     icon: Truck,
    //     description: "Delivery zones and charges"
    // },
    // {
    //     label: "Notifications",
    //     href: "/admin/settings/notifications",
    //     icon: Bell,
    //     description: "Email and SMS notifications"
    // },
    // {
    //     label: "Advanced",
    //     href: "/admin/settings/advanced",
    //     icon: Shield,
    //     description: "Advanced system settings"
    // },
    {
        label: "Courier Integration",
        href: "/admin/settings/courier",
        icon: Truck,
        description: "Manage courier services & API"
    }
]

export default function SettingsLayout({ children }) {
    const pathname = usePathname()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1E556E] mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your store configuration and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-border shadow-sm p-4 sticky top-4">
                        <nav className="space-y-1">
                            {settingsMenu.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? "bg-[#1E556E] text-white shadow-md"
                                            : "hover:bg-muted text-foreground"
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? "text-white" : "text-[#1E556E]"}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold text-sm ${isActive ? "text-white" : ""}`}>
                                                {item.label}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                                                {item.description}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    {children}
                </div>
            </div>
        </div>
    )
}
