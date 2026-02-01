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
  variants: [
    {
      design: String,
      color: String,
      size: String,
      stock: Number,
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
