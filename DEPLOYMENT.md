# Deployment Guide for Nepal Gift House

This guide explains how to deploy the Nepal Gift House website to production.

## Pre-Deployment Checklist

- [ ] Supabase project is set up
- [ ] Database migrations are applied
- [ ] Storage bucket is configured
- [ ] Environment variables are ready
- [ ] At least one admin user is created
- [ ] Test the site locally with `npm run dev`
- [ ] Build succeeds with `npm run build`

## Deployment Options

### Option 1: Vercel (Easiest - Recommended)

**Why Vercel?**
- Free for personal projects
- Automatic deployments from GitHub
- Built-in HTTPS
- Global CDN
- Easy environment variable management
- Perfect for React/Vite projects

**Steps:**

1. **Prepare Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/nepal-gift-house.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Vite settings
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

4. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., nepalgifthouse.com)
   - Update DNS records as instructed
   - HTTPS is automatic

**Update Deployment:**
- Just push to GitHub - Vercel auto-deploys!

---

### Option 2: Netlify

**Why Netlify?**
- Free tier with generous limits
- Easy drag-and-drop deployment
- Custom domains with HTTPS
- Form handling (useful for contact forms)

**Steps:**

1. **Build Your Project**
   ```bash
   npm run build
   ```
   This creates a `dist` folder.

2. **Deploy via Netlify UI**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - OR connect your GitHub repository

3. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Set Up Redirects**
   Create `public/_redirects` file:
   ```
   /*    /index.html   200
   ```
   This ensures React Router works on page refresh.

6. **Custom Domain**
   - Go to Domain Settings
   - Add custom domain
   - Update DNS records
   - HTTPS is automatic

---

### Option 3: Traditional Hosting (cPanel, etc.)

**Suitable for:**
- Shared hosting (like Namecheap, Bluehost)
- VPS with cPanel
- When you already have hosting

**Steps:**

1. **Build Project Locally**
   ```bash
   npm run build
   ```

2. **Upload Files**
   - Use FTP/SFTP or cPanel File Manager
   - Upload entire `dist` folder contents to `public_html` or `www`

3. **Set Environment Variables**

   **Option A: Via .htaccess (Apache)**
   ```apache
   SetEnv VITE_SUPABASE_URL "your_supabase_url"
   SetEnv VITE_SUPABASE_ANON_KEY "your_anon_key"
   ```

   **Option B: Rebuild with hardcoded values** (not recommended for security)
   - Set values in `.env.production`
   - Run `npm run build` again
   - Upload new build

4. **Configure Web Server for SPA**

   **Apache (.htaccess in public_html):**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   **Nginx:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

5. **Enable HTTPS**
   - Use Let's Encrypt (free)
   - Most cPanel hosting has AutoSSL
   - Or use Cloudflare (free SSL proxy)

---

### Option 4: Custom VPS (DigitalOcean, Linode)

**For advanced users who want full control**

