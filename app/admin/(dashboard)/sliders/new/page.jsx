"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import SliderForm from "@/components/Dashboard/Sliders/SliderForm"

export default function NewSliderPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData) => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/api/sliders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Slider created successfully")
                router.push("/admin/sliders")
            } else {
                toast.error(data.error || "Failed to create slider")
            }
        } catch (err) {
            console.error("Error creating slider:", err)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-2 ">
            <Link
                href="/admin/sliders"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1E556E] mb-8 group transition-colors"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Sliders
            </Link>

            <div className="mb-10">
                <h1 className="text-3xl font-bold">Add New Slider</h1>
                <p className="text-muted-foreground">Configure a new banner slider for your website.</p>
            </div>

            <SliderForm onSubmit={handleSubmit} loading={loading} />
        </div>
    )
}
