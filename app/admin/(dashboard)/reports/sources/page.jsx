"use client"

import { useEffect, useState } from "react"
import { Calendar, PieChart, TrendingUp, ShoppingBag, DollarSign } from "lucide-react"

import { BASE_URL } from "@/utils/baseUrl"
import Loading from "@/components/Loader/Loading"

const sourceColors = {
    website: "bg-blue-500",
    facebook: "bg-indigo-600",
    whatsapp: "bg-green-500",
    call: "bg-orange-500",
    wholesale: "bg-purple-500",
    other: "bg-gray-500",
}

export default function SourceAnalysisPage() {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7))

    useEffect(() => {
        fetchSourceReport()
    }, [monthYear])

    const fetchSourceReport = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/reports/sources?month=${monthYear}`)
            const data = await res.json()
            setStats(data.sourceStats || [])
        } catch (error) {
            console.error("Failed to fetch source report:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />

    const totalRevenue = stats.reduce((sum, item) => sum + item.totalRevenue, 0)
    const totalOrders = stats.reduce((sum, item) => sum + item.totalOrders, 0)

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E556E]">Order Source Analysis</h1>
                    <p className="text-muted-foreground">Track which channels are driving your sales</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2 shadow-sm">
                    <Calendar className="w-5 h-5 text-[#1E556E]" />
                    <input
                        type="month"
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)}
                        className="bg-transparent text-foreground focus:outline-none font-medium"
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-100 rounded-full">
                        <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Revenue</p>
                        <p className="text-3xl font-bold">৳ {totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Orders</p>
                        <p className="text-3xl font-bold">{totalOrders}</p>
                    </div>
                </div>
            </div>

            {/* Source Breakdown Table */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#1E556E]" />
                    <h2 className="text-xl font-semibold">Revenue by Source</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold">Source</th>
                                <th className="px-6 py-4 text-left font-bold">Orders</th>
                                <th className="px-6 py-4 text-left font-bold">Items Sold</th>
                                <th className="px-6 py-4 text-left font-bold">Revenue</th>
                                <th className="px-6 py-4 text-left font-bold">Contribution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {stats.map((item, idx) => {
                                const percentage = totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0
                                return (
                                    <tr key={idx} className="hover:bg-muted/30 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${sourceColors[item.source] || "bg-gray-400"}`} />
                                                <span className="capitalize font-medium">{item.source}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{item.totalOrders}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{item.totalItems}</td>
                                        <td className="px-6 py-4 font-bold text-[#1E556E]">৳ {item.totalRevenue.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="flex-1 bg-muted rounded-full h-2 min-w-[100px]">
                                                    <div
                                                        className={`h-full rounded-full ${sourceColors[item.source] || "bg-gray-400"}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold w-10">{percentage.toFixed(1)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {stats.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No data available for the selected month</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
