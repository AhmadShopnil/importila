"use client"

import { useEffect, useState } from "react"
import Loading from "@/components/Loader/Loading"
import Link from "next/link"

import { Truck, CheckSquare, Square, RefreshCw, Shield, ShieldAlert, ShieldCheck, List, LayoutGrid, Eye, MoreHorizontal, ExternalLink, Search, Filter, Printer, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import {
  useGetComboOrdersQuery,
  useUpdateOrderMutation,
  useLazyCheckFraudRiskQuery,
  useSendToCourierMutation,
  useLazyCheckCourierStatusQuery,
  useDeleteOrderMutation,
  useDeleteMultipleOrdersMutation
} from "@/lib/redux/api/orderApi"
import InvoicePrint from "@/components/Dashboard/Order/InvoicePrint"

export default function ComboOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("")
  const [updatedStatuses, setUpdatedStatuses] = useState({})
  const [saving, setSaving] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [riskData, setRiskData] = useState({})
  const [viewType, setViewType] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null)

  const { data: responseData, isLoading: loading, isFetching } = useGetComboOrdersQuery({
    status: selectedStatus,
    search: debouncedSearch,
    page: currentPage,
    limit: 15
  })

  const orders = responseData?.orders || []
  const totalPages = responseData?.pagination?.totalPages || 1
  const totalCount = responseData?.pagination?.totalCount || 0
  const globalStats = responseData?.summary || { totalRevenue: 0, totalItems: 0 }

  const [updateOrder] = useUpdateOrderMutation()
  const [checkFraudRisk] = useLazyCheckFraudRiskQuery()
  const [sendToCourier, { isLoading: sendingToCourier }] = useSendToCourierMutation()
  const [checkCourierStatus] = useLazyCheckCourierStatusQuery()
  const [deleteOrder] = useDeleteOrderMutation()
  const [deleteMultipleOrders, { isLoading: deletingMultiple }] = useDeleteMultipleOrdersMutation()

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset local state when filters change
  useEffect(() => {
    setUpdatedStatuses({})
    setSelectedOrders([])
  }, [selectedStatus, debouncedSearch, currentPage])

  const handleCheckRisk = async (phone) => {
    if (riskData[phone]) return
    const toastId = toast.loading("Analyzing risk...")
    try {
      const data = await checkFraudRisk(phone).unwrap()
      setRiskData(prev => ({ ...prev, [phone]: data }))
      toast.dismiss(toastId)
      if (data?.riskLevel === 'High') toast.error(`High Risk! ${data.cancelled + data.returned}/${data.totalOrders}`)
      else if (data?.riskLevel === 'Medium') toast("Medium Risk", { icon: '⚠️' })
      else toast.success("Low Risk")
    } catch (error) {
      toast.error("Error checking risk", { id: toastId })
    }
  }

  const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

  const totalRevenue = globalStats.totalRevenue
  const totalOrders = totalCount
  const totalItems = globalStats.totalItems

  const handleStatusChange = (orderId, newStatus) => {
    setUpdatedStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }))
  }

  const handleSaveChanges = async () => {
    if (saving || Object.keys(updatedStatuses).length === 0) return
    setSaving(true)

    let successCount = 0
    let failCount = 0

    for (const [orderId, newStatus] of Object.entries(updatedStatuses)) {
      try {
        await updateOrder({ id: orderId, status: newStatus }).unwrap()
        successCount++
      } catch (error) {
        console.error(error)
        failCount++
      }
    }

    toast.success(`${successCount} orders updated`)
    setSaving(false)
    setUpdatedStatuses({})
  }

  const handleBulkStatusChange = async (newStatus) => {
    const confirmUpdate = window.confirm(`Update ${selectedOrders.length} orders to ${newStatus}?`)
    if (!confirmUpdate) return

    setSaving(true)
    const toastId = toast.loading("Updating status...")
    let successCount = 0
    let failCount = 0

    for (const orderId of selectedOrders) {
      try {
        await updateOrder({ id: orderId, status: newStatus }).unwrap()
        successCount++
      } catch (error) {
        failCount++
      }
    }

    toast.success(`Updated ${successCount} orders.`, { id: toastId })
    setSaving(false)
    setSelectedOrders([])
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o._id))
    }
  }

  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    } else {
      setSelectedOrders(prev => [...prev, orderId])
    }
  }

  const handleSendToCourier = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order")
      return
    }

    try {
      const selectedOrderDetails = orders
        .filter(o => selectedOrders.includes(o._id))
        .map(order => ({
          invoice: order?.orderNumber,
          recipient_name: order.customerName,
          recipient_address: order.address,
          recipient_phone: order.phone,
          cod_amount: order.paymentStatus === 'paid' ? 0 : (order?.totalAmount || order?.price),
          note: order.note || " "
        }))

      await sendToCourier({
        orders: selectedOrderDetails,
        isBulk: selectedOrderDetails.length > 1
      }).unwrap()

      toast.success("Orders sent to courier!")
      setSelectedOrders([])
    } catch (error) {
      toast.error(error.data?.error || "An error occurred")
    }
  }

  const handleCheckStatus = async (consignmentId) => {
    const toastId = toast.loading("Checking status...")
    try {
      const data = await checkCourierStatus(consignmentId).unwrap()
      if (data?.status === 200) {
        toast.success(`Status: ${data?.delivery_status}`, { id: toastId })
      } else {
        toast.error("Failed to check status", { id: toastId })
      }
    } catch (error) {
      toast.error("Error checking status", { id: toastId })
    }
  }

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return
    try {
      await deleteOrder(id).unwrap()
      toast.success("Order deleted successfully")
    } catch (error) {
      toast.error("Failed to delete order")
    }
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) return
    try {
      await deleteMultipleOrders(selectedOrders).unwrap()
      toast.success(`${selectedOrders.length} orders deleted successfully`)
      setSelectedOrders([])
    } catch (error) {
      toast.error("Failed to delete orders")
    }
  }


  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E556E]">Combo Orders</h1>

        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewType("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewType === "list" ? "bg-white text-[#1E556E] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">List View</span>
          </button>
          <button
            onClick={() => setViewType("card")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewType === "card" ? "bg-white text-[#1E556E] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-sm font-medium">Card View</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-1 border-green-500 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">৳ {globalStats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white border-1 border-blue-500 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
        </div>

        <div className="bg-white border-1 border-orange-500 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Items Sold</p>
          <p className="text-2xl font-bold text-gray-800">{globalStats.totalItems}</p>
        </div>

        <div className="bg-white border-1 border-purple-500 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold text-gray-800">৳ {totalCount > 0 ? Math.round(globalStats.totalRevenue / totalCount).toLocaleString() : 0}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Name or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E556E]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 overflow-x-auto bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button
                onClick={() => setSelectedStatus("")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${selectedStatus === "" ? "bg-[#1E556E] text-white" : "text-gray-600 hover:bg-gray-200"}`}
              >
                ALL
              </button>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all whitespace-nowrap ${selectedStatus === status ? "bg-[#1E556E] text-white" : "text-gray-600 hover:bg-gray-200"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <button onClick={handleSelectAll} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-muted font-medium transition-colors text-sm">
              {orders.length > 0 && selectedOrders.length === orders.length ? <CheckSquare className="w-4 h-4 text-[#1E556E]" /> : <Square className="w-4 h-4 text-gray-400" />}
              {selectedOrders.length > 0 ? `Selected (${selectedOrders.length})` : "Select All"}
            </button>

            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendToCourier}
                  disabled={sendingToCourier}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1E556E] text-white rounded hover:bg-[#1E556E]/90 transition-all text-sm font-medium disabled:opacity-70"
                >
                  <Truck className="w-4 h-4" />
                  Send to Courier
                </button>

                <select
                  onChange={(e) => handleBulkStatusChange(e.target.value)}
                  className="px-3 py-2 border rounded hover:bg-muted font-medium bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E556E]"
                  defaultValue=""
                >
                  <option value="" disabled>Change Status</option>
                  {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>

                <button
                  onClick={handleBulkDelete}
                  disabled={deletingMultiple}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all text-sm font-medium disabled:opacity-70 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingMultiple ? "Deleting..." : `Delete Selected`}
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 italic">
            Total {totalCount} combo orders
          </div>
        </div>
      </div>


      {viewType === "list" ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 w-10"></th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Order Info</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Customer</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Items</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Amount</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Courier Info</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const localStatus = updatedStatuses[order?._id] || order?.status
                  const risk = riskData[order.phone]

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="p-4">
                        <button onClick={() => toggleSelectOrder(order._id)} className="transition-transform active:scale-90">
                          {selectedOrders.includes(order._id) ? <CheckSquare className="w-5 h-5 text-[#1E556E]" /> : <Square className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />}
                        </button>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/orders/combos/${order._id}`} className="font-bold text-[#1E556E] hover:underline flex items-center gap-1 group/link">
                          {order.orderNumber}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                        <div className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{order.customerName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-gray-500 text-xs">{order.phone}</span>
                          <button onClick={() => handleCheckRisk(order.phone)} className="p-0.5 hover:bg-gray-200 rounded">
                            {!risk ? <Shield className="w-3.5 h-3.5 text-gray-400" /> : <ShieldAlert className={`w-3.5 h-3.5 ${risk.riskLevel === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          <span className="font-medium text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                            {(order.items?.length || order.products?.length || 1)} Items
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900 font-bold font-mono">
                        ৳ {(order?.totalAmount || order.totalPrice || order.offerPrice || order.price).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={localStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded border-none focus:ring-0 cursor-pointer min-w-[100px] bg-opacity-10
                            ${localStatus === 'pending' ? 'bg-yellow-500 text-yellow-700' :
                              localStatus === 'confirmed' ? 'bg-blue-500 text-blue-700' :
                                localStatus === 'shipped' ? 'bg-indigo-500 text-indigo-700' :
                                  localStatus === 'delivered' ? 'bg-green-500 text-green-700' : 'bg-red-500 text-red-700'}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status} className="bg-white text-gray-800">{status.toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        {order.courierConsignmentId ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-[10px] text-gray-400">Steadfast:</span>
                              <span className="text-[10px] font-mono border-b border-dashed border-gray-300">{order.courierConsignmentId}</span>
                              <button onClick={() => handleCheckStatus(order.courierConsignmentId)} className="hover:scale-110">
                                <RefreshCw className="w-3 h-3 text-blue-500" />
                              </button>
                            </div>
                            {order.courierStatus && <div className="text-[10px] uppercase font-black text-[#1E556E]">{order.courierStatus}</div>}
                          </div>
                        ) : <span className="text-[10px] text-gray-400 italic">Not Shipped</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrderForInvoice(order);
                              setTimeout(() => window.print(), 100);
                            }}
                            className="p-2 hover:bg-blue-50 rounded bg-blue-50/50 text-blue-600 transition-all"
                            title="Print Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <Link href={`/admin/orders/combos/${order._id}`} className="p-2 hover:bg-[#1E556E]/10 rounded bg-[#1E556E]/5 text-[#1E556E]" title="View Details">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 hover:bg-red-50 rounded text-red-600 transition-all bg-red-50/50"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <div className="text-center py-12 text-gray-400 italic">No combo orders found</div>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders?.map((order) => {
            const localStatus = updatedStatuses[order?._id] || order?.status
            return (
              <div key={order?._id} className="relative group border border-gray-100 bg-white rounded-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                <div className={`h-1.5 w-full ${localStatus === 'pending' ? 'bg-yellow-400' : localStatus === 'confirmed' ? 'bg-blue-400' : localStatus === 'shipped' ? 'bg-indigo-400' : localStatus === 'delivered' ? 'bg-green-400' : 'bg-red-400'}`} />
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleSelectOrder(order._id)} className="mt-1 transition-transform active:scale-90">
                        {selectedOrders.includes(order._id) ? <CheckSquare className="w-5 h-5 text-[#1E556E]" /> : <Square className="w-5 h-5 text-gray-300" />}
                      </button>
                      <div>
                        <Link href={`/admin/orders/combos/${order._id}`} className="font-bold text-lg text-gray-900 group-hover:text-[#1E556E] flex items-center gap-2">
                          #{order?.orderNumber}
                          <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="font-black text-xl text-gray-900 font-mono">৳ {(order?.totalAmount || order.totalPrice || order.offerPrice || order.price).toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</span>
                      <p className="font-semibold text-gray-800">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{order.address}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Order Status</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{(order.items?.length || order.products?.length || 1)} Items</span>
                    </div>
                    <select
                      value={localStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-800 text-sm font-bold focus:ring-2 focus:ring-[#1E556E]/10"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {order?.courierConsignmentId && (
                  <div className="bg-[#1E556E]/5 px-5 py-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#1E556E]">
                        <Truck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Steadfast Courier</span>
                      </div>
                      <button onClick={() => handleCheckStatus(order.courierConsignmentId)} className="p-1 hover:bg-white rounded-full transition-all shadow-sm">
                        <RefreshCw className="w-3.5 h-3.5 text-[#1E556E]" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedOrderForInvoice(order);
                      setTimeout(() => window.print(), 100);
                    }}
                    className="p-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <Link href={`/admin/orders/combos/${order._id}`} className="p-2 bg-white rounded-full shadow-lg text-[#1E556E] hover:bg-[#1E556E] hover:text-white transition-all">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-2 bg-white rounded-full shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-800">{orders.length > 0 ? (currentPage - 1) * 20 + 1 : 0}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * 20, totalCount)}</span> of <span className="font-bold text-gray-800">{totalCount}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${currentPage === pageNum ? "bg-[#1E556E] text-white shadow-md shadow-[#1E556E]/20" : "hover:bg-gray-100 text-gray-600"}`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>


      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${Object.keys(updatedStatuses).length > 0 ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="bg-[#1E556E] text-white px-8 py-4 rounded-full shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 font-bold group"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckSquare className="w-5 h-5 group-hover:scale-110" />}
          <span>{saving ? "Saving..." : `Save ${Object.keys(updatedStatuses).length} changes`}</span>
        </button>
      </div>
      <InvoicePrint order={selectedOrderForInvoice} />
    </div>
  )
}
