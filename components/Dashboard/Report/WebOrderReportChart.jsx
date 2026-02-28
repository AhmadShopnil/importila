"use client"

import { useMemo } from "react"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts"

const STATUS_COLORS = {
    pending: "#F59E0B",
    processing: "#F59E0B",
    delivered: "#10B981",
    shipped: "#3B82F6",
    cancelled: "#EF4444",
    returned: "#6B7280",
    incomplete: "#9CA3AF",
    confirmed: "#4d865cff",
    call: "#F59E0B",
    website: "#6B7280",
    whatsapp: "#10B981",

}

const STATUS_LABELS = {
    pending: "Pending",
    processing: "Processing",
    delivered: "Delivered",
    shipped: "Shipped",
    cancelled: "Cancelled",
    returned: "Returned",
    incomplete: "Incomplete",
    confirmed: "Confirmed",
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export default function WebOrderReportChart({
    title,
    data = [],
    totalOrders = 0,
    currentFilter = "all",
    currentMonth = 1,
    currentYear = 2026,
    onFilterChange,
    onMonthChange,
    onYearChange
}) {

    const pieData = useMemo(() => {
        return data?.map(item => ({
            name: STATUS_LABELS[item._id] || item._id,
            value: item.count,
            color: STATUS_COLORS[item._id] || "#3B82F6"
        }))
    }, [data])
    // console.log("data", data)

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                    {title}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Today/Yesterday/30D/All */}
                    <div className="flex bg-gray-50 p-1 rounded-lg">
                        {[
                            { id: "today", label: "Today" },
                            { id: "yesterday", label: "Yesterday" },
                            { id: "7d", label: "7D" },
                            { id: "30d", label: "30D" },
                            { id: "all", label: "All" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onFilterChange(tab.id)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentFilter === tab.id
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-[1px] bg-gray-200 hidden md:block mx-1"></div>

                    {/* Month/Year Selection */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onFilterChange("month")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentFilter === "month"
                                ? "bg-teal-600 text-white shadow-sm"
                                : "bg-gray-50 text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Month View
                        </button>
                        <select
                            value={currentMonth}
                            onChange={(e) => {
                                onMonthChange(Number(e.target.value))
                                onFilterChange("month")
                            }}
                            className="bg-gray-50 border-none text-xs font-semibold rounded-lg px-2 py-1.5 text-gray-600 focus:ring-0 cursor-pointer"
                        >
                            {MONTHS.map((m, i) => (
                                <option key={m} value={i + 1}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={currentYear}
                            onChange={(e) => {
                                onYearChange(Number(e.target.value))
                                onFilterChange("month")
                            }}
                            className="bg-gray-50 border-none text-xs font-semibold rounded-lg px-2 py-1.5 text-gray-600 focus:ring-0 cursor-pointer"
                        >
                            {[2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[280px]">
                {/* Chart */}
                <div className="relative h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {pieData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry?.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-col justify-center space-y-4">
                    {pieData?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item?.color }}
                                />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {item?.name}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                                ({item?.value})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-center">
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Orders</p>
                    <p className="text-2xl font-black text-gray-900">{totalOrders}</p>
                </div>
            </div>
        </div>
    )
}
