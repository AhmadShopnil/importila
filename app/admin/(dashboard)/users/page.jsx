"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Pencil, Trash2, Key, Shield, User as UserIcon } from "lucide-react"
import toast from "react-hot-toast"

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        role: "admin"
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users")
            const data = await res.json()
            if (res.ok) {
                setUsers(data)
            } else {
                toast.error(data.error || "Failed to fetch users")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const method = editingUser ? "PUT" : "POST"
        const url = editingUser ? `/api/admin/users/${editingUser._id}` : "/api/admin/users"

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (res.ok) {
                toast.success(data.message)
                setIsModalOpen(false)
                setEditingUser(null)
                setFormData({ name: "", username: "", password: "", role: "admin" })
                fetchUsers()
            } else {
                toast.error(data.error || "Something went wrong")
            }
        } catch (error) {
            toast.error("Failed to save user")
        }
    }

    const handleEdit = (user) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            username: user.username,
            password: "", // Leave blank for password reset
            role: user.role
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
            const data = await res.json()

            if (res.ok) {
                toast.success(data.message)
                fetchUsers()
            } else {
                toast.error(data.error || "Failed to delete user")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-[#1E556E]">
                        <Users className="w-8 h-8" />
                        User Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage admin access and roles</p>
                </div>
                <button
                    onClick={() => {
                        setEditingUser(null)
                        setFormData({ name: "", username: "", password: "", role: "admin" })
                        setIsModalOpen(true)
                    }}
                    className="bg-[#1E556E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add New User
                </button>
            </div>

            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-[#1E556E] text-white">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Username</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Created At</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#1E556E] border-t-transparent rounded-full animate-spin"></div>
                                            Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#1E556E]">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{user.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {user.role === 'super_admin' ? 'Super Admin' :
                                                    user.role === 'admin' ? 'Admin' : 'Manager'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit User"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#1E556E] p-6 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {editingUser ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {editingUser ? "Edit User" : "Add New User"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:opacity-70">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E556E] focus:border-transparent outline-none transition"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        disabled={editingUser}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E556E] focus:border-transparent outline-none transition disabled:bg-gray-100"
                                        placeholder="johndoe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E556E] focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                        required={!editingUser}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E556E] focus:border-transparent outline-none transition"
                                        required
                                    >
                                        <option value="super_admin">Super Admin</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#1E556E] text-white rounded-lg hover:bg-opacity-90 transition font-semibold shadow-md"
                                >
                                    {editingUser ? "Update User" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function X({ className, onClick }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            onClick={onClick}
        >
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    )
}
