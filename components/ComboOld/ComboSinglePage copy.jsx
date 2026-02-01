// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import Container from "@/components/Container";
// import { BASE_URL } from "@/utils/baseUrl";

// export default function ComboSinglePage({ combo }) {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     customerName: "",
//     phone: "",
//     address: "",
//     note: "",
//   });

//   const handlePlaceOrder = async () => {
//     if (!form.customerName || !form.phone || !form.address) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`${BASE_URL}/api/orders/combo`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           orderType: "combo",
//           combo: combo,
//           customer: form,
//         }),
//       });

//       if (!res.ok) throw new Error("Order failed");

//       const data = await res.json();
//       toast.success(`Order placed! ID: ${data.orderNumber}`);
//       setShowModal(false);

//       setForm({ customerName: "", phone: "", address: "", note: "" });
//     } catch {
//       toast.error("Failed to place order");
//     } finally {
//       setLoading(false);
//     }
//   };



//   return (
//     <>
//       <main className="text-slate-800 overflow-hidden">
//         {/* ---------------- HERO ---------------- */}
//         <section className="relative py-32 bg-gradient-to-br from-indigo-50 via-sky-50 to-pink-50">
//           <Container className="grid lg:grid-cols-2 gap-20 items-center">
//             <div className="space-y-6">
//               <h1
//                 className="text-5xl lg:text-6xl font-extrabold leading-tight
//               text-[#1E556D]  "
//               >
//                 {combo?.title}
//               </h1>

//               <p className="text-lg text-slate-600 max-w-lg">
//                 {combo?.description}
//               </p>

//               <button
//                 onClick={() => setShowModal(true)}
//                 className="cursor-pointer bg-[#1E556D] text-white px-6 py-3 rounded-sm text-lg font-semibold hover:opacity-90
//                 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
//               >
//                 Place Order →
//               </button>
//             </div>

//             <div className="relative h-[620px] rounded-sm overflow-hidden shadow-2xl">
//               <Image
//                 src={combo?.featuredImage}
//                 alt={combo?.title}
//                 fill
//                 priority
//                 className="object-cover hover:scale-105 transition-transform duration-500"
//               />
//             </div>
//           </Container>
//         </section>

//         {/* Items */}
//         <section className="py-4 lg:py-20 bg-linear-to-b from-white to-slate-50">
//           <Container>
//             {/* Section Header */}
//             <div className="text-center mb-16">
//               <h2
//                 className="text-4xl md:text-5xl font-extrabold text-[#1E556D]"
//               >
//                 What’s Inside This Combo
//               </h2>


//               <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
//                 Carefully selected essentials designed for comfort, durability,
//                 and everyday happiness.
//               </p>
//             </div>

//             {/* Products Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
//               {combo?.products?.map((product) => (
//                 <div
//                   key={product.id}
//                   className="group relative p-2    bg-white/80 backdrop-blur  border border-slate-200  shadow-lg 
//                   hover:shadow-2xl transition-all"

//                 >
//                   {/* Soft hover glow */}
//                   <div
//                     className="absolute inset-0   bg-gradient-to-br from-indigo-100/40 to-pink-100/40  
//                     opacity-0 group-hover:opacity-100 transition"
//                   />

//                   <div className="relative space-y-6">
//                     {/* Image */}
//                     <div className="relative w-full aspect-[2/3]  overflow-hidden">
//                       <Image
//                         src={product?.featuredImage}
//                         alt={product?.name}
//                         fill
//                         className="object-cover "
//                       />
//                     </div>

//                     {/* Content */}
//                     <div className="space-y-3 p-2 md:p-4">
//                       <h3 className="text-2xl font-bold text-slate-800">
//                         {product.name}
//                       </h3>

//                       <p className="text-slate-600 leading-relaxed">
//                         {product.description}
//                       </p>

//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Container>
//         </section>

//         {/* ---------------- PLACE ORDER SECTION ---------------- */}
//         <section className="py-24 bg-gradient-to-br from-sky-50 to-indigo-50">
//           <Container>
//             <div className=" bg-white shadow-2xl border border-slate-200 p-8 lg:p-12 space-y-10">

//               {/* Header */}
//               <div className="text-center space-y-4">
//                 <h2 className="text-4xl font-extrabold text-[#1E556D]">
//                   Everyday Comfort for Happy Kids
//                 </h2>
//                 <p className="text-lg text-slate-600">
//                   Limited stock available — order now for fast delivery.
//                 </p>
//               </div>

//               {/* Form */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 <input
//                   placeholder="Customer Name *"
//                   className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1E556D]"
//                   value={form.customerName}
//                   onChange={(e) =>
//                     setForm({ ...form, customerName: e.target.value })
//                   }
//                 />

//                 <input
//                   placeholder="Phone Number *"
//                   className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1E556D]"
//                   value={form.phone}
//                   onChange={(e) =>
//                     setForm({ ...form, phone: e.target.value })
//                   }
//                 />

//                 <textarea
//                   placeholder="Delivery Address *"
//                   className="md:col-span-2 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1E556D]"
//                   rows={3}
//                   value={form.address}
//                   onChange={(e) =>
//                     setForm({ ...form, address: e.target.value })
//                   }
//                 />

//                 <textarea
//                   placeholder="Note (optional)"
//                   className="md:col-span-2 w-full border rounded-lg px-4 py-3"
//                   rows={2}
//                   value={form.note}
//                   onChange={(e) =>
//                     setForm({ ...form, note: e.target.value })
//                   }
//                 />
//               </div>

//               {/* Submit */}
//               <div className="text-center">
//                 <button
//                   onClick={handlePlaceOrder}
//                   disabled={loading}
//                   className="px-12 py-4 text-lg font-semibold
//           bg-[#1E556D] text-white rounded-md
//           hover:opacity-90 transition-all shadow-lg"
//                 >
//                   {loading ? "Placing Order..." : "Place Order"}
//                 </button>
//               </div>

//             </div>
//           </Container>
//         </section>

//       </main>


//     </>
//   );
// }
