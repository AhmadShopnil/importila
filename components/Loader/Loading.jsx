"use client"

import React from "react"

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-20">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-t-primary border-b-primary border-gray-300 rounded-full animate-spin mb-4" />
      
      {/* Message */}
      <p className="text-gray-600 text-sm sm:text-base">{message}</p>
    </div>
  )
}
