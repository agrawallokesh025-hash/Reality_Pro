# Realty Pro Environment Variables Guide

This document lists all environment variables required or supported by the **Realty Pro** application for production deployment.

---

## 🔑 Core API Configurations

### 1. `NEXT_PUBLIC_SUPABASE_URL`
* **Requirement**: **Required**
* **Scope**: Client & Server (prefixed with `NEXT_PUBLIC_` for browser access)
* **Description**: The unique API URL for your Supabase project instance. Used to configure the Supabase JS client and server middleware integrations.
* **Retrieval**: Supabase Dashboard ➔ Project Settings ➔ API ➔ Project URL
* **Example**: `https://abcdefghijklmnopqr.supabase.co`

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* **Requirement**: **Required**
* **Scope**: Client & Server (prefixed with `NEXT_PUBLIC_` for browser access)
* **Description**: The public anonymous API key for your Supabase project. Used to authenticate requests under Row-Level Security (RLS) policies.
* **Retrieval**: Supabase Dashboard ➔ Project Settings ➔ API ➔ Project API Keys ➔ `anon` / `public`
* **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2Mzk4NzIsImV4cCI6MjAzNDE5OTg3Mn0.your-signature-here`

---

## 🌐 Site Context & Routing

### 3. `NEXT_PUBLIC_SITE_URL`
* **Requirement**: **Optional** (Defaults to `https://realtypro.com` or `http://localhost:3000` in code fallback)
* **Scope**: Client & Server
* **Description**: The primary public domain URL of the deployed application. Used to generate:
  * Redirect callback URLs in auth flows (e.g. email confirmations, password resets).
  * XML sitemap URLs in `sitemap.xml`.
  * Canonical URLs for search engines in `robots.txt` and page meta metadata.
* **Example**: `https://realtypro.com`

---

## ✉️ Email Notification System (Resend)

### 4. `RESEND_API_KEY`
* **Requirement**: **Optional** (If omitted, the application will fallback to console log simulation and continue operation without throwing errors)
* **Scope**: Server-side Only (Keep hidden from the client)
* **Description**: The API authentication token from Resend (resend.com) used to send transactional email confirmations for property inquiries and appointment bookings.
* **Retrieval**: Resend Console ➔ API Keys ➔ Create API Key
* **Example**: `re_123456789_abcdefghijklmnopqrstuvwx`

### 5. `RESEND_FROM_EMAIL`
* **Requirement**: **Optional** (Defaults to `"Realty Pro <notifications@realtypro.com>"`)
* **Scope**: Server-side Only
* **Description**: The sender email address for all system-generated emails. Note that this domain must be configured and verified under your Resend account dashboard for successful delivery in production.
* **Example**: `notifications@yourverifieddomain.com` or `Realty Pro <no-reply@yourverifieddomain.com>`
