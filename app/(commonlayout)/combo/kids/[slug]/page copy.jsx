// import { notFound } from "next/navigation"
// import ComboSinglePage from "@/components/Combo/ComboSinglePage"


// async function getCombo(slug) {
//     try {


//         const API_URL = process.env.API_URL || 'http://localhost:3000'
//         const url = `${API_URL}/api/combos/${slug}`



//         const res = await fetch(url
//             ,
//             {
//                 next: { revalidate: 60 }, // ISR
//             }
//         )

//         if (!res.ok) return null

//         return res.json()
//     } catch (error) {
//         return null
//     }
// }


// // export async function generateMetadata({ params }) {
// //   const combo = await getCombo(params?.slug)

// //   if (!combo) {
// //     return {
// //       title: "Combo Not Found",
// //       description: "This combo is no longer available",
// //     }
// //   }

// //   return {
// //     title: `${combo.title} | Kids Combo`,
// //     description: combo.description,
// //     openGraph: {
// //       title: combo.title,
// //       description: combo.description,
// //       images: [
// //         {
// //           url: combo.featuredImage,
// //           width: 1200,
// //           height: 630,
// //         },
// //       ],
// //     },
// //   }
// // }

// export default async function Page({ params }) {

//     const { slug } = await params;
//     const combo = await getCombo(slug)



//     return <ComboSinglePage combo={combo} />
// }
