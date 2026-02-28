"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { BASE_URL } from "@/utils/baseUrl"
import SliderForm from "@/components/Dashboard/Sliders/SliderForm"
import Loading from "@/components/Loader/Loading"

export default function EditSliderPage() {
    const router = useRouter()
    const { id } = useParams()
    const [slider, setSlider] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSlider()
    }, [id])

    const fetchSlider = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/sliders/${id}`)
            if (res.ok) {
                const data = await res.json()
                setSlider(data)
            } else {
                toast.error("Slider not found")
                router.push("/admin/sliders")
            }
        } catch (error) {
            console.error("Failed to fetch slider:", error)
            toast.error("Error fetching slider")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (formData) => {
        setSaving(true)
        try {
            const res = await fetch(`${BASE_URL}/api/sliders/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Slider updated successfully")
                router.push("/admin/sliders")
            } else {
                toast.error(data.error || "Failed to update slider")
            }
        } catch (err) {
            console.error("Error updating slider:", err)
            toast.error("Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4 ">
            <Link
                href="/admin/sliders"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1E556E] mb-8 group transition-colors"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Sliders
            </Link>

            <div className="mb-10">
                <h1 className="text-3xl font-bold">Edit Slider</h1>
                <p className="text-muted-foreground">Modify the settings and slides for {slider?.name}.</p>
            </div>

            <SliderForm initialData={slider} onSubmit={handleSubmit} loading={saving} />
        </div>
    )
}
