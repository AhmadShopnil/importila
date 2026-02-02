import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload file to Cloudinary
 * @param {File} file
 * @param {string} folder
 */
export async function uploadToCloudinary(file, folder = "products") {
  if (!file || file.size === 0) return null

  const buffer = Buffer.from(await file.arrayBuffer())

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error)
          return reject(error)
        }
        resolve(result?.secure_url)
      }
    ).end(buffer)
  })
}
