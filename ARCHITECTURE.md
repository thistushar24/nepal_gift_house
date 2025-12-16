# Architecture & Code Structure

**For developers who want to understand how the system works**

This document explains the technical architecture, code organization, and design decisions for Nepal Gift House.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │   React App (Vite + TypeScript + Tailwind)      │   │
│  │   - Public Pages (Home, Products, Gallery)       │   │
│  │   - Admin Panel (Dashboard, Product Management)  │   │
│  │   - Authentication (Login/Register)              │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/WebSocket
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   SUPABASE (Backend)                     │
│  ┌────────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Auth Service  │  │ PostgreSQL │  │   Storage    │  │
│  │  - JWT Tokens  │  │  Database  │  │ - Images     │  │
│  │  - Row Level   │  │  - Tables  │  │ - Public CDN │  │
│  │    Security    │  │  - RLS     │  │              │  │
│  └────────────────┘  └────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────┐
│              EXTERNAL SERVICES                           │
│  - WhatsApp (for orders)                                │
│  - Google Maps (for location)                           │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (faster than Create React App)
- **Tailwind CSS** - Utility-first CSS
- **React Router v6** - Client-side routing
- **Lucide React** - Icon library

### Backend (Supabase)
- **PostgreSQL** - Relational database
- **PostgREST** - Auto-generated REST API
- **GoTrue** - Authentication service
- **Storage** - File storage with CDN
- **Row Level Security (RLS)** - Database-level authorization

### Hosting Options
- **Vercel** / **Netlify** (recommended for frontend)
- **Supabase** (backend is already hosted)

---

## Project Structure Explained

```
nepal-gift-house/
│
├── public/                    # Static assets
│   └── vite.svg              # Favicon
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Layout/
│   │   │   ├── Header.tsx    # Navigation bar
│   │   │   └── Footer.tsx    # Footer with links
│   │   ├── ProductCard.tsx   # Product display card
│   │   └── WhatsAppButton.tsx # Floating chat button
│   │
│   ├── contexts/             # React Context (Global State)
│   │   └── AuthContext.tsx   # User authentication state
│   │
│   ├── lib/                  # Third-party library configs
│   │   ├── supabase.ts       # Supabase client instance
│   │   └── database.types.ts # TypeScript types for DB
│   │
│   ├── pages/                # Page components (Routes)
│   │   ├── Home.tsx          # Homepage
│   │   ├── Products.tsx      # Product listing
│   │   ├── ProductDetail.tsx # Single product page
│   │   ├── Gallery.tsx       # Photo gallery
│   │   ├── Contact.tsx       # Contact page
│   │   ├── Login.tsx         # Login/Register
│   │   └── Admin/            # Admin panel pages
│   │       ├── AdminLayout.tsx    # Admin sidebar layout
│   │       ├── Dashboard.tsx      # Admin dashboard
│   │       ├── ProductList.tsx    # Product management
│   │       └── ProductForm.tsx    # Add/Edit product
│   │
│   ├── utils/                # Helper functions
│   │   ├── whatsapp.ts       # WhatsApp integration
│   │   └── imageUpload.ts    # Image upload logic
│   │
│   ├── App.tsx               # Root component with routes
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles (Tailwind)
│   └── vite-env.d.ts         # TypeScript declarations
│
├── .env                      # Environment variables (SECRET!)
├── .env.example              # Environment template
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
├── README.md                 # Main documentation
├── QUICKSTART.md             # Beginner guide
├── DEPLOYMENT.md             # Deployment guide
└── ARCHITECTURE.md           # This file
```

---

## Key Design Patterns

### 1. Context API for Authentication
**File:** `src/contexts/AuthContext.tsx`

```typescript
// Provides authentication state globally
<AuthProvider>
  {user, profile, signIn, signUp, signOut}
</AuthProvider>
```

**Why:** Avoids prop drilling; any component can access user data.

### 2. Protected Routes
**File:** `src/pages/Admin/AdminLayout.tsx`

```typescript
// Checks if user is admin/staff
if (!user || (role !== 'admin' && role !== 'staff')) {
  return <Navigate to="/login" />;
}
```

