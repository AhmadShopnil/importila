// import Image from "next/image";
// import Container from "@/components/Container";

// const combos = [
//   {
//     id: 1,
//     name: "Adventure Pack",
//     description: "3 action toys + puzzle",
//     items: ["🚗", "🦖", "🚀", "🧩"],
//     originalPrice: 89.99,
//     comboPrice: 59.99,
//     savings: "33%",
//     badge: "Best Seller",
//     gender: "boy"
//   },
//   {
//     id: 2,
//     name: "Princess Bundle",
//     description: "Doll set + accessories",
//     items: ["👸", "👗", "👜", "🎀"],
//     originalPrice: 79.99,
//     comboPrice: 54.99,
//     savings: "31%",
//     badge: "Popular",
//     gender: "girl"
//   },
//   {
//     id: 3,
//     name: "Creative Starter",
//     description: "Art supplies + craft kit",
//     items: ["🎨", "✂️", "📐", "🖍️"],
//     originalPrice: 59.99,
//     comboPrice: 39.99,
//     savings: "33%",
//     badge: "New",
//     gender: "unisex"
//   },
//   {
//     id: 4,
//     name: "Builder's Dream",
//     description: "3 building sets",
//     items: ["🏗️", "🧱", "🔧", "🚜"],
//     originalPrice: 99.99,
//     comboPrice: 69.99,
//     savings: "30%",
//     badge: "Limited",
//     gender: "boy"
//   },
// ];

// const Combos = ({ combos }) => {
//   return (
//     <section id="combos" className="py-16 bg-muted">
//       <Container className="">
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
//           <div>
//             <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
//               <span className="text-xl">🎁</span>
//               <span className="text-sm font-semibold text-primary">Special Offers</span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//               Combo Deals
//             </h2>
//             <p className="text-muted-foreground">
//               Save more with our curated bundles
//             </p>
//           </div>
//           <a href="#" className="text-primary font-semibold hover:underline flex items-center gap-1 mt-4 md:mt-0">
//             View All Combos
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </a>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {combos?.map((combo) => (
//             <div
//               key={combo?._id}
//               className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
//             >
//               <div className="relative px-4 bg-linear-to-br from-muted to-white">
               
//                 <div className="  relative w-full overflow-hidden rounded-sm aspect-4/4  max-h-90  md:max-h-140 mt-6" 
//            >
//                   <Image
//                     src={combo?.featuredImage}
//                     alt={combo?.name}
//                     fill
//                     priority
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                     className="object-cover"
//                   />
//                 </div>
//               </div>

//               <div className="p-5">
//                 <h3 className="font-bold text-lg text-foreground mb-1">{combo?.title}</h3>
//                 <p className="text-sm text-muted-foreground mb-4">{combo?.description}</p>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xl font-bold text-primary"> ৳ {combo?.offerPrice}</span>
//                       <span className="text-sm text-muted-foreground line-through"> ৳ {combo?.price}</span>
//                     </div>
//                     {/* <span className="text-xs font-semibold text-green-600">Save {combo?.savings}</span> */}
//                   </div>

//                   <button className="w-10 h-10 gradient-combo rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default Combos;