"use client"

import { useEffect, useState } from "react"
import { Calendar, TrendingUp, Package, DollarSign, ArrowLeft } from "lucide-react"
import Loading from "@/components/Loader/Loading"
import { BASE_URL } from "@/utils/baseUrl"
import Link from "next/link"
import Image from "next/image"

export default function BestSellingReportPage() {
    const [report, setReport] = useState([])
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10)
    })

    useEffect(() => {
        fetchReport()
    }, [dateRange])

    const fetchReport = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/api/reports/best-selling?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)
            const data = await res.json()
            setReport(data.report || [])
        } catch (error) {
            console.error("Failed to fetch report:", error)
        } finally {
            setLoading(false)
        }
    }

    const totalSold = report.reduce((sum, item) => sum + item.totalSold, 0)
    const totalRevenue = report.reduce((sum, item) => sum + item.totalRevenue, 0)
    const totalProfit = report.reduce((sum, item) => sum + (item.totalProfit || 0), 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/reports" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1E556E]" />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1E556E]">Best Selling Report</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 shadow-sm">
                    <Calendar className="w-5 h-5 text-muted-foreground mr-1" />
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="bg-transparent text-sm focus:outline-none font-medium"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="bg-transparent text-sm focus:outline-none font-medium"
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Qty Sold</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{totalSold}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Total Sales</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-900">৳ {totalRevenue.toLocaleString()}</p>
                </div>

                {/* <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-500 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Total Profit</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-900">৳ {totalProfit.toLocaleString()}</p>
                </div> */}

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Top Product</p>
                    </div>
                    <p className="text-xl font-bold text-purple-900 truncate" title={report[0]?.name}>
                        {report[0]?.name || "N/A"}
                    </p>
                </div>
            </div>

            {/* Report Table */}
            <div className="bg-white rounded-xl border border-border shadow-md overflow-hidden">
                <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-center">
                    <h2 className="font-bold text-xl text-[#1E556E]">Performance Breakdown</h2>
                    <span className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border border-border">
                        Total {report.length} unique products
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#1E556E] text-white uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 text-center font-bold w-16">Rank</th>
                                <th className="px-6 py-4 text-left font-bold">Product Information</th>
                                <th className="px-6 py-4 text-center font-bold">Quantity Sold</th>
                                <th className="px-6 py-4 text-right font-bold">Revenue</th>
                                {/* <th className="px-6 py-4 text-right font-bold pr-12">Profit</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : report.length > 0 ? (
                                report.map((item, idx) => (
                                    <tr key={item._id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' :
                                                idx === 1 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-400' :
                                                    idx === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-400' :
                                                        'bg-blue-50 text-blue-600'
                                                }`}>
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border group-hover:border-blue-300 transition-colors bg-muted flex-shrink-0">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted text-xs">
                                                            IMG
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base text-[#1E556E] group-hover:text-blue-600 transition-colors line-clamp-1">{item.name}</p>
                                                    {item.designName && <p className="text-xs font-semibold text-muted-foreground italic mb-0.5">{item.designName}</p>}
                                                    <p className="text-[10px] text-muted-foreground font-mono">ID: {item._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-bold text-lg">
                                                {item.totalSold}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-bold text-lg text-emerald-700">৳ {item.totalRevenue.toLocaleString()}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Sales</p>
                                        </td>
                                        {/* <td className="px-6 py-4 text-right pr-12">
                                            <p className="font-bold text-lg text-orange-600">৳ {(item.totalProfit || 0).toLocaleString()}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Net Profit</p>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="w-12 h-12 text-muted-foreground opacity-20" />
                                            <p className="text-muted-foreground text-lg">No sales data found for the selected period.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
