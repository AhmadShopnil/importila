"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react"
import toast from "react-hot-toast"

export default function AdminLoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Welcome back, Admin!")
                router.push("/admin")
                router.refresh()
            } else {
                toast.error(data.error || "Login failed")
            }
        } catch (error) {
            toast.error("An error occurred during login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <div className="w-full max-w-[440px]">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1E556E] text-white rounded-2xl shadow-xl shadow-[#1E556E]/20 mb-4 transition-transform hover:scale-110 duration-300">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kids Shop Admin</h1>
                    <p className="text-slate-500 mt-2 font-medium">Enter your credentials to manage the store</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E556E] transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#1E556E]/10 focus:border-[#1E556E] focus:bg-white transition-all text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E556E] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#1E556E]/10 focus:border-[#1E556E] focus:bg-white transition-all text-slate-800"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1E556E] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-[#1E556E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In to Dashboard"
                            )}
                        </button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-xs font-medium">
                            SECURED ACCESS ONLY. UNAUTHORIZED ATTEMPTS ARE LOGGED.
                        </p>
                    </div>
                </div>

                {/* Footer Link */}
                <p className="text-center mt-8 text-slate-500 font-medium">
                    <a href="/" className="hover:text-[#1E556E] transition-colors">Back to storefront</a>
                </p>
            </div>
        </div>
    )
}
