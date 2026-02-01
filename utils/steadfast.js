// export async function steadfastFetch(
//     path: string,
//     method: "GET" | "POST",
//     body?: any
// ) {
//     const res = await fetch(
//         `${process.env.STEADFAST_BASE_URL}${path}`,
//         {
//             method,
//             headers: {
//                 "Api-Key": process.env.STEADFAST_API_KEY!,
//                 "Secret-Key": process.env.STEADFAST_SECRET_KEY!,
//                 "Content-Type": "application/json",
//             },
//             body: body ? JSON.stringify(body) : undefined,
//         }
//     )

//     const data = await res.json()

//     if (!res.ok) {
//         throw new Error(data?.message || "Steadfast API Error")
//     }

//     return data
// }
