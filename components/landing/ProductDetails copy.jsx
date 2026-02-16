// "use client"

// import { CheckCircle2, ShieldCheck, Zap, Sparkles } from "lucide-react"

// export default function ProductDetails({ combo }) {

//     // console.log("combo from details", combo)

//     if (!combo?.landingPageDetails) return null

//     return (
//         <section className="py-8 md:py-20  bg-muted/30 relative overflow-hidden">
//             {/* Background Accent */}
//             <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />

//             <div className="container mx-auto px-4 relative z-10">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="bg-card border border-border rounded-md p-4 sm:p-8 md:p-12 shadow-2xl shadow-primary/5 ">

//                         {/* Rich Content Area */}
//                         <div
//                             className="rich-content-area break-words overflow-x-hidden
//                             [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4
//                             [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl
//                             [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg
//                             [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full
//                             [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4
//                             [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3
//                             [&_p]:mb-4 [&_p]:leading-relaxed
//                             [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
//                             [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
//                             "
//                             dangerouslySetInnerHTML={{ __html: combo.landingPageDetails }}
//                         />

//                         {/* Quality Badges */}
//                         {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-border/50">
//                             {[
//                                 { icon: Sparkles, label: "100% Combed Cotton" },
//                                 { icon: ShieldCheck, label: "Anti-Shrink Tech" },
//                                 { icon: CheckCircle2, label: "Skin Friendly" },
//                                 { icon: Zap, label: "Factory Direct" }
//                             ].map((item, i) => (
//                                 <div key={i} className="flex flex-col items-center text-center gap-3 group">
//                                     <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
//                                         <item.icon size={24} />
//                                     </div>
//                                     <span className="text-xs font-bold text-foreground uppercase tracking-wider">{item.label}</span>
//                                 </div>
//                             ))}
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }
