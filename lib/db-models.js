export const ProductSchema = {
  name: String,
  description: String,
  categories: [String], // Array of category IDs
  price: Number,
  offerPrice: Number,
  image: String,
  images: [String],
  stock: Number,
  isFeatured: Boolean,
  isActive: Boolean,
  isTrashed: Boolean,
  variants: [
    {
      design: String,
      color: String,
      size: String,
      stock: Number,
      image: String,
    },
  ],
  designs: [String],
  colors: [String],
  sizes: [String],
  createdAt: Date,
  updatedAt: Date,
}

export const CategorySchema = {
  name: String,
  slug: String,
  description: String,
  image: String,
  parentId: String, // null for top-level categories (Boys, Girls)
  isActive: Boolean,
  order: Number, // for sorting
  createdAt: Date,
  updatedAt: Date,
}

export const OrderSchema = {
  orderNumber: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  items: [
    {
      productId: String,
      productName: String,
      quantity: Number,
      price: Number,
      design: String,
      color: String,
      size: String,
    },
  ],
  totalPrice: Number,
  totalItems: Number, // Track total number of items
  status: String, // pending, confirmed, shipped, delivered, cancelled
  paymentStatus: String, // unpaid, paid, refunded
  orderSource: String, // website, facebook, whatsapp, call, wholesale, other
  createdAt: Date,
  updatedAt: Date,
}

export const StockSchema = {
  productId: String,
  variantStocks: [
    {
      design: String,
      color: String,
      size: String,
      stock: Number,
      lowStockThreshold: Number,
    },
  ],
  lastRestockDate: Date,
}

export const DailySaleSchema = {
  date: Date,
  totalRevenue: Number,
  totalOrders: Number,
  totalItems: Number,
}

export const SliderSchema = {
  name: String,
  location: String, // Unique identifier like 'home-hero', 'category-page'
  isActive: Boolean,
  slides: [
    {
      image: String, // Cloudinary URL or relative path
      link: String,  // Link when clicked
      title: String, // Optional title
      subtitle: String, // Optional subtitle
      order: Number,
    }
  ],
  createdAt: Date,
  updatedAt: Date,
}

export const MediaSchema = {
  url: String,
  publicId: String, // Cloudinary public ID
  folder: String,
  fileName: String,
  fileSize: Number,
  format: String,
  width: Number,
  height: Number,
  createdAt: Date,
}

export const UserSchema = {
  name: String,
  username: String,
  password: String, // hashed
  role: String, // super_admin, admin, manager
  createdAt: Date,
  updatedAt: Date,
}

// Interfaces for JavaScript
export const createSlider = () => ({
  name: "",
  location: "",
  isActive: true,
  slides: [],
})

export const createProduct = () => ({
  name: "",
  description: "",
  fabric: "",
  category: "",
  price: 0,
  image: "",
  images: [],
  variants: [],
  designs: [],
  colors: [],
  sizes: [],
})

export const createOrderItem = () => ({
  productId: "",
  productName: "",
  quantity: 0,
  price: 0,
  design: "",
  color: "",
  size: "",
})

export const createOrder = () => ({
  orderNumber: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  items: [],
  totalPrice: 0,
  totalItems: 0,
  status: "pending",
  paymentStatus: "unpaid",
  orderSource: "website",
})

export const createMedia = () => ({
  url: "",
  publicId: "",
  folder: "general",
  fileName: "",
  fileSize: 0,
  format: "",
  width: 0,
  height: 0,
  createdAt: new Date(),
})

export const createUser = () => ({
  name: "",
  username: "",
  password: "",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
})

