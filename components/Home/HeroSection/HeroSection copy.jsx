// import Link from "next/link";
// import Container from "@/components/Container";

// const HeroSection = () => {


//  const handleScrollTo = (section) => {
//     const comboSection = document.getElementById(section);
//     if (comboSection) {
//       comboSection.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };



//   return (
//     <section className="bg-[#FFF9E6] relative overflow-hidden pt-20 pb-30 ">
//       <Container className=" ">
//         <div className="flex  items-center justify-center">
//           <div className=" text-center ">
//             <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-6">
//               <span className="text-2xl">✨</span>
//               <span className="text-sm font-medium text-primary">New Collection</span>
//             </div>
            
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
//              For Kids
//               {/* <span className="text-3xl block gradient-combo bg-clip-text text-white p-4">Happy & Playful</span> */}
//             </h1>
            
//             <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto lg:mx-0">
//               Discover our amazing toy combos! Curated bundles for boys and girls at special prices.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center ">
//               <button
//               onClick={()=>handleScrollTo("combos")}
//               className="cursor-pointer gradient-combo text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90
//                transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
//                 <span>Shop Combos</span>
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                 </svg>
//               </button>
//               <Link 
//               href="/shop"
//               className="bg-white text-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-muted transition-all
//                border-2 border-border cursor-pointer">
//                 Make Your Combo
//               </Link>
//             </div>
//           </div>
          
        
//         </div>
//       </Container>
      
//       <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
//     </section>
//   );
// };

// export default HeroSection;