**Why:** Prevents unauthorized access to admin panel.

### 3. Row Level Security (RLS)
**Database:** Supabase PostgreSQL

```sql
-- Example: Users can only read LIVE products
CREATE POLICY "Anyone can read live products"
  ON products FOR SELECT
  USING (status = 'live');
```

**Why:** Security at database level, not just frontend.

### 4. Optimistic UI Updates
**Example:** Product approval

```typescript
// Update UI immediately, then sync with DB
const handleApprove = async (id) => {
  // UI shows "approved" instantly
  await supabase.update(...);  // Sync with DB
};
```

**Why:** Feels faster for users.

---

## Database Schema Design

### Tables & Relationships

```
profiles (extends auth.users)
  ├── id (PK, FK to auth.users)
  ├── full_name
  ├── phone
  └── role (admin/staff/customer)

categories
  ├── id (PK)
  ├── name
  ├── slug
  ├── description
  └── display_order

products
  ├── id (PK)
  ├── category_id (FK → categories)
  ├── name
  ├── description
  ├── price
  ├── offer_price
  ├── images (JSONB array)
  ├── tags (TEXT array)
  ├── status (draft/live/out_of_stock)
  ├── created_by (FK → profiles)
  ├── approved_by (FK → profiles)
  └── approved_at

featured_items
  ├── id (PK)
  ├── product_id (FK → products)
  ├── title
  ├── subtitle
  ├── image_url
  ├── type (banner/featured_product/offer)
  ├── display_order
  └── is_active
```

### Why These Design Choices?

**1. JSONB for Images**
```typescript
images: ["url1.jpg", "url2.jpg", "url3.jpg"]
```
- Flexible: Can have 1-10 images per product
- No separate `product_images` table needed
- Easy to reorder images

**2. TEXT Array for Tags**
```typescript
tags: ["Perfect for Birthday", "Best for Girlfriend"]
```
- Simple filtering: `contains('tags', ['New Arrival'])`
- No separate `tags` or `product_tags` table
- Easy to add/remove tags

