



// import Link from 'next/link';

// import Container from '@/components/Container';



// export const ProductCard = ({ product }) => {
//     const productId = product.originalId || product._id || product.id;
//     const productName = `${product.designName} -${product.name} `;
//     // const productName = product.displayName || product.name;
//     const colorParam = product.displayColor ? `?color=${encodeURIComponent(product.displayColor)}` : '';

//     return (
//         <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-border/50">
//             <Link href={`/product/${productId}${colorParam}`}>
//                 <div className="relative aspect-[3/4] overflow-hidden bg-muted">
//                     <img
//                         src={product?.featuredImage || "/placeholder.svg"}
//                         alt={productName}
//                         className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
//                     />
//                     {product.offerPrice > 0 && (
//                         <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
//                             SAVE ৳{product.price - product.offerPrice}
//                         </div>
//                     )}
//                 </div>
//             </Link>

//             <div className="p-3">
//                 <Link href={`/product/${productId}${colorParam}`}>
//                     <h3 className="text-sm font-bold text-[#1C546D] mb-1 line-clamp-1 group-hover:text-primary transition-colors">
//                         {productName}
//                     </h3>
//                 </Link>

//                 <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                         {product.offerPrice > 0 ? (
//                             <>
//                                 <span className="text-sm font-bold text-primary">৳{product.offerPrice}</span>
//                                 <span className="text-[10px] text-muted-foreground line-through opacity-70">৳{product.price}</span>
//                             </>
//                         ) : (
//                             <span className="text-sm font-bold text-[#1C546D]">৳{product.price}</span>
//                         )}
//                     </div>
//                 </div>

//                 <Link
//                     href={`/product/${productId}${colorParam}`}
//                     className="w-full py-2 bg-[#1C546D]/5 text-[#1C546D] text-[11px] font-bold rounded-lg flex items-center justify-center hover:bg-[#1C546D] hover:text-white transition-all duration-300"
//                 >
//                     View Details
//                 </Link>
//             </div>
//         </div>
//     );
// };

// const ProductsList = ({ products }) => {




//     return (
//         <section id="boys" className="py-6 md:py-10 bg-background">
//             <Container className="">
//                 <div className="mb-4 md:mb-6">
//                     <h2 className="text-xl md:text-2xl   mb-4 font-semibold text-[#1C546D] ">
//                         Our Products
//                     </h2>




//                     {/* <div className="  text-xs md:text-base">
//                         <Link
//                             href="/shop"
//                             className={`  group mt-8  font-semibold items-center gap-3  text-[#5F9498]  transition-all
//                                     duration-300
//             `}>
//                             View More
//                             <span
//                                 className="inline-block transition-transform duration-300 group-hover:translate-x-1"
//                             >
//                                 →
//                             </span>
//                         </Link>

//                     </div> */}

//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5 md:gap-6">
//                     {products?.map((product) => (
//                         <ProductCard
//                             key={product._id}
//                             product={product}
//                             accentColor={'gradient-boy'}
//                         />
//                     ))}
//                 </div>

//                 {/* <div className="text-center mt-10">
//           <Link
//              href="/shop"
//           className={`px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg ${
//             activeTab === 'boys' ? 'gradient-boy' : 'gradient-girl'
//           }`}>
//             View All
//           </Link>
//         </div> */}
//             </Container>
//         </section>
//     );
// };

// export default ProductsList;