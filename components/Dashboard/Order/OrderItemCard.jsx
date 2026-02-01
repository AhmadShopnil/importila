import React from 'react'

export default function OrderItemCard({ order,updatedStatuses,handleStatusChange,statuses }) {

    const localStatus = updatedStatuses[order?._id] || order?.status



    return (
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h3 className="font-semibold text-lg">Order Number :{order?.orderNumber}</h3>
                    <div className="mt-2">
                        <p className="text-base text-muted-foreground">
                            <span className="">Customer Name : </span>
                            {order?.customerName}
                        </p>
                        <p className="text-base text-muted-foreground">
                            <span className="">Customer Contact : </span>
                            {order?.phone}</p>
                        <p className="text-base text-muted-foreground">
                            <span className="">Customer Address : </span>
                            {order?.address}</p>
                        <p className="text-base text-muted-foreground">
                            <span className="">Note : </span>
                            {order?.note}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl">৳ {order?.totalPrice}</p>
                    <p className="text-sm text-muted-foreground">{order?.items.length} Designs</p>
                </div>
            </div>

            {/* Items */}
            <div className="bg-muted/30 rounded p-3 space-y-2">
                {order?.items?.map((item, idx) => (
                    <div key={idx} className="text-base">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                            SKU: {item.sku} -- ৳  {item.price} x {item.quantity} ={" "}
                            <span className="text-gray-800 font-bold">{item.price * item.quantity}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Status */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">Status</label>
                <select
                    value={localStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                    {statuses?.map((status) => (
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-border text-sm text-muted-foreground">
                <p>Phone: {order.customerPhone}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
        </div>
    )
}
