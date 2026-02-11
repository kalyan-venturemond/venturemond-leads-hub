# VentureMond Leads Hub 📊

A beautiful, fast dashboard for managing contact form submissions from venturemond.com. Built with React, TypeScript, and MongoDB.

## Features ✨

- 📋 **View All Leads** - See all contact form submissions in a clean table
- 🔍 **Search & Filter** - Search by name, email, company; filter by service type and status
- 📊 **Real-time Stats** - Track total leads, new leads, and top services
- 🎯 **Status Management** - Update lead status (New → Contacted → Qualified → Closed)
- 📥 **CSV Export** - Export filtered leads to CSV
- 🔐 **Secure Authentication** - Login required for access
- ⚡ **Serverless Architecture** - Deployed on Vercel with MongoDB Atlas

## Tech Stack 🛠️

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## Project Structure 📁

```
venturemond-leads-hub/
├── api/                    # Serverless API functions (Vercel)
│   ├── lib/
│   │   └── mongodb.ts     # MongoDB connection utility
│   └── leads.ts           # Leads API endpoint
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   └── types/             # TypeScript types
├── server.ts              # Local development API server
├── .env.local             # Environment variables (not in git)
└── vercel.json            # Vercel configuration
```

## Getting Started 🚀

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd venturemond-leads-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Run the development server**
   
   You have two options:
   
   **Option A: Frontend only (uses mock data)**
   ```bash
   npm run dev
   ```
   
   **Option B: Frontend + API server (uses real MongoDB data)**
   ```bash
   npm run dev:full
   ```
   
   This runs both the Vite dev server (port 5173) and the API server (port 3000).

5. **Open the app**
   
   Navigate to `http://localhost:5173`
   
   **Default login credentials:**
   - Email: `admin@venturemond.com`
   - Password: `admin123`

## MongoDB Schema 📝

The `contacts` collection in MongoDB has the following structure:

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone?: string,
  company?: string,
  service?: string,          // e.g., "Web Development", "Branding"
  division?: string,         // e.g., "Startup", "Enterprise"
  budget?: string,           // e.g., "$5k - $10k"
  timeline?: string,         // e.g., "1-2 months"
  description?: string,      // Main project description
  otherDescription?: string, // Additional notes
  status?: string,           // "New" | "Contacted" | "Qualified" | "Closed"
  createdAt?: string,        // ISO date string
  updatedAt?: Date           // Added when status is updated
}
```

## Deployment to Vercel 🚀

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Step 4: Update Production API URL

After deployment, update your `.env.local` for production:

```env
VITE_API_URL=https://your-app.vercel.app/api
```

Or better yet, use Vercel's environment variables:

In Vercel → Settings → Environment Variables:
```
VITE_API_URL=/api
```

### Step 5: Deploy

Click "Deploy" and Vercel will:
- Build your frontend
- Deploy serverless functions from the `/api` folder
- Serve everything from a single domain

## API Endpoints 🔌

### GET /api/leads
Fetch all leads from MongoDB

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Acme Inc",
      "service": "Web Development",
      "status": "New",
      "createdAt": "2026-02-11T06:00:00.000Z",
      ...
    }
  ]
}
```

### PATCH /api/leads
Update lead status

**Request:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "status": "Contacted"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead status updated"
}
```

## Authentication 🔐

Currently uses simple localStorage-based authentication with hardcoded credentials:
- Email: `admin@venturemond.com`
- Password: `admin123`

**⚠️ For Production:** Replace with a proper authentication system like:
- NextAuth.js
- Auth0
- Firebase Authentication
- Custom JWT-based auth

## Features Roadmap 🗺️

- [ ] Advanced filtering (date range, budget range)
- [ ] Lead assignment to team members
- [ ] Email integration (send emails from dashboard)
- [ ] Notes and activity timeline for each lead
- [ ] Proper authentication with user management
- [ ] Dark mode toggle
- [ ] Email notifications for new leads
- [ ] Analytics and reporting

## Troubleshooting 🔧

### MongoDB Connection Issues

If you see connection errors:
1. Check that your IP is whitelisted in MongoDB Atlas
2. Verify the connection string in `.env.local`
3. Ensure the database name is `venturemond` and collection is `contacts`

### API Not Working Locally

Make sure you're running the full dev stack:
```bash
npm run dev:full
```

This runs both the frontend (port 5173) and API server (port 3000).

### Vercel Deployment Issues

1. Check environment variables are set correctly
2. Ensure `vercel.json` is in the root directory
3. Check Vercel function logs for errors

## Contributing 🤝

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License 📄

Proprietary - VentureMond © 2026

---

**Built with ❤️ by the VentureMond team**
