"use client"

import { useEffect, useState } from "react"
import { Save, Store, Mail, Phone, MapPin, DollarSign, Image as ImageIcon, Truck } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Loading from "@/components/Loader/Loading"
import RichTextEditor from "@/components/RichTextEditor"
import { FileText } from "lucide-react"

export default function GeneralSettingsPage() {
    const [settings, setSettings] = useState({
        storeName: "",
        storeEmail: "",
        storePhone: "",
        storeAddress: "",
        storeCity: "",
        storeCountry: "",
        storeZipCode: "",
        currency: "BDT",
        currencySymbol: "৳",
        storeLogo: "",
        storeFavicon: "",
        timezone: "Asia/Dhaka",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "12h",
        insideDhakaCharge: 60,
        outsideDhakaCharge: 120,
        lowStockThreshold: 10,
        termsAndConditions: ""
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

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
                toast.success("Settings saved successfully!")
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

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Store Information */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Store className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Store Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Store Name *</label>
                        <input
                            type="text"
                            required
                            value={settings.storeName}
                            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="Kids Shop"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Store Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={settings.storeEmail}
                            onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="contact@kidsshop.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> Store Phone *
                        </label>
                        <input
                            type="tel"
                            required
                            value={settings.storePhone}
                            onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="+880 1XXXXXXXXX"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Street Address
                        </label>
                        <input
                            type="text"
                            value={settings.storeAddress}
                            onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="123 Main Street"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">City</label>
                        <input
                            type="text"
                            value={settings.storeCity}
                            onChange={(e) => setSettings({ ...settings, storeCity: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="Dhaka"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Zip Code</label>
                        <input
                            type="text"
                            value={settings.storeZipCode}
                            onChange={(e) => setSettings({ ...settings, storeZipCode: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="1200"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Country</label>
                        <input
                            type="text"
                            value={settings.storeCountry}
                            onChange={(e) => setSettings({ ...settings, storeCountry: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="Bangladesh"
                        />
                    </div>
                </div>
            </div>

            {/* Currency Settings */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <DollarSign className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Currency & Localization</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Currency Code</label>
                        <select
                            value={settings.currency}
                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                        >
                            <option value="BDT">BDT - Bangladeshi Taka</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="INR">INR - Indian Rupee</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Currency Symbol</label>
                        <input
                            type="text"
                            value={settings.currencySymbol}
                            onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="৳"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Timezone</label>
                        <select
                            value={settings.timezone}
                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                        >
                            <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                            <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Date Format</label>
                        <select
                            value={settings.dateFormat}
                            onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Time Format</label>
                        <select
                            value={settings.timeFormat}
                            onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                        >
                            <option value="12h">12 Hour (AM/PM)</option>
                            <option value="24h">24 Hour</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Shipping Settings */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Truck className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Shipping Charges</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Inside Dhaka Charge (৳)</label>
                        <input
                            type="number"
                            value={settings.insideDhakaCharge}
                            onChange={(e) => setSettings({ ...settings, insideDhakaCharge: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="60"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Outside Dhaka Charge (৳)</label>
                        <input
                            type="number"
                            value={settings.outsideDhakaCharge}
                            onChange={(e) => setSettings({ ...settings, outsideDhakaCharge: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="120"
                        />
                    </div>
                </div>
            </div>

            {/* Inventory Settings */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Store className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Inventory Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Low Stock Alert Threshold</label>
                        <input
                            type="number"
                            min="0"
                            value={settings.lowStockThreshold}
                            onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="10"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Products with stock under this amount will trigger a low stock alert.</p>
                    </div>
                </div>
            </div>

            {/* Branding */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <ImageIcon className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Branding</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Store Logo URL</label>
                        <input
                            type="url"
                            value={settings.storeLogo}
                            onChange={(e) => setSettings({ ...settings, storeLogo: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="https://example.com/logo.png"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 200x50px PNG</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Favicon URL</label>
                        <input
                            type="url"
                            value={settings.storeFavicon}
                            onChange={(e) => setSettings({ ...settings, storeFavicon: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="https://example.com/favicon.ico"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 32x32px ICO or PNG</p>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Legal & Policies</h2>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground flex justify-between items-center">
                        <span>Terms and Conditions</span>
                        <span className="text-[10px] text-primary bg-primary/5 px-2 py-1 rounded">Rich Text Editor</span>
                    </label>
                    <RichTextEditor
                        value={settings.termsAndConditions}
                        onChange={(content) => setSettings(prev => ({ ...prev, termsAndConditions: content }))}
                        placeholder="Write your store's terms and conditions here..."
                    />
                </div>
            </div>


            <div className="sticky bottom-4 z-10">
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#1E556E] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-[#1E556E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save General Settings"}
                </button>
            </div>
        </form>
    )
}
