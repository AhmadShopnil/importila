// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { Plus, Search, Edit2, Trash2, Layout } from "lucide-react"
// import Loading from "@/components/Loader/Loading"
// import { BASE_URL } from "@/utils/baseUrl"
// import toast from "react-hot-toast"

// export default function SlidersPage() {
//     const [sliders, setSliders] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [searchTerm, setSearchTerm] = useState("")

//     useEffect(() => {
//         fetchSliders()
//     }, [])

//     const fetchSliders = async () => {
//         try {
//             const res = await fetch(`${BASE_URL}/api/sliders`)
//             const data = await res.json()
//             setSliders(data)
//         } catch (error) {
//             console.error("Failed to fetch sliders:", error)
//             toast.error("Failed to fetch sliders")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleDelete = async (id) => {
//         if (confirm("Are you sure you want to delete this slider?")) {
//             try {
//                 const res = await fetch(`${BASE_URL}/api/sliders/${id}`, { method: "DELETE" })
//                 if (res.ok) {
//                     setSliders(sliders.filter((s) => s._id !== id))
//                     toast.success("Slider deleted")
//                 } else {
//                     toast.error("Failed to delete slider")
//                 }
//             } catch (error) {
//                 console.error("Failed to delete slider:", error)
//                 toast.error("Error deleting slider")
//             }
//         }
//     }

//     const filteredSliders = sliders?.filter((s) =>
//         s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         s.location.toLowerCase().includes(searchTerm.toLowerCase())
//     ) || []

//     // if (loading) return <Loading />

//     return (
//         <div className="p-4 sm:p-6 lg:p-8">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                 <div>
//                     <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1E556E] to-[#3a8da3]">
//                         Sliders Management
//                     </h1>
//                     <p className="text-muted-foreground mt-1">Create and manage multiple sliders for different locations.</p>
//                 </div>
//                 <Link
//                     href="/admin/sliders/new"
//                     className="flex items-center gap-2 bg-[#1E556E] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95 w-full sm:w-auto justify-center"
//                 >
//                     <Plus className="w-5 h-5" />
//                     Add New Slider
//                 </Link>
//             </div>

//             <div className="mb-6">
//                 <div className="relative">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                     <input
//                         type="text"
//                         placeholder="Search sliders by name or location..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-card focus:ring-2 focus:ring-[#1E556E] outline-none transition-all shadow-sm"
//                     />
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredSliders?.map((slider) => (
//                     <div key={slider._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
//                         <div className="p-5">
//                             <div className="flex justify-between items-start mb-4">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                                         <Layout className="w-5 h-5" />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-lg group-hover:text-[#1E556E] transition-colors">{slider.name}</h3>
//                                         <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
//                                             {slider.location}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${slider.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                                     {slider.isActive ? 'Active' : 'Inactive'}
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
//                                 <span className="font-medium text-foreground">{slider.slides?.length || 0}</span> slides configured
//                             </div>

//                             <div className="flex gap-2">
//                                 <Link
//                                     href={`/admin/sliders/${slider._id}`}
//                                     className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground px-4 py-2.5 rounded-xl hover:bg-neutral-200 transition-colors text-sm font-medium"
//                                 >
//                                     <Edit2 className="w-4 h-4" />
//                                     Edit Slider
//                                 </Link>
//                                 <button
//                                     onClick={() => handleDelete(slider._id)}
//                                     className="flex items-center justify-center bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-colors"
//                                     title="Delete Slider"
//                                 >
//                                     <Trash2 className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {filteredSliders.length === 0 && (
//                 <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
//                     <Layout className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
//                     <h3 className="text-xl font-bold mb-2">No sliders found</h3>
//                     <p className="text-muted-foreground">
//                         {sliders.length === 0 ? "Create your first slider to get started!" : "No sliders match your search criteria."}
//                     </p>
//                     {sliders.length === 0 && (
//                         <Link
//                             href="/admin/sliders/new"
//                             className="inline-flex items-center gap-2 mt-6 bg-[#1E556E] text-white px-6 py-2 rounded-xl"
//                         >
//                             <Plus className="w-4 h-4" />
//                             Add First Slider
//                         </Link>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }
