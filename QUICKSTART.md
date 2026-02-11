# 🎉 Setup Complete! Quick Start Guide

## ✅ What's Working

Your VentureMond Leads Hub is now fully integrated with MongoDB! Here's what's been set up:

### 1. **MongoDB Connection** ✅
- Connected to your MongoDB database: `venturemond`
- Collection: `contacts`
- Successfully tested - found 1 lead in your database

### 2. **API Server** ✅
- Running on `http://localhost:3000`
- Endpoints:
  - `GET /api/leads` - Fetch all leads
  - `PATCH /api/leads` - Update lead status
  - `GET /api/health` - Health check

### 3. **Frontend Integration** ✅
- React Query for data fetching
- Optimistic updates
- Toast notifications
- Auto-refresh every 30 seconds

---

## 🚀 How to Run Locally

### Option 1: Run Everything Together (Recommended)

```bash
npm run dev:full
```

This runs:
- Frontend on `http://localhost:5173`
- API server on `http://localhost:3000`

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - API Server:**
```bash
npm run dev:api
```

---

## 🧪 Test the Setup

### 1. Test API Directly

Open `api-test.html` in your browser:
```bash
# Just double-click the file or open it in a browser
start api-test.html
```

Click the buttons to test:
- **GET /api/leads** - Should show your contact from MongoDB
- **GET /api/health** - Should show API status

### 2. Test the Dashboard

1. Open `http://localhost:5173` in your browser
2. Login with:
   - **Email:** `admin@venturemond.com`
   - **Password:** `admin123`
3. You should see your lead from MongoDB!

---

## 📊 Current Data

Your MongoDB database has **1 contact**:

```json
{
  "name": "kalyan",
  "email": "kalyangk18@gmail.com",
  "company": "GK Groups",
  "service": "AI Automation",
  "division": "Venturemond Services — Build production systems",
  "description": "see",
  "status": "new",
  "submittedAt": "2026-02-10T15:51:36.045Z"
}
```

---

## 🔧 Troubleshooting

### API Server Not Starting?

Check if port 3000 is already in use:
```bash
# Windows
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <process_id> /F
```

### Frontend Not Connecting to API?

1. Make sure API server is running on port 3000
2. Check browser console for CORS errors
3. Verify `.env.local` has: `VITE_API_URL=http://localhost:3000/api`

### MongoDB Connection Issues?

1. Check your `.env.local` file has the correct `MONGODB_URI`
2. Verify MongoDB Atlas allows your IP address
3. Run the test: `npx tsx test-connection.ts`

---

## 📝 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (MongoDB URI, API URL) |
| `server.ts` | Local development API server |
| `api/leads.ts` | Serverless API endpoint (for Vercel) |
| `src/hooks/useLeads.ts` | React hook for fetching/updating leads |
| `src/services/api.ts` | API service layer |

---

## 🚀 Deploy to Vercel

When you're ready to deploy:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add MongoDB integration"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variable:
     ```
     MONGODB_URI=mongodb://kalyanguraka7_db_user:QBxs3rYxTR5D0LTD@ac-ghnoq6a-shard-00-00.hytigun.mongodb.net:27017,ac-ghnoq6a-shard-00-01.hytigun.mongodb.net:27017,ac-ghnoq6a-shard-00-02.hytigun.mongodb.net:27017/venturemond?ssl=true&authSource=admin&retryWrites=true&w=majority
     ```
   - Click Deploy!

3. **See detailed guide:** Check `DEPLOYMENT.md`

---

## 🎯 Next Steps

### Immediate:
1. ✅ Test the API with `api-test.html`
2. ✅ Test the dashboard at `http://localhost:5173`
3. ✅ Add more test leads from your website contact form

### Before Production:
1. 🔐 Implement proper authentication (replace hardcoded credentials)
2. 🔒 Add rate limiting to API endpoints
3. 📧 Set up email notifications for new leads
4. 🎨 Customize the dashboard branding/colors

### Optional Enhancements:
- Add lead assignment to team members
- Email integration (send emails from dashboard)
- Advanced analytics and reporting
- Export to other formats (Excel, PDF)

---

## 📚 Documentation

- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **api-test.html** - API testing tool

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the browser console (F12)
2. Check the API server terminal output
3. Run the connection test: `npx tsx test-connection.ts`
4. Review the logs in the terminal

---

## 🎊 You're All Set!

Your dashboard is now connected to MongoDB and ready to display real contact form submissions!

**Quick command to start everything:**
```bash
npm run dev:full
```

Then open `http://localhost:5173` and login! 🚀

---

**Built with ❤️ for VentureMond**
