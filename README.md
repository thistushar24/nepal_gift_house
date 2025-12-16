# Nepal Gift House - Gift Shop E-Commerce Website

A complete, production-ready full-stack website for Nepal Gift House, a physical gift shop in Nepal specializing in teddy bears and gift items. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Customer-Facing Features
- Beautiful, mobile-first responsive design
- Product catalog with filtering by category and tags
- Detailed product pages with multiple images
- Sales psychology elements (offers, limited stock, new arrivals)
- WhatsApp-based ordering (no online payment)
- Gallery showcase
- Contact page with Google Maps integration
- Trust-building elements (physical shop location, phone number)

### Admin Panel Features
- Secure role-based authentication (Admin & Staff)
- Product management (Create, Read, Update, Delete)
- Image upload with Supabase Storage
- **Approval workflow**: Staff uploads → Draft → Admin approves → Live
- Dashboard with statistics
- Product status management (Draft, Live, Out of Stock)

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Authentication, Database, Storage)
- **Database**: PostgreSQL (via Supabase)
- **Routing**: React Router v6

## Project Structure

```
nepal-gift-house/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx          # Main navigation header
│   │   │   └── Footer.tsx          # Footer with links
│   │   ├── ProductCard.tsx         # Product card component
│   │   └── WhatsAppButton.tsx      # Floating WhatsApp button
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication context
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client setup
│   │   └── database.types.ts       # TypeScript types for database
│   ├── pages/
│   │   ├── Home.tsx               # Homepage
│   │   ├── Products.tsx           # Product listing
│   │   ├── ProductDetail.tsx      # Product detail page
│   │   ├── Gallery.tsx            # Photo gallery
│   │   ├── Contact.tsx            # Contact page
│   │   ├── Login.tsx              # Login/Register page
│   │   └── Admin/
│   │       ├── AdminLayout.tsx    # Admin panel layout
│   │       ├── Dashboard.tsx      # Admin dashboard
│   │       ├── ProductList.tsx    # Product management list
│   │       └── ProductForm.tsx    # Add/Edit product form
│   ├── utils/
│   │   ├── whatsapp.ts           # WhatsApp integration
│   │   └── imageUpload.ts         # Image upload utilities
│   ├── App.tsx                    # Main app with routes
│   └── main.tsx                   # App entry point
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## Database Schema

### Tables

#### profiles
- Extends auth.users with custom fields
- Fields: id, full_name, phone, role (admin/staff/customer)

#### categories
- Product categories
- Fields: id, name, slug, description, display_order

#### products
- Main product catalog
- Fields: id, name, description, price, offer_price, images, tags, status, created_by, approved_by, approved_at

#### featured_items
- Homepage featured products and banners
- Fields: id, product_id, title, subtitle, image_url, type, display_order, is_active

### Storage Bucket
- **product-images**: Stores product photos (max 5MB, JPEG/PNG/WebP)

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works)

### 2. Clone and Install

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. The database schema and storage bucket are already configured
3. Get your project credentials:
   - Go to Project Settings → API
   - Copy the **Project URL** and **anon/public key**

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Create First Admin User

1. Run the development server:
```bash
npm run dev
```

2. Go to `/login` and register a new account
3. In Supabase Dashboard → Table Editor → profiles
4. Find your user and change `role` from `customer` to `admin`
5. Refresh the page - you now have admin access!

### 6. Adding Staff Users

**Option 1: Admin Creates Staff Account**
- Register a new user via `/login`
- Admin changes their role to `staff` in Supabase Dashboard

**Option 2: Direct Database Insert**
```sql
UPDATE profiles
SET role = 'staff'
WHERE email = 'staff@example.com';
```

## Usage Guide

### For Customers
1. Browse products on homepage or products page
2. Click product to see details
3. Click "Buy on WhatsApp" to order via WhatsApp
4. Pre-filled message includes product details and shop location

### For Staff
1. Login at `/login`
2. Access Admin Panel at `/admin`
3. Add new products (auto-saved as DRAFT)
4. Upload multiple product images
5. Add tags like "Perfect for Birthday", "Kids Favorite"
6. Wait for admin approval

### For Admin
1. Login at `/login`
2. Access Admin Panel at `/admin`
3. Review pending products (Draft status)
4. Approve products to make them live
5. Edit or delete any product
6. Manage all aspects of the store

## Approval Workflow

```
Staff uploads product
    ↓
Saved as DRAFT
    ↓
Admin reviews in Admin Panel
    ↓
Admin clicks "Approve"
    ↓
Product status changes to LIVE
    ↓
Visible to customers
```

## WhatsApp Integration

The site uses WhatsApp as the primary ordering channel. When customers click "Buy on WhatsApp", it opens WhatsApp with a pre-filled message containing:
- Product name
- Price and offer price
- Shop name
- Google Maps link

No online payment is required - orders are confirmed manually on WhatsApp.

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript type checking
npm run lint         # Lint code
```

## Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Option 2: Netlify
1. Push code to GitHub
2. Import project on Netlify
3. Add environment variables
4. Build command: `npm run build`
5. Publish directory: `dist`

### Option 3: Traditional Hosting
1. Run `npm run build`
2. Upload `dist` folder to your hosting
3. Configure web server to serve `index.html` for all routes
4. Set environment variables on server

## Security Features

- Row Level Security (RLS) enabled on all tables
- Role-based access control (Admin, Staff, Customer)
- Image upload restricted to authenticated staff/admin
- Products cannot go live without admin approval
- Secure authentication via Supabase Auth

## Mobile-First Design

The entire site is designed mobile-first with:
- Responsive breakpoints for all screen sizes
- Touch-friendly buttons and interactions
- Optimized images and performance
- WhatsApp integration perfect for mobile users

## Sales Psychology Elements

- "New Arrival" and "Limited Stock" badges
- Offer pricing with percentage savings
- Emotional tags (Perfect for Birthday, Best for Girlfriend)
- Large, beautiful product images
- Trust indicators (physical shop, phone, map)
- Festival-based offers (admin-controlled)

## Support

For technical issues:
1. Check Supabase Dashboard for database/auth errors
2. Check browser console for frontend errors
3. Verify environment variables are set correctly

For business inquiries:
- Phone: +977 9815888721
- Google Maps: https://maps.app.goo.gl/4GQduP9t81mdoFk96

## License

Private - All Rights Reserved to Nepal Gift House

---

Built with love in Nepal 🇳🇵