1. **Set Up Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install Nginx
   sudo apt install nginx
   ```

2. **Clone and Build**
   ```bash
   git clone your-repo-url
   cd nepal-gift-house
   npm install
   npm run build
   ```

3. **Configure Nginx**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     root /var/www/nepal-gift-house/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. **Set Up SSL**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

5. **Environment Variables**
   - Create `.env.production` with your values
   - Rebuild: `npm run build`

---

## Post-Deployment

### 1. Create Admin User
- Register at `yourdomain.com/login`
- Go to Supabase Dashboard → profiles table
- Change role to `admin`

### 2. Test All Features
- [ ] Homepage loads correctly
- [ ] Products page shows products
- [ ] Product detail page works
- [ ] Gallery loads
- [ ] Contact page displays
- [ ] WhatsApp button works
- [ ] Admin login works
- [ ] Admin can create products
- [ ] Image upload works
- [ ] Approval workflow works

### 3. Update Contact Info
If phone number or Google Maps link changes:
- Edit `src/utils/whatsapp.ts`
- Update contact information
- Rebuild and redeploy

### 4. SEO & Meta Tags
Update `index.html` for better SEO:
```html
<title>Nepal Gift House - Best Teddy Bears & Gifts in Nepal</title>
<meta name="description" content="Shop beautiful teddy bears and gift items at Nepal Gift House. Order via WhatsApp. Visit our physical shop in Nepal.">
```

---

## Troubleshooting

### Issue: Blank Page After Deployment
**Solution:** Check that routing is configured correctly (see .htaccess or nginx config above)

### Issue: Environment Variables Not Working
**Solution:**
- Verify variables are set in deployment platform
- Rebuild the project
- Check browser console for errors

### Issue: Images Not Loading
**Solution:**
- Check Supabase Storage bucket is public
- Verify storage policies are set correctly
- Check image URLs in database

### Issue: WhatsApp Link Not Working
**Solution:**
- Test the phone number format
- Verify the link on mobile device
- Check `src/utils/whatsapp.ts` configuration

### Issue: Can't Access Admin Panel
**Solution:**
- Verify user role is set to 'admin' or 'staff'
- Check authentication state in browser dev tools
- Clear cookies and try logging in again

---

## Updating the Site

### Quick Updates
1. Make changes locally
2. Test with `npm run dev`
3. Push to GitHub (if using Vercel/Netlify)
4. OR build and re-upload (if using traditional hosting)

### Database Changes
- Make changes in Supabase Dashboard
- OR create new migration files
- Test in development first

### Major Updates
1. Create a staging environment
2. Test thoroughly
3. Deploy to production
4. Monitor for errors

---

## Backup Strategy

### Database Backup (Supabase)
- Supabase provides daily backups (Pro plan)
- OR export data manually via SQL Editor

### Code Backup
- Keep code in GitHub (version control)
- Tag releases: `git tag v1.0.0`

### Image Backup
- Download images from Supabase Storage periodically
- OR use automated backup tools

---

## Cost Estimate

**Completely Free Option:**
- Supabase: Free tier (500MB database, 1GB storage)
- Vercel/Netlify: Free tier (hobby projects)
- Total: ₹0/month

**Recommended Production Setup:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month OR Netlify Pro: $19/month
- Custom domain: ~₹1000/year
- Total: ~₹4000/month

**Budget Option:**
- Shared hosting with domain: ₹200-500/month
- Supabase Free tier: ₹0
- Total: ₹200-500/month

---

## Performance Optimization

1. **Enable Caching**
   - Vercel/Netlify handle this automatically
   - For custom hosting, configure caching headers

2. **Image Optimization**
   - Use WebP format where possible
   - Compress images before upload
   - Supabase Storage has auto-optimization

3. **Code Splitting**
   - Already configured with Vite
   - Lazy load routes if needed

4. **CDN**
   - Vercel/Netlify include global CDN
   - For custom hosting, use Cloudflare (free)

---

## Security Checklist

- [x] RLS enabled on all Supabase tables
- [x] Environment variables not committed to Git
- [x] HTTPS enabled (via deployment platform)
- [x] Admin panel requires authentication
- [x] Image uploads restricted to staff/admin
- [ ] Regular security updates: `npm audit`
- [ ] Monitor Supabase logs for suspicious activity

---

## Support & Maintenance

### Regular Tasks
- **Weekly:** Check for product updates from staff
- **Monthly:** Review analytics (if added)
- **Quarterly:** Update dependencies: `npm update`

### Getting Help
1. Check README.md for common issues
2. Check Supabase documentation
3. Check Vercel/Netlify documentation
4. Search GitHub issues

---

## Next Steps

After successful deployment:

1. **Add Content**
   - Upload real product photos
   - Add detailed descriptions
   - Create featured items

2. **Marketing**
   - Share the website link
   - Add to Google My Business
   - Share on social media
   - Print QR code for physical shop

3. **Monitor**
   - Check Supabase usage
   - Monitor deployment platform usage
   - Gather customer feedback

4. **Future Enhancements** (optional)
   - Add customer reviews
   - Add wishlist feature
   - Add email notifications
   - Add analytics (Google Analytics)

---

Good luck with your deployment! 🚀
