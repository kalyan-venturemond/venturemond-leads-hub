# Vercel Deployment Guide 🚀

## Quick Deployment Checklist

- [ ] MongoDB Atlas connection string ready
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Environment variables configured

---

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

1. **Whitelist Vercel IPs** (or allow all: `0.0.0.0/0`)
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for serverless)
   - Click "Confirm"

2. **Get Connection String**
   - Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Should look like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### 2. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: VentureMond Leads Hub"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/venturemond-leads-hub.git

# Push
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     Name: MONGODB_URI
     Value: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
     ```
   - Select all environments (Production, Preview, Development)
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - You'll get a URL like: `https://venturemond-leads-hub.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? venturemond-leads-hub
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add MONGODB_URI

# Paste your MongoDB connection string when prompted

# Deploy to production
vercel --prod
```

### 4. Verify Deployment

1. **Visit your app**
   - Go to your Vercel URL
   - You should see the login page

2. **Test login**
   - Email: `admin@venturemond.com`
   - Password: `admin123`

3. **Check API**
   - Open browser DevTools → Network tab
   - Login and check if `/api/leads` is being called
   - Should see leads from your MongoDB database

### 5. Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `leads.venturemond.com`)

2. **Update DNS**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: leads
     Value: cname.vercel-dns.com
     ```

3. **Wait for DNS propagation** (5-30 minutes)

---

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `/api` (uses same domain) |

---

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Locally, run:
npm install
npm run build

# If it works locally, check Vercel build logs
```

**Error: TypeScript errors**
- Check `tsconfig.json` is properly configured
- Ensure all imports are correct

### API Not Working

**Error: Cannot connect to MongoDB**
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify `MONGODB_URI` environment variable is set correctly
- Check Vercel Function logs

**Error: CORS issues**
- API should automatically handle CORS
- Check browser console for specific errors

### Authentication Issues

**Can't login**
- Default credentials: `admin@venturemond.com` / `admin123`
- Check browser localStorage for `vm_auth` key

---

## Post-Deployment

### Update Production API URL

If you want to use a different API URL in production, add to Vercel environment variables:

```
VITE_API_URL=https://your-custom-api.com/api
```

### Monitor Your App

1. **Vercel Analytics**
   - Go to Project → Analytics
   - Enable Web Analytics

2. **Function Logs**
   - Go to Project → Deployments → (select deployment) → Functions
   - View logs for debugging

### Continuous Deployment

Every push to `main` branch will automatically deploy to production!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys!
```

---

## Security Recommendations

### Before Going Live

1. **Change Authentication**
   - Replace hardcoded credentials
   - Implement proper auth (NextAuth, Auth0, etc.)

2. **Secure MongoDB**
   - Use strong passwords
   - Limit IP access if possible
   - Enable MongoDB Atlas encryption

3. **Environment Variables**
   - Never commit `.env.local` to git
   - Use Vercel's encrypted environment variables

4. **Rate Limiting**
   - Consider adding rate limiting to API endpoints
   - Use Vercel's Edge Middleware

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Vite Docs**: https://vitejs.dev

---

**Happy Deploying! 🎉**
