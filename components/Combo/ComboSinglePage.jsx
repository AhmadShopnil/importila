"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import { BASE_URL } from "@/utils/baseUrl";

const DELIVERY_CHARGE = {
  dhaka: 100,
  outside: 200,
};

export default function ComboSinglePage({ combo }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
    size: "",
    // deliveryArea: "",
  });

  const deliveryCharge = useMemo(() => {
    return DELIVERY_CHARGE[form.deliveryArea] || 0;
  }, [form.deliveryArea]);

  const handlePlaceOrder = async () => {
    if (
      !form.customerName ||
      !form.phone ||
      !form.address ||
      !form.size
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const orderPayload = {
      productType: "combo",
      ...combo,
      ...form,
      // deliveryCharge,
    }



    try {
      setLoading(true);
      
      console.log("order data", orderPayload)

      const res = await fetch(`${BASE_URL}/api/orders/combo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Order failed");

      const data = await res.json();
      toast.success(`Order placed! ID: ${data?.orderNumber}`);

      // setForm({
      //   customerName: "",
      //   phone: "",
      //   address: "",
      //   note: "",
      //   size: "",
      //   deliveryArea: "",
      // });
    } catch {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="text-slate-800 overflow-hidden">

      <section className="relative py-10 md:py-20 bg-gradient-to-br from-indigo-50 via-sky-50 to-pink-50">
        <Container className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="space-y-2 ">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E556D]">
              {combo?.title}
            </h1>

            <p className="text-sm md:text-lg text-slate-600 max-w-lg">
              {combo?.description}
            </p>
          </div>

          <div className="relative h-[360px] md:h-[560px] rounded-sm overflow-hidden shadow-xl">
            <Image
              src={combo?.featuredImage}
              alt={combo?.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* ---------------- ITEMS ---------------- */}
      <section className="py-6 md:py-20 bg-slate-50">
        <Container>
          <div className="text-center mb-4 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#1E556D]">
              What’s Inside This Combo
            </h2>
            <p className="mt-2 text-sm md:text-lg text-slate-600">
              Carefully selected essentials for everyday comfort
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {combo?.products?.map((product) => (
              <div
                key={product.id}
                className="bg-white border shadow-sm hover:shadow-md transition"
              >
                <div className="relative w-full aspect-[2/3]">
                  <Image
                    src={product?.featuredImage}
                    alt={product?.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-3 space-y-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-slate-600">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- PLACE ORDER ---------------- */}
      <section className="py-16 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xs">
        <Container>
          <div className="bg-white border shadow-xl p-6 md:p-10 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#1E556D]">
                Place Your Order
              </h2>
              <p className="text-sm md:text-lg text-slate-600 mt-2">
                Fast delivery & limited stock
              </p>
            </div>

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Customer Name *"
                className="border px-4 py-3 text-sm md:text-base"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />

              <input
                placeholder="Phone Number *"
                className="border px-4 py-3 text-sm md:text-base"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              {/* SIZE */}
              <select
                className="md:col-span-2 border px-4 py-3 text-sm md:text-base"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              >
                <option value="">Select Size *</option>
                {combo?.sizes?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              {/* DELIVERY AREA */}
              {/* <select
                className="border px-4 py-3 text-sm md:text-base"
                value={form.deliveryArea}
                onChange={(e) =>
                  setForm({ ...form, deliveryArea: e.target.value })
                }
              >
                <option value="">Delivery Area *</option>
                <option value="dhaka">Inside Dhaka (৳100)</option>
                <option value="outside">Outside Dhaka (৳200)</option>
              </select> */}

              <textarea
                placeholder="Delivery Address *"
                className="md:col-span-2 border px-4 py-3 text-sm md:text-base"
                rows={3}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <textarea
                placeholder="Note (optional)"
                className="md:col-span-2 border px-4 py-3 text-sm md:text-base"
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>


            {form.deliveryArea && (
              <div className="text-center text-sm md:text-base font-medium text-slate-700">
                Delivery Charge: ৳{deliveryCharge}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="px-10 py-3 text-sm md:text-lg rounded-xs font-semibold bg-[#1E556D] text-white hover:opacity-90 
                cursor-pointer"
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
