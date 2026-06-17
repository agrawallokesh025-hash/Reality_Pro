# Realty Pro Backup & Monitoring Guide

This document outlines the backup retention policies, logging configurations, and health-check monitoring requirements for the production environment of **Realty Pro**.

---

## 💾 1. Database Backups (Supabase)
Supabase provides automated database backups and restoration workflows depending on your tier:

### Automated Daily Backups (Free & Pro Tiers)
* **Free Tier**: Automated backups are performed daily but are not accessible for self-service restoration. To restore, contact Supabase Support.
* **Pro Tier**: Daily automated backups are retained for 7 days. You can restore your database to any day within this window directly from the dashboard.

### Point-in-Time Recovery (PITR)
* **Configuration**: For high-availability production environments, enable **PITR** in the Supabase Dashboard under **Project Settings** > **Backups**.
* **Recovery**: PITR tracks change logs every second, allowing you to restore the database to the exact second of your choice within your retention period (up to 30 days).

---

## 📈 2. Real-Time Performance Monitoring
Monitoring ensures that server resources (CPU, RAM, API latencies) are in healthy bounds.

### Vercel Analytics (Front-end)
1. Navigate to the **Analytics** tab in Vercel.
2. Enable **Web Vitals** to monitor client-side metrics:
   - **LCP** (Largest Contentful Paint) - Target: < 2.5s
   - **FID** (First Input Delay) - Target: < 100ms
   - **CLS** (Cumulative Layout Shift) - Target: < 0.1
3. Set up **Serverless Function Latency Alerts** to catch execution delays.

### Supabase Metrics (Back-end)
1. Go to **Supabase Dashboard** > **Reports**.
2. Monitor the following system stats:
   - **Database Size**: Track table size to forecast expansion.
   - **Active Connections**: Check pool capacity (default PgBouncer pool limits).
   - **CPU & RAM utilization**: Spot slow-running queries.

---

## 🚨 3. Logging & Audit Trails
* **Email Logs Audit**: Inspect dispatch logs via the `email_logs` table. Only admin accounts have permissions to select entries.
* **Property Views Log**: Tracks impression counters in the `property_views` table for analytics charts.
* **Supabase API Logs**: Check **API Edge Logs** in the Supabase Dashboard to audit all REST calls and authenticate tokens.
