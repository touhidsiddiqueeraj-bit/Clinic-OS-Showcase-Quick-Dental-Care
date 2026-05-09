# Quick Dental Care — Sylhet

> **Portfolio showcase only.** See [License](#license) before using any part of this project.

A full-stack dental clinic web application built for **Quick Dental Care**, Akhalia, Sylhet, Bangladesh. Built as a single-file progressive web app that evolved into a production-grade system with a server-side PHP proxy, Google Apps Script backend, and WhatsApp integration.

---

## Live Site

🌐 [sylhetdental.com](https://sylhetdental.com)

---

## What This Is

A bespoke dental clinic platform — not a template or framework. Every feature was designed specifically for the workflows of a Bangladeshi dental practice.

**Public-facing:**
- Animated hero with canvas-rendered dental procedure illustrations (RCT, extraction, zirconia crown, implant, scaling, aligners)
- AI chatbot ("Alisha") powered by Gemini 2.5 Flash with streaming responses, bilingual EN/BN support, and live appointment booking
- Services, pricing, doctor profiles, FAQ, location, opening hours
- Mobile-first with a custom bottom tab bar, no hamburger menu

**Patient portal:**
- Phone-based login
- View appointments, prescriptions, X-rays, treatment plans
- Download records, 3D scan viewer (STL/OBJ/GLB)

**Staff dashboard (RBAC — 4 roles: admin / manager / doctor / receptionist):**
- Appointment calendar with queue management
- Patient records, clinical notes, perio charting
- Invoice & billing with bKash/Nagad support
- Inventory management with low-stock alerts
- Lab work tracker
- WhatsApp inbox (Green-API) with reply-from-dashboard
- Clinical photography (before/after)
- Staff message board
- Analytics & revenue reports
- Data management panel

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS — no framework, no build step |
| Fonts | Cormorant Garamond + Jost (Google Fonts) |
| Animations | Canvas 2D API (custom dental illustrations) |
| AI Chatbot | Google Gemini 2.5 Flash Lite (streaming SSE) |
| Backend | Google Apps Script (GAS) Web App |
| Database | Google Sheets (via GAS) |
| File Storage | Google Drive |
| WhatsApp | Green-API |
| Proxy | PHP 8+ (rate limiting, HMAC auth, secret management) |
| Hosting | Any PHP host / cPanel |
| SEO | Schema.org Dentist + WebSite + BreadcrumbList structured data |
| i18n | Bengali / English toggle |

---

## Architecture

```
Browser
  │
  ├── Public routes (chatbot, appointment form)
  │     └──▶ /proxy/proxy.php ──▶ Google Apps Script
  │                           └──▶ Green-API (WhatsApp)
  │
  └── Staff routes (RBAC, HMAC-signed sessions)
        └──▶ /proxy/proxy.php ──▶ Google Apps Script
                              └──▶ Green-API
                              └──▶ Gemini API (via GAS key store)
```

All credentials live exclusively in `proxy/config.php` (server-side). The browser never receives API keys or tokens.

---

## Security Model

- **No secrets in frontend** — GAS URL, Green-API token, Gemini key, Sheet/Drive IDs all server-side only
- **HMAC-signed staff sessions** — `sha256(staffId:session, proxySecret)`
- **Per-route rate limiting** — file-based (swappable for Redis), configurable per IP
- **CORS allowlist** — explicit origin whitelist, not `*`
- **RBAC** — four roles enforced both client-side (UI) and server-side (GAS)
- **HIPAA-style idle timeout** — auto-logout after inactivity with 1-minute warning

---

## Key Features Deep-Dive

### Gemini Chatbot (Alisha)
- Streams tokens via SSE for instant feel
- Smart context injection — only sends relevant context chunks (pricing, staff, FAQ) based on intent detection
- Appointment booking flow: collects name, phone, date, reason → writes to Sheets → sends WA confirmation
- Bilingual: detects Bengali vs English mid-conversation
- Google Review link shared when patient praises the clinic

### Canvas Dental Illustrations
Six fully animated, original dental procedure illustrations rendered with the Canvas 2D API:
- Root Canal Treatment (NiTi file animation, irrigation droplets, pulp glow)
- Surgical Extraction (forceps grip animation, bone dust particles)
- Zirconia Crown (CAD/CAM crown descent, shimmer, sparkles)
- Dental Implant (osseointegration pulse, titanium screw threads)
- Scaling & Polishing (ultrasonic tip vibration, water spray)
- Clear Aligners (tray seating animation)

### Staff Dashboard
Built as a multi-panel SPA within the same HTML file. Panels lazy-load data on first open. Real-time WhatsApp inbox polls Green-API. Perio charting renders a full 32-tooth chart with pocket depths, bleeding scores, mobility, and furcation — printable.

---

## What's Not Included

This repository contains the **frontend and proxy layer only**. The Google Apps Script backend (the actual database logic) is not published. You cannot run this project without:

1. A Google Apps Script deployment with the matching API surface
2. A Green-API WhatsApp instance
3. A Gemini API key (stored as a GAS Script Property)
4. `proxy/config.php` with your credentials

---

## Screenshots

> *(Add your own screenshots here)*

| Public Site | Staff Dashboard | Chatbot |
|-------------|----------------|---------|
| ![hero]()   | ![staff]()     | ![chat]()|

---

## License

**© 2025 Quick Dental Care, Akhalia, Sylhet, Bangladesh.**

This project is licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).

- ✅ You may view and share this code for reference
- ❌ You may not use it commercially
- ❌ You may not adapt or redistribute modified versions
- ❌ You may not deploy it as your own product

See [`LICENSE`](./LICENSE) for full terms.

---

## Contact

**Quick Dental Care** · Akhalia, Sylhet, Bangladesh  
📞 +88 01307978439  
🌐 [sylhetdental.com](https://sylhetdental.com)  
📘 [facebook.com/quickdentals](https://www.facebook.com/quickdentals)
