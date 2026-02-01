"use client"

import { useEffect, useState } from "react"
import { Save, Globe } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Loading from "@/components/Loader/Loading"

export default function SEOSettingsPage() {
    const [settings, setSettings] = useState({
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterCard: "summary_large_image",
        twitterSite: "",
        robotsTxt: "User-agent: *\nAllow: /",
        sitemapUrl: "/sitemap.xml"
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/settings`)
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
            const res = await fetch(`${BASE_URL}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            })

            if (res.ok) {
                toast.success("SEO settings saved successfully!")
            } else {
                toast.error("Failed to save settings")
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
            {/* Basic SEO */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Basic SEO</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Meta Title</label>
                        <input
                            type="text"
                            value={settings.metaTitle}
                            onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="Kids Shop - Quality Kids Clothing"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 50-60 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Meta Description</label>
                        <textarea
                            value={settings.metaDescription}
                            onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none resize-none"
                            placeholder="Shop for quality kids clothing with fun designs"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Meta Keywords</label>
                        <input
                            type="text"
                            value={settings.metaKeywords}
                            onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="kids clothing, children wear, baby clothes"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords</p>
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Social Media (Open Graph & Twitter)</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">OG Title</label>
                        <input
                            type="text"
                            value={settings.ogTitle}
                            onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="Leave empty to use Meta Title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">OG Description</label>
                        <textarea
                            value={settings.ogDescription}
                            onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none resize-none"
                            placeholder="Leave empty to use Meta Description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">OG Image URL</label>
                        <input
                            type="url"
                            value={settings.ogImage}
                            onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="https://example.com/og-image.jpg"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x630px</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Twitter Handle</label>
                        <input
                            type="text"
                            value={settings.twitterSite}
                            onChange={(e) => setSettings({ ...settings, twitterSite: e.target.value })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                            placeholder="@kidsshop"
                        />
                    </div>
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
                    {saving ? "Saving..." : "Save SEO Settings"}
                </button>
            </div>
        </form>
    )
}
