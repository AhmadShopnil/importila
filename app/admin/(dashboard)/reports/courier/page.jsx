"use client"

import { useEffect, useState } from "react"
import { DollarSign, Archive, FileText, RefreshCcw } from "lucide-react"
import Loading from "@/components/Loader/Loading"
import { BASE_URL } from "@/utils/baseUrl"

export default function CourierReportsPage() {
    const [balance, setBalance] = useState(null)
    const [payments, setPayments] = useState([])
    const [returns, setReturns] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllReports()
    }, [])

    const fetchAllReports = async () => {
        setLoading(true)
        await Promise.all([
            fetchReport('balance', setBalance),
            fetchReport('payments', setPayments),
            fetchReport('returns', setReturns)
        ])
        setLoading(false)
    }

    const fetchReport = async (type, setter) => {
        try {
            const res = await fetch(`${BASE_URL}/api/courier/report?type=${type}`)
            const data = await res.json()
            if (res.ok) {
                // Adjust data structure based on API response
                if (type === 'balance') setter(data.current_balance)
                if (type === 'payments') setter(data.data || data || []) // Assuming pagination or array
                if (type === 'returns') setter(data.data || data || [])
            }
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1E556E]">Courier Reports</h2>
                    <p className="text-muted-foreground">Financials and return status from Steadfast</p>
                </div>
                <button
                    onClick={fetchAllReports}
                    className="p-2 bg-white border rounded shadow hover:bg-gray-50 text-[#1E556E]"
                    title="Refresh Data"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-700 rounded-full">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Current Balance</p>
                        <h3 className="text-2xl font-bold">৳ {balance !== null ? balance : "0"}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Payments Received</p>
                        <h3 className="text-2xl font-bold">{payments.length}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-700 rounded-full">
                        <Archive className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Return Requests</p>
                        <h3 className="text-2xl font-bold">{returns.length}</h3>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold">Recent Payments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Payment ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length > 0 ? payments.slice(0, 10).map((payment, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {/* Adjust keys based on actual API response, using common guesses from docs or standard Laravel/PHP API returns */}
                                        {payment.id || payment.invoice || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">{payment.created_at ? new Date(payment.created_at).toLocaleDateString() : "N/A"}</td>
                                    <td className="px-6 py-4 font-bold">৳ {payment.amount || payment.total_amount || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {payment.status || "Unknown"}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No payment history found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Returns Table */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold">Recent Return Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Consignment ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.length > 0 ? returns.slice(0, 10).map((ret, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{ret.consignment_id}</td>
                                    <td className="px-6 py-4">{ret.created_at ? new Date(ret.created_at).toLocaleDateString() : "N/A"}</td>
                                    <td className="px-6 py-4">{ret.reason || "N/A"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${ret.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {ret.status || "pending"}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No return requests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