**3. Status Enum**
```sql
type product_status AS ENUM ('draft', 'live', 'out_of_stock')
```
- Type-safe (can't have invalid status)
- Efficient indexing
- Clear intent

**4. Separate `created_by` and `approved_by`**
- Track who added the product (staff)
- Track who approved it (admin)
- Useful for audit trails

---

## Authentication Flow

```
┌─────────────────────────────────────────────────┐
│ 1. User visits website                          │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│ 2. AuthContext checks for existing session      │
│    - Checks localStorage for JWT token          │
└─────────────┬───────────────────────────────────┘
              │
         Yes  │  No
    ┌─────────┴─────────┐
    ▼                   ▼
┌────────────┐    ┌──────────────┐
│ 3a. Fetch  │    │ 3b. User     │
│   Profile  │    │   is NULL    │
└─────┬──────┘    └──────────────┘
      │
      ▼
┌────────────────────────────────────────────────┐
│ 4. Check user role from profiles table         │
│    - admin: Full access to admin panel         │
│    - staff: Can add products (draft only)      │
│    - customer: Public pages only               │
└────────────────────────────────────────────────┘
```

### Sign In Process
```typescript
1. User enters email/password
2. Call supabase.auth.signInWithPassword()
3. Supabase returns JWT token
4. Token stored in localStorage automatically
5. Fetch user profile from profiles table
6. Set user state in AuthContext
7. Redirect to appropriate page
```

### Sign Up Process
```typescript
1. User enters email/password/name
2. Call supabase.auth.signUp()
3. User created in auth.users table
4. Create matching profile in profiles table
   - Default role: 'customer'
5. Auto-login user
6. Redirect to homepage
```

---

## Approval Workflow Implementation

### How It Works

```
Staff logs in
     ↓
Creates new product
     ↓
Form submitted
     ↓
┌────────────────────────────────────┐
│ ProductForm.tsx                    │
│ - Sets created_by = user.id        │
│ - Sets status = 'draft'            │
│ - Inserts into products table      │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│ Database (RLS Policy)              │
│ - Allows: staff can insert draft   │
│ - Blocks: staff cannot set 'live'  │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│ Admin sees product in list         │
│ - Status badge shows "DRAFT"       │
│ - Green checkmark button appears   │
└────────────┬───────────────────────┘
             ↓
Admin clicks approve
     ↓
┌────────────────────────────────────┐
│ ProductList.tsx                    │
│ - Updates status to 'live'         │
│ - Sets approved_by = admin.id      │
│ - Sets approved_at = now()         │
└────────────┬───────────────────────┘
             ↓
Product visible to customers!
```

### Code Implementation

**Create Product (Staff):**
```typescript
// src/pages/Admin/ProductForm.tsx
const productData = {
  ...formData,
  created_by: user.id,
  status: 'draft',  // Always draft for staff
};

await supabase.from('products').insert(productData);
```

**Approve Product (Admin Only):**
```typescript
// src/pages/Admin/ProductList.tsx
const handleApprove = async (productId: string) => {
  if (!isAdmin) return;  // Double-check

  await supabase
    .from('products')
    .update({
      status: 'live',
      approved_by: profile?.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', productId);
};
```

**RLS Policy (Database Level):**
```sql
-- Staff can only create as draft
CREATE POLICY "Staff can create products as draft"
  ON products FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND status = 'draft'
  );

-- Only admins can approve (set to 'live')
CREATE POLICY "Admins can update any product"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Image Upload Flow

```
User clicks "Upload Images"
         ↓
Selects files from device
         ↓
┌────────────────────────────────────┐
│ validateImageFile()                │
│ - Check file type (JPEG/PNG/WebP)  │
│ - Check file size (<5MB)           │
└────────────┬───────────────────────┘
      Valid  │  Invalid
    ┌────────┴────────┐
    ▼                 ▼
┌─────────┐    ┌──────────┐
│ Upload  │    │ Show     │
│ to      │    │ Error    │
│ Supabase│    └──────────┘
│ Storage │
└────┬────┘
     ↓
┌────────────────────────────────────┐
│ uploadProductImage()               │
│ 1. Generate unique filename        │
│ 2. Upload to 'product-images'      │
│ 3. Get public URL                  │
│ 4. Return URL                      │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│ Add URL to images array            │
│ images: [...existingImages, newURL]│
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│ Save to database as JSONB          │
│ images: ["url1", "url2", "url3"]   │
└────────────────────────────────────┘
```

### Storage Structure
```
product-images/
  └── products/
      └── {product-id}/
          ├── {timestamp1}.jpg
          ├── {timestamp2}.jpg
          └── {timestamp3}.jpg
```

---

## WhatsApp Integration

### How It Works

```typescript
// src/utils/whatsapp.ts

export function generateWhatsAppLink(product) {
  const message = `
Hello Nepal Gift House! 👋

I'm interested in:
📦 ${product.name}

💰 Price: Rs. ${product.price}
🎉 Offer Price: Rs. ${product.offerPrice}

📍 Location: ${GOOGLE_MAPS_LINK}

Please confirm availability and delivery details.
  `;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
```

### Why WhatsApp?

1. **Popular in Nepal** - Nearly everyone has WhatsApp
2. **No Payment Gateway Needed** - Saves costs and complexity
3. **Personal Touch** - Build customer relationships
4. **Flexible** - Can negotiate, confirm stock, arrange delivery
5. **Mobile-Friendly** - Works seamlessly on phones

---

## Performance Optimizations

### 1. Code Splitting
Vite automatically splits code by routes:
```typescript
// Each page loads only when needed
const Home = lazy(() => import('./pages/Home'));
```

### 2. Image Optimization
- Supabase Storage serves images via CDN
- Users can upload WebP format (smaller size)
- Set max file size: 5MB

### 3. Database Indexes
```sql
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
```

### 4. Efficient Queries
```typescript
// Only fetch necessary fields
.select('id, name, price, images[0]')  // Don't fetch all data

// Use limit for list pages
.limit(20)

// Use maybeSingle() instead of single()
.maybeSingle()  // Returns null if not found (no error)
```

---

## Security Measures

### 1. Row Level Security (RLS)
All tables have RLS enabled:
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

### 2. API Keys Protection
- Never commit `.env` to git
- Use environment variables
- Separate keys for development and production

### 3. Role-Based Access Control
```typescript
// Check at multiple levels:
// 1. Frontend (UI hiding)
if (isAdmin) {
  <button>Approve</button>
}

// 2. Client check (before API call)
if (!isAdmin) return;

// 3. Database (RLS policy)
CREATE POLICY ... USING (role = 'admin')
```

### 4. Input Validation
```typescript
// Validate on upload
const validation = validateImageFile(file);
if (!validation.valid) {
  return error;
}

// Sanitize user input (Supabase handles SQL injection)
```

---

## Testing Strategy

### Manual Testing Checklist
- [ ] User can browse products without login
- [ ] User can register and login
- [ ] Staff can create products (saved as draft)
- [ ] Staff cannot approve their own products
- [ ] Admin can approve products
- [ ] Approved products appear on homepage
- [ ] WhatsApp button works on mobile
- [ ] Image upload works
- [ ] Filters work on products page
- [ ] Product detail page shows all info
- [ ] Gallery loads images
- [ ] Contact page shows map and info

### Future: Automated Testing
```bash
# Can add later
npm install --save-dev vitest @testing-library/react
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                   USERS                          │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│              CDN (Vercel/Netlify)               │
│  - Serves static files (HTML, CSS, JS, images)  │
│  - Global edge network                          │
│  - HTTPS enabled                                │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│            Supabase (Backend)                   │
│  - Database (PostgreSQL)                        │
│  - Authentication                               │
│  - Storage (Product images)                     │
│  - Real-time subscriptions                      │
└─────────────────────────────────────────────────┘
```

---

## Folder Organization Best Practices

### Components
- **Layout/** - Components used across all pages
- **Reusable components** - Used in multiple places
- **One component per file**

### Pages
- Each route gets its own file
- **Admin/** subfolder for admin routes
- Use descriptive names: `ProductDetail.tsx`, not `PD.tsx`

### Utils
- Pure functions (no React)
- Can be tested independently
- Single responsibility

---

## Future Enhancements (Optional)

### Phase 2
- [ ] Customer wishlist
- [ ] Product reviews and ratings
- [ ] Search functionality
- [ ] Email notifications
- [ ] Order tracking

### Phase 3
- [ ] Multiple shops/locations
- [ ] Inventory management
- [ ] Sales analytics dashboard
- [ ] Customer accounts with order history
- [ ] Bulk product import (CSV)

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Automated invoicing
- [ ] SMS notifications
- [ ] Social media integration

---

## Learning Resources

### React
- [Official React Docs](https://react.dev)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Contributing Guidelines

If you're modifying the code:

1. **Keep it simple** - This is for beginners
2. **Comment your code** - Explain WHY, not just WHAT
3. **Follow existing patterns** - Look at similar components
4. **Test manually** - Check all features still work
5. **Update documentation** - Keep README in sync

---

## Questions & Answers

**Q: Why Supabase instead of Node.js backend?**
A: Simpler for beginners. No need to manage servers, write API endpoints, or handle authentication manually. Supabase provides all of this out of the box.

**Q: Why TypeScript instead of JavaScript?**
A: Catches errors early, better autocomplete, easier to maintain as project grows.

**Q: Why Vite instead of Create React App?**
A: Much faster development server, smaller build size, better defaults.

**Q: Why Tailwind instead of regular CSS?**
A: Faster development, consistent design, responsive out of the box, no CSS file management.

**Q: Can I switch to Next.js later?**
A: Yes! Most components can be reused. You'd need to adjust routing and some data fetching.

---

This architecture is designed to be:
- ✅ Simple to understand
- ✅ Easy to maintain
- ✅ Scalable for growth
- ✅ Secure by default
- ✅ Cost-effective
- ✅ Perfect for small businesses

Happy coding! 🚀
