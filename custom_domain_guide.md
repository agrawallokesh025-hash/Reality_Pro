# Realty Pro Custom Domain Configuration Guide

This guide describes how to configure a custom domain name (e.g. `www.realtypro.com`) for the **Realty Pro** web application on Vercel and establish a SSL certificate.

---

## 🌐 Step 1: Add Custom Domain in Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com).
2. Open your deployed **Realty Pro** project.
3. Go to **Settings** > **Domains**.
4. Type your domain name in the text box (e.g., `realtypro.com` or `www.realtypro.com`).
5. Select **Add**.
6. Vercel will recommend adding both the root domain (`realtypro.com`) and the subdomain (`www.realtypro.com`) for SEO optimization and proper redirection. Accept this recommendation.

---

## ⚙️ Step 2: Configure DNS Records
You must update your DNS settings at your domain registrar (e.g., GoDaddy, Namecheap, Google Domains) to route traffic to Vercel.

### Option A: Subdomain configuration (`www.realtypro.com`)
Create a **CNAME** record to point traffic:
* **Type**: `CNAME`
* **Name**: `www`
* **Target**: `cname.vercel-dns.com.`
* **TTL**: `600` (or default)

### Option B: Root domain configuration (`realtypro.com`)
Create an **A** record pointing to Vercel's global IP address:
* **Type**: `A`
* **Name**: `@` (or leave blank)
* **Value**: `76.76.21.21`
* **TTL**: `600` (or default)

---

## 🔒 Step 3: SSL / TLS Provisioning
Once the DNS records are updated at your registrar:
1. Vercel will automatically detect the new DNS records.
2. Vercel will generate and bind a free **Let's Encrypt Wildcard SSL Certificate** for your domain.
3. This process typically completes within 5-15 minutes but can take up to 24 hours depending on global DNS propagation.
4. **Enforced Redirects**: Vercel will automatically redirect HTTP requests to secure HTTPS endpoints.
