"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"

export default function ProductDetails({ combo }) {
    const [open, setOpen] = useState(false)
    const contentRef = useRef(null)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        // Open by default on desktop
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(true)
            } else {
                setOpen(false)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight)
        }
    }, [open, combo])

    if (!combo?.landingPageDetails) return null

    return (
        <section className="py-8 md:py-20 bg-muted/30 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-card border border-border rounded-md shadow-2xl shadow-primary/5">

                        {/* Accordion Header */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="w-full bg-[#34667B] text-white flex items-center justify-between p-3  md:p-4 text-left "
                        >
                            <h2 className="text-base sm:text-lg md:text-xl font-bold">
                                {open
                                    ? "বিস্তারিত বন্ধ করতে ক্লিক করুন"
                                    : "প্রোডাক্ট সম্পর্কে বিস্তারিত দেখতে ক্লিক করুন"}
                            </h2>


                            <ChevronDown
                                className={`transition-transform duration-300 ${open ? "rotate-180" : ""
                                    }`}
                                size={20}
                            />
                        </button>

                        {/* Accordion Content */}
                        <div
                            style={{
                                maxHeight: open ? `${height}px ` : "0px",
                            }}
                            className="overflow-hidden transition-all duration-500 ease-in-out "
                        >
                            <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-10">
                                <div
                                    ref={contentRef}
                                    className="rich-content-area break-words overflow-x-hidden
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4
                  [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl
                  [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg
                  [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full
                  [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4
                  [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3
                  [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4"
                                    dangerouslySetInnerHTML={{ __html: combo.landingPageDetails }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
