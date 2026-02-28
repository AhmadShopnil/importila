import React from 'react'
import { BASE_URL } from '@/utils/baseUrl'
import Image from 'next/image'
import Container from '@/components/Container'
import Link from 'next/link'

export default async function page() {
    const combos = await getCombos()


    return (
        <section
            id="combos"
            className="
       py-6 md:py-10 min-h-screen
       
      "
        >
            <Container>

                {/* Header */}
                <div className="flex items-center justify-between  mb-4 px-0.5 ">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-[#1C546D]  ">
                            All Combos
                        </h2>

                    </div>

                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
                    {combos?.map((combo) => (
                        <div
                            key={combo?._id}
                            className="
                bg-white
                overflow-hidden
                shadow-md rounded-sm
                hover:shadow-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                group pb-4 md:pb-6
               
              "
                        >
                            {/* Image */}
                            <div className="relative p-2 bg-linear-to-br from-muted to-white ">
                                <div className="relative w-full aspect-square  overflow-hidden">
                                    <Image
                                        src={combo?.featuredImage}
                                        alt={combo?.title}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-5">
                                <h3 className="font-semibold text-sm  md:text-base text-[#1C546D] ">
                                    {combo?.title}
                                </h3>

                                {/* Price  */}
                                <div className="flex items-center justify-between ">


                                    <Link
                                        href={`/combo/kids/${combo?.slug}`}
                                        className="cursor-pointer w-full py-1 mt-1 bg-[#34667B] rounded-md flex items-center justify-center text-white hover:scale-105 transition-transform shadow-md">
                                        Buy Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </Container>
        </section>
    )
}


async function getCombos() {
    try {
        const res = await fetch(`${BASE_URL}/api/combos`, {
            next: { revalidate: 60 },
        })

        if (!res.ok) return []

        const data = await res.json()
        return Array.isArray(data) ? data : data?.data || []
    } catch (error) {
        console.error("Failed to fetch combos:", error)
        return []
    }
}