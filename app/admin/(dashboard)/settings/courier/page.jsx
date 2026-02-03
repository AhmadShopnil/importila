"use client"

import { useEffect, useState } from "react"
import { Save, Truck, Plus, Trash2, Key, Check, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import Loading from "@/components/Loader/Loading"

export default function CourierSettingsPage() {
    const [config, setConfig] = useState({
        providers: []
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/settings/courier`, {
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json()
                setConfig(data)
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
            const res = await fetch(`${BASE_URL}/api/settings/courier`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
                credentials: "include"
            })

            if (res.ok) {
                toast.success("Courier settings saved successfully!")
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

    const updateProvider = (index, field, value) => {
        const newProviders = [...config.providers]
        newProviders[index] = { ...newProviders[index], [field]: value }
        setConfig({ ...config, providers: newProviders })
    }

    const addProvider = () => {
        const newProvider = {
            id: `custom_${Date.now()}`,
            name: "New Courier Service",
            apiKey: "",
            secretKey: "",
            isActive: true,
            isDefault: false
        }
        setConfig({ ...config, providers: [...config.providers, newProvider] })
    }

    const removeProvider = (index) => {
        const newProviders = config.providers.filter((_, i) => i !== index)
        setConfig({ ...config, providers: newProviders })
    }

    if (loading) return <Loading />

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1E556E]">Courier Integration</h2>
                    <p className="text-muted-foreground">Manage your courier service providers and API keys</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {config.providers.map((provider, index) => (
                    <div key={index} className="bg-white rounded-xl border border-border shadow-sm p-6 relative group">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={provider.isActive}
                                    onChange={(e) => updateProvider(index, 'isActive', e.target.checked)}
                                    className="rounded border-gray-300 text-[#1E556E] focus:ring-[#1E556E]"
                                />
                                Active
                            </label>
                            {/* Only allow deleting custom providers, assume steadfast is built-in/default for now or allow all */}
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeProvider(index)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <Truck className="w-6 h-6 text-[#1E556E]" />
                            <h3 className="text-lg font-semibold">{provider.name || "Unknown Provider"}</h3>
                            {provider.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">Default</span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Provider Name</label>
                                <input
                                    type="text"
                                    required
                                    value={provider.name}
                                    onChange={(e) => updateProvider(index, 'name', e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                                    placeholder="e.g. Steadfast Courier"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Base URL (Optional)</label>
                                <input
                                    type="text"
                                    value={provider.baseUrl || ""}
                                    onChange={(e) => updateProvider(index, 'baseUrl', e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none"
                                    placeholder="https://portal.packzy.com/api/v1"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Key className="w-4 h-4" /> API Key
                                </label>
                                <input
                                    type="text"
                                    value={provider.apiKey}
                                    onChange={(e) => updateProvider(index, 'apiKey', e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none font-mono text-sm"
                                    placeholder="Enter API Key"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Key className="w-4 h-4" /> Secret Key
                                </label>
                                <input
                                    type="password"
                                    value={provider.secretKey}
                                    onChange={(e) => updateProvider(index, 'secretKey', e.target.value)}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-[#1E556E] outline-none font-mono text-sm"
                                    placeholder="Enter Secret Key"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addProvider}
                    className="w-full py-4 border-2 border-dashed border-[#1E556E]/30 rounded-xl text-[#1E556E] font-semibold hover:bg-[#1E556E]/5 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Another Courier
                </button>

                <div className="sticky bottom-4 z-10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-[#1E556E] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-[#1E556E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? "Saving..." : "Save Configuration"}
                    </button>
                </div>
            </form>
        </div>
    )
}
