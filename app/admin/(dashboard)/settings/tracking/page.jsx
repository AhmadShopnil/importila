"use client"

import { useEffect, useState } from "react"
import { Save, Code, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Loading from "@/components/Loader/Loading"

export default function TrackingSettingsPage() {
    const [settings, setSettings] = useState({
        googleTagManagerId: "",
        facebookPixelId: "",
        googleAnalyticsId: "",
        tiktokPixelId: "",
        snapchatPixelId: "",
        enableGTM: false,
        enableFBPixel: false,
        enableGA: false,
        enableTikTok: false,
        enableSnapchat: false,
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showIds, setShowIds] = useState({})

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch(`/api/settings`, {
                credentials: "include"
            })
            const data = await res.json()
            if (res.ok) {
                setSettings(prev => ({ ...prev, ...data }))
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error)
            toast.error("Failed to load settings")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch(`/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
                credentials: "include"
            })

            if (res.ok) {
                toast.success("Tracking settings saved! Refresh your storefront to see changes.")
            } else {
                const errorData = await res.json().catch(() => ({}))
                toast.error(errorData.error || "Failed to save settings")
            }
        } catch (error) {
            console.error("Failed to save settings:", error)
            toast.error("An error occurred")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    const trackingPlatforms = [
        {
            name: "Google Tag Manager",
            key: "GTM",
            idField: "googleTagManagerId",
            enableField: "enableGTM",
            color: "blue",
            placeholder: "GTM-XXXXXXX",
            description: "Manage all your tracking tags in one place",
            instructions: "1. Go to tagmanager.google.com\n2. Create a container\n3. Copy the Container ID (GTM-XXXXXXX)"
        },
        {
            name: "Facebook Pixel",
            key: "FBPixel",
            idField: "facebookPixelId",
            enableField: "enableFBPixel",
            color: "indigo",
            placeholder: "123456789012345",
            description: "Track Facebook ad conversions and retargeting",
            instructions: "1. Go to Facebook Events Manager\n2. Create a Pixel\n3. Copy the Pixel ID (15-digit number)"
        },
        {
            name: "Google Analytics 4",
            key: "GA",
            idField: "googleAnalyticsId",
            enableField: "enableGA",
            color: "orange",
            placeholder: "G-XXXXXXXXXX",
            description: "Track website traffic and user behavior",
            instructions: "1. Go to analytics.google.com\n2. Create a GA4 property\n3. Copy the Measurement ID (G-XXXXXXXXXX)"
        },
        {
            name: "TikTok Pixel",
            key: "TikTok",
            idField: "tiktokPixelId",
            enableField: "enableTikTok",
            color: "pink",
            placeholder: "CXXXXXXXXXXXXXXXXXX",
            description: "Track TikTok ad performance",
            instructions: "1. Go to TikTok Ads Manager\n2. Create a Pixel\n3. Copy the Pixel Code"
        },
        {
            name: "Snapchat Pixel",
            key: "Snapchat",
            idField: "snapchatPixelId",
            enableField: "enableSnapchat",
            color: "yellow",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            description: "Track Snapchat ad conversions",
            instructions: "1. Go to Snap Pixel in Ads Manager\n2. Create a Pixel\n3. Copy the Pixel ID"
        }
    ]

    const colorClasses = {
        blue: { bg: "bg-blue-50", border: "border-blue-200", toggle: "peer-checked:bg-blue-600", ring: "focus:ring-blue-500", icon: "bg-blue-500" },
        indigo: { bg: "bg-indigo-50", border: "border-indigo-200", toggle: "peer-checked:bg-indigo-600", ring: "focus:ring-indigo-500", icon: "bg-indigo-600" },
        orange: { bg: "bg-orange-50", border: "border-orange-200", toggle: "peer-checked:bg-orange-600", ring: "focus:ring-orange-500", icon: "bg-orange-500" },
        pink: { bg: "bg-pink-50", border: "border-pink-200", toggle: "peer-checked:bg-pink-600", ring: "focus:ring-pink-500", icon: "bg-pink-600" },
        yellow: { bg: "bg-yellow-50", border: "border-yellow-200", toggle: "peer-checked:bg-yellow-600", ring: "focus:ring-yellow-500", icon: "bg-yellow-500" }
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h2 className="text-xl font-semibold mb-2">Tracking & Analytics</h2>
                <p className="text-sm text-muted-foreground">
                    Configure tracking pixels and analytics tools to measure your store's performance and optimize marketing campaigns.
                </p>
            </div>

            {trackingPlatforms.map((platform) => {
                const colors = colorClasses[platform.color]
                const isEnabled = settings[platform.enableField]
                const idValue = settings[platform.idField]
                const showId = showIds[platform.key]

                return (
                    <div key={platform.key} className={`p-6 ${colors.bg} border ${colors.border} rounded-xl`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{platform.name}</h3>
                                    <p className="text-sm text-muted-foreground">{platform.description}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isEnabled}
                                    onChange={(e) => setSettings({ ...settings, [platform.enableField]: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className={`w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 ${colors.ring.replace('focus:', 'peer-focus:')} rounded-full peer ${colors.toggle} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all`}></div>
                            </label>
                        </div>

                        {isEnabled && (
                            <div className="space-y-4 mt-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        {platform.name} ID
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showId ? "text" : "password"}
                                            value={idValue}
                                            onChange={(e) => setSettings({ ...settings, [platform.idField]: e.target.value })}
                                            className={`w-full px-4 py-3 pr-12 border border-border rounded-lg focus:ring-2 ${colors.ring} outline-none bg-white`}
                                            placeholder={platform.placeholder}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowIds({ ...showIds, [platform.key]: !showId })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showId ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white/50 rounded-lg p-4 border border-white">
                                    <p className="text-xs font-semibold mb-2 text-muted-foreground">How to get your {platform.name} ID:</p>
                                    <pre className="text-xs text-muted-foreground whitespace-pre-line font-mono">
                                        {platform.instructions}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}

            {/* Events Being Tracked Info */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">📊 Events Being Tracked</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Page View", "Product View", "Add to Cart", "Begin Checkout", "Purchase", "Search"].map((event) => (
                        <div key={event} className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">{event}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="sticky bottom-4 z-10">
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#1E556E] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-[#1E556E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save Tracking Settings"}
                </button>
            </div>
        </form>
    )
}
