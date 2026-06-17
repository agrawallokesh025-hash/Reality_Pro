# Realty Pro Production Deployment Guide

This guide details the procedure for deploying the **Realty Pro** Next.js web application to a production hosting provider (e.g. Vercel) and establishing a secure database connection.

---

## 🛠️ Step 1: Database Migration
Before deploying the code, you must execute the database migrations on your remote Supabase database instance.

1. Navigate to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: `octdlzzsvomgrbleqtpx`.
3. Open the **SQL Editor** from the left navigation bar.
4. Click **New Query**.
5. Copy the contents of [0002_production_tables.sql](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/realty-pro/supabase/migrations/0002_production_tables.sql) and paste them into the SQL Editor.
6. Click **Run**. Verify that the query executes successfully with no errors.

---

## 🚀 Step 2: Deploying to Vercel (Recommended)
Vercel provides the native environment for Next.js applications, offering edge routing, serverless function optimization, and global CDN delivery out of the box.

### Method A: Deploy via GitHub (Vercel Git Integration)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Sign in to your [Vercel Account](https://vercel.com).
3. Click **Add New...** > **Project**.
4. Import your repository.
5. In the **Configure Project** window:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or select the subdirectory if not at root)
6. Expand **Environment Variables** and add the required variables (see below).
7. Click **Deploy**.

### Method B: Deploy via Vercel CLI
If you prefer command-line deployment:
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.production.local
vercel --prod
```

---

## 🔑 Step 3: Production Environment Variables
Configure the following environment variables in your hosting provider's dashboard:

| Variable Name | Description | Example Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Remote Supabase project API URL | `https://octdlzzsvomgrbleqtpx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Client Anonymous API key | `eyJhbGciOiJIUzI1NiIsInR5...` |
| `RESEND_API_KEY` | Resend SMTP API Key for email dispatches | `re_123456789...` |
| `RESEND_FROM_EMAIL` | Verified sender email address | `notifications@yourdomain.com` |
| `NEXT_PUBLIC_SITE_URL` | Public production domain name | `https://realtypro.vercel.app` |

---

## 🔒 Step 4: Security Posture Check
1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is **never** exposed to the client or checked into git.
2. Verify that Row-Level Security (RLS) is active on all tables.
3. Confirm SSL is enforced on all API requests.
