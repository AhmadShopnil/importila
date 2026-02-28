"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Star, Quote } from "lucide-react"

export default function ReviewSection() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/reviews")
            .then(res => res.json())
            .then(data => {
                setReviews(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading || reviews.length === 0) return null

    return (
        <section className="py-4 md:py-20 bg-gradient-to-b from-transparent to-primary/5 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-6 md:mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase">
                        <Star size={16} fill="currentColor" />
                        Customer Feedback
                        <Star size={16} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl md:text-5xl font-extrabold text-[#1E556E] ">
                        আমাদের কাস্টমাররা কী বলছেন <br />
                        <span className="text-primary ">এক নজরে দেখে নিন!</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        শত শত সন্তুষ্ট কাস্টমারের ভালোবাসা আর আস্থাই আমাদের এগিয়ে চলার পাথেয়।
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="review-swiper !pb-16"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review._id}>
                                <div className="group bg-card border border-border rounded-2xl p-4 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 relative overflow-hidden">
                                    {/* Quote Icon Decoration */}
                                    <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                                        <Quote size={48} />
                                    </div>

                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-inner mb-4 md:mb-6">
                                        <Image
                                            src={review.imageUrl}
                                            alt={review.customerName || "Customer Review"}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>

                                    <div className="space-y-3 px-4 pb-3 md:pb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
                                            ))}
                                        </div>
                                        {/* <h3 className="text-lg font-extrabold text-foreground">{review.customerName || "Happy Customer"}</h3> */}
                                        <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            VERIFIED PURCHASE
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <style jsx global>{`
                .review-swiper .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: var(--primary);
                    opacity: 0.2;
                    transition: all 0.3s ease;
                }
                .review-swiper .swiper-pagination-bullet-active {
                    opacity: 1;
                    width: 32px;
                    border-radius: 6px;
                }
                .review-swiper .swiper-button-next,
                .review-swiper .swiper-button-prev {
                    color: var(--primary);
                    background: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1);
                }
                .review-swiper .swiper-button-next:after,
                .review-swiper .swiper-button-prev:after {
                    font-size: 20px;
                    font-weight: bold;
                }
            `}</style>
        </section>
    )
}
