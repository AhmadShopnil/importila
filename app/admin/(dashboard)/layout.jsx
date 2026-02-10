// app/admin/AdminLayout.jsx
import { redirect } from "next/navigation"
import { getAdminAuth } from "@/lib/auth"
import AdminSidebarClient from "@/components/Dashboard/AdminSidebarClient"
import AdminSidebarClientResposive from "@/components/Dashboard/AdminSidebarClientResposive"


export default async function AdminLayout({ children }) {
  const admin = await getAdminAuth()
  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* Sidebar is client component */}
      <AdminSidebarClientResposive />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
