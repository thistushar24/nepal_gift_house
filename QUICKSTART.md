# Quick Start Guide - Nepal Gift House

**For beginners who want to get started quickly!**

This guide will get your gift shop website running in 15 minutes.

---

## Step 1: Get Your Tools Ready (5 minutes)

### What You Need:
1. A computer with internet
2. **Node.js** installed ([Download here](https://nodejs.org) - get the LTS version)
3. A **Supabase account** (It's FREE - sign up at [supabase.com](https://supabase.com))

### Check Node.js is Installed:
Open your terminal (Command Prompt on Windows, Terminal on Mac) and type:
```bash
node --version
```
You should see something like `v18.0.0` or higher.

---

## Step 2: Set Up Supabase (5 minutes)

### Create Your Supabase Project:
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - **Name**: Nepal Gift House
   - **Database Password**: (create a strong password - save it somewhere safe!)
   - **Region**: Choose closest to Nepal (Singapore or Mumbai)
4. Click "Create new project"
5. Wait 2-3 minutes while it sets up

### Get Your API Keys:
1. After project is ready, click on **Settings** (gear icon)
2. Go to **API** section
3. You'll see two important things:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string of random characters)
4. **KEEP THESE SAFE** - you'll need them in the next step!

---

## Step 3: Set Up the Website (3 minutes)

### Install Dependencies:
In your terminal, inside the project folder, run:
```bash
npm install
```

This downloads all the code libraries needed. It might take 2-3 minutes.

### Set Up Environment Variables:
1. You'll find a file called `.env.example` in the project folder
2. Create a new file called `.env` (no .example)
3. Copy these lines and **replace with your Supabase details**:

```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Run the Website! (1 minute)

In your terminal, run:
```bash
npm run dev
```

You should see something like:
```
VITE v5.4.8  ready in 500 ms

➜  Local:   http://localhost:5173/
```

**Open your browser** and go to: `http://localhost:5173`

**🎉 Your website is now running!**

---

## Step 5: Create Your Admin Account (2 minutes)

1. On the website, click **Login** (top right)
2. Click **Sign Up**
3. Fill in:
   - Your full name
   - Email
   - Password (at least 6 characters)
   - Phone (optional)
4. Click **Sign Up**

### Make Yourself Admin:
1. Go to your **Supabase Dashboard**
2. Click **Table Editor** (left sidebar)
3. Click **profiles** table
4. You'll see your user - click on the **role** field
5. Change it from `customer` to `admin`
6. Go back to the website and **refresh the page**
7. You should now see **Admin** in the top menu

**🎊 You're now an admin!**

---

## Step 6: Add Your First Product (3 minutes)

1. Click **Admin** in the top menu
2. Click **Products** in the sidebar
3. Click **Add Product** button
4. Fill in the form:
   - **Product Name**: "Large Pink Teddy Bear"
   - **Description**: "Soft and cuddly teddy bear, perfect for birthdays"
   - **Price**: 1500
   - **Offer Price**: 1200 (optional)
   - **Category**: Select "Teddy Bears"
   - **Upload Images**: Click to upload (you can use stock photos for testing)
   - **Tags**: Select tags like "Perfect for Birthday"
5. Click **Create Product**

### Approve the Product:
1. Go back to **Products** list
2. You'll see your product with **DRAFT** status
3. Click the **green checkmark** icon to approve
4. Status changes to **LIVE**

### See It Live:
1. Click **Home** in the top menu
2. Your product should appear on the homepage!
3. Click on it to see the full details

**🚀 Your first product is live!**

---

## Common Questions

### Q: Can my mom/sister add products?
**A:** Yes! They need to:
1. Register on the website
2. You (admin) change their role to `staff` in Supabase
3. They can now add products, but YOU must approve them before they go live

### Q: How do customers order?
**A:** When they click "Buy on WhatsApp", it opens WhatsApp with a pre-filled message containing product details. You confirm and arrange delivery on WhatsApp. **No online payment needed!**

### Q: Can I change the phone number?
**A:** Yes! Open `src/utils/whatsapp.ts` file and change:
```typescript
const WHATSAPP_NUMBER = '9779815888721';  // Change this
```

### Q: How do I add more products?
**A:** Just repeat Step 6! You can add as many products as you want.

### Q: How do I stop the website?
**A:** Press `Ctrl + C` in the terminal where it's running.

### Q: How do I run it again later?
**A:** Open terminal, go to the project folder, and run `npm run dev` again.

---

## What's Next?

Now that your site is running, you should:

1. **Add Real Products**
   - Take good photos of your teddy bears
   - Write detailed descriptions
   - Add attractive prices

2. **Customize Contact Info**
   - Update phone number (in `src/utils/whatsapp.ts`)
   - Update Google Maps link

3. **Add Staff Members**
   - Have them register
   - Change their role to `staff` in Supabase

4. **Deploy to Internet**
   - Follow the **DEPLOYMENT.md** guide
   - Recommended: Use Vercel (it's free and easy!)

5. **Share with Customers**
   - Share the website link
   - Add QR code in your physical shop
   - Share on social media

---

## Need Help?

### Website Not Loading?
- Check that `npm run dev` is still running
- Try closing and opening browser
- Check that .env file has correct Supabase details

### Can't Login as Admin?
- Make sure you changed role to `admin` in Supabase
- Try logging out and logging in again
- Clear browser cookies

### Images Not Uploading?
- Check image size (must be under 5MB)
- Check format (must be JPEG, PNG, or WebP)
- Check internet connection

### Products Not Showing?
- Make sure product status is `LIVE` (not DRAFT)
- Refresh the page
- Check browser console for errors (press F12)

---

## Important Files to Know

- **`.env`** - Your secret keys (never share this!)
- **`src/utils/whatsapp.ts`** - Change phone number here
- **`src/pages/`** - All the website pages
- **`README.md`** - Detailed documentation
- **`DEPLOYMENT.md`** - How to put website online

---

## Tips for Success

1. **Take Good Photos**
   - Use natural light
   - Clean background
   - Multiple angles
   - Upload 4-6 images per product

2. **Write Great Descriptions**
   - Mention size, color, material
   - Who it's perfect for
   - What makes it special

3. **Use Tags Wisely**
   - "Perfect for Birthday" - birthday gifts
   - "Best for Girlfriend" - romantic gifts
   - "Kids Favorite" - children's gifts
   - "New Arrival" - new products
   - "Limited Stock" - creates urgency

4. **Set Attractive Offers**
   - Regular customers love discounts!
   - Show both original and offer price
   - Percentage is calculated automatically

5. **Respond Fast on WhatsApp**
   - Quick responses = more sales
   - Be friendly and helpful
   - Confirm product availability

---

**Congratulations! You now have a professional gift shop website! 🎉**

Start adding products and sharing with customers. Good luck! 🚀
