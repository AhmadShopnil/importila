// // lib/upload.js
// export async function uploadToVercelBlob(file) {
//   if (!file || file.size === 0) return null

//   const blobName = `${crypto.randomUUID()}-${file.name}`
//   const res = await fetch(`https://api.vercel.com/v1/blob`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.VERCEL_BLOB_TOKEN}`,
//     },
//     body: file,
//   })

//   if (!res.ok) {
//     console.error("Failed to upload to Vercel Blob", await res.text())
//     return null
//   }

//   const data = await res.json()
//   return data.url // This is the accessible URL
// }

