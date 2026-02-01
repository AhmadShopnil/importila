# Kids Shop E-Commerce Platform

A full-stack Next.js 16 e-commerce application for kids clothing with an admin dashboard. Built with pure JavaScript (JSX), featuring Version 2 buying logic with granular variant-specific stock management.

## Features

### Frontend
- Product listing with category filtering
- Product detail pages with design, color, and size selection
- Shopping cart with persistent storage (localStorage)
- Responsive design optimized for mobile, tablet, and desktop
- Minimum order quantity enforcement (3 items)
- Real-time stock availability checking

### Admin Dashboard (Mobile-Responsive)
- Product management (add, edit, delete) with variant configuration
- Category management
- Order management with status tracking
- Stock management with low stock alerts and quick update buttons
- Sales reports with daily breakdown and summary metrics
- Dashboard with key metrics (total products, orders, revenue, low stock items)
- Responsive sidebar navigation that collapses on mobile
- Mobile-friendly tables and forms

### Version 2 Buying Logic
- Granular stock management by product variant (design, color, size combination)
- Each variant tracks independent inventory
- Stock validation before checkout
- Automatic stock deduction upon successful order
- Stock rollback on order failure
- Cart validation with detailed error messages
- Daily sales tracking with revenue and item count

## Tech Stack

- **Frontend**: Next.js 16, React 19, JavaScript (JSX), Tailwind CSS v4
- **Backend**: Next.js API Routes (App Router)
- **Database**: MongoDB with native Node driver
- **Icons**: Lucide React
- **Package Manager**: npm

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=kids-shop
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace:
- `username` and `password` with your MongoDB credentials
- `cluster` with your MongoDB cluster name

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
app/
├── page.jsx                   # Home/Shop page
├── product/
│   └── [id]/page.jsx         # Product detail page
├── cart/
│   └── page.jsx              # Shopping cart page
├── admin/
│   ├── layout.jsx            # Admin layout with responsive sidebar
│   ├── page.jsx              # Admin dashboard
│   ├── products/
│   │   ├── page.jsx          # Products list
│   │   ├── new/page.jsx      # Add product
│   │   └── [id]/page.jsx     # Edit product
│   ├── categories/page.jsx   # Categories management
│   ├── orders/page.jsx       # Orders management
│   ├── stock/page.jsx        # Stock management
│   └── reports/page.jsx      # Sales reports
└── api/
    ├── products/             # Product endpoints
    │   ├── route.js          # List/Create products
    │   └── [id]/route.js     # Get/Update/Delete product
    ├── categories/           # Category endpoints
    │   ├── route.js          # List/Create categories
    │   └── [id]/route.js     # Update/Delete category
    ├── orders/               # Order endpoints
    │   ├── route.js          # List/Create orders
    │   └── [id]/route.js     # Update order
    ├── checkout/
    │   └── route.js          # Process checkout with V2 logic
    ├── cart/
    │   └── validate/route.js # Validate cart before checkout
    ├── stock/
    │   └── route.js          # Get stock information
    └── reports/
        └── sales/route.js    # Get sales reports

lib/
├── mongodb.js                # MongoDB connection singleton
├── db-models.js              # Database schemas and factory functions
├── init-db.js                # Database initialization
└── stock-manager.js          # Variant stock management utilities
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products?category=boys` - Filter by category
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product with variants
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Orders
- `GET /api/orders` - List orders with pagination
- `GET /api/orders?status=pending` - Filter by status
- `PUT /api/orders/[id]` - Update order status

### Checkout (Version 2)
- `POST /api/checkout` - Process order with variant stock validation
  - Validates minimum order quantity (3 items)
  - Checks stock for each variant
  - Deducts stock on successful order
  - Records daily sales

### Cart Validation
- `POST /api/cart/validate` - Validate cart items before checkout
  - Checks product existence
  - Validates variant availability
  - Returns available stock for each item

### Stock
- `GET /api/stock` - Get all variant stocks

### Reports
- `GET /api/reports/sales?month=YYYY-MM` - Get monthly sales report with daily breakdown

## Database Schema

### Products
```javascript
{
  name: String,
  description: String,
  category: String,
  price: Number,
  image: String,
  images: [String],
  variants: [
    {
      design: String,
      color: String,
      size: String,
      stock: Number  // Per-variant inventory
    }
  ],
  designs: [String],
  colors: [String],
  sizes: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Orders
```javascript
{
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
      size: String
    }
  ],
  totalPrice: Number,
  totalItems: Number,
  status: String,  // pending, confirmed, shipped, delivered, cancelled
  paymentStatus: String,  // unpaid, paid, refunded
  createdAt: Date,
  updatedAt: Date
}
```

## Key Features Explained

### Version 2 Buying Logic
- **Granular Stock Management**: Stock is tracked at the variant level (design + color + size combination), not just product level
- **Pre-Checkout Validation**: Cart items are validated against current inventory before processing
- **Atomic Stock Deduction**: Stock is decremented only after order is successfully created
- **Rollback Support**: If stock update fails, the entire order is cancelled to maintain consistency
- **Daily Sales Tracking**: Automatic recording of revenue, order count, and items sold per day

### Responsive Admin Dashboard
- **Mobile-First Design**: All pages optimized for 320px+ screens
- **Collapsible Sidebar**: Navigation menu collapses on mobile for space efficiency
- **Responsive Tables**: Tables show relevant columns based on screen size with horizontal scroll on mobile
- **Touch-Friendly**: Larger buttons and inputs suitable for mobile interaction
- **Adaptive Forms**: Multi-column forms stack to single column on mobile

### Shopping Experience
- **Persistent Cart**: Cart stored in localStorage, persists across sessions
- **Real-Time Stock**: Product pages show available stock per variant
- **Variant Selection**: Users can choose design, color, and size with visual feedback
- **Minimum Order**: Enforces minimum of 3 items to meet wholesale requirements
- **Stock Checking**: Validates stock availability during checkout with clear error messages

## Deployment

To deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
4. Deploy!

## Notes


