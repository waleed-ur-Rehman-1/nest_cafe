# `README.md` — for the root of your repo

Save this as **`nust-cafe/README.md`** (at the same level as `server/` and `client/`).

```markdown
# 🍔 NUST Café — Online Food Ordering & Restaurant Management

A complete MERN-stack food ordering system with a customer website and four role-based dashboards (Admin, Kitchen, Delivery, Pickup). Live order tracking with an OpenStreetMap rider map. KFC / McDonald's Pakistan–style ordering experience, themed in green.

![MERN](https://img.shields.io/badge/Stack-MERN-15803D?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-C62828?style=flat-square)

---

## 📸 Preview

> Screenshots go here once deployed — replace the URLs below.

| Customer Home | Menu | Live Tracking |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

| Admin Dashboard | Kitchen | Delivery |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## ✨ Features

### Customer Website
- 🏠 **Home** — hero banner, featured items, bestsellers, category grid
- 📋 **Menu** — 11 categories, ~48 products with photos, prices, descriptions
- 🔍 **Search & Filters** — instant search, category filter pills
- 🎨 **Product Customization** — size, toppings, sauces, patty add-ons, quantities, special instructions
- 🛒 **Cart** — persists on page refresh (localStorage)
- 💳 **Checkout** — delivery or pickup, address, optional GPS capture, coupon codes, 5 payment methods
- 🎟️ **Coupons** — server-validated (pre-loaded: `WELCOME10`, `NUST200`, `FREESHIP`)
- 🗺️ **Live Order Tracking** — tracking number lookup, status timeline, **rider moving on live map**
- 📦 **My Orders** — full history, one-click re-track
- 👤 **My Account** — profile editing

### Admin Dashboard
- 📊 **Overview** — live stats: total/today orders, revenue, pending, preparing, completed, customers, top-5 bestsellers
- 🍟 **Products** — full CRUD with price, discount, image, category, availability, featured, bestseller flags
- 📋 **Orders** — view all, filter by status, change status through full lifecycle
- 👥 **Customers** — view all, block / unblock
- 🎁 **Promotions** — create & delete coupons (percent, fixed, free delivery)

### Operational Dashboards
- 👨‍🍳 **Kitchen** — auto-refreshing queue → Start Preparing → Mark Ready
- 🛵 **Delivery** — Picked Up → Delivered, real GPS share, **Simulate Ride** for live map demo
- 🏪 **Pickup** — auto-refreshing list → Mark Collected

### Security
- JWT authentication (7-day expiry) with role-based access control on **client + server**
- bcrypt password hashing
- Server-side price recalculation — clients cannot tamper with order totals
- Order status transition validation (can't mark delivered before dispatched)
- Unique order numbers, no duplicate processing

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · Vite 5 · Tailwind CSS 3 · React Router 6 · React Hot Toast · Leaflet |
| **Backend** | Node.js · Express 4 |
| **Database** | MongoDB (local or MongoDB Atlas) · Mongoose 8 |
| **Auth** | JWT · bcryptjs |
| **Maps** | OpenStreetMap via Leaflet (no API key required) |
| **Images** | External URLs (Cloudinary-ready) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **MongoDB** — local install or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A code editor (VS Code recommended)

### 1. Clone the repository

```bash
git clone https://github.com/waleed-ur-Rehman-1/nest_cafe.git
cd nest_cafe
```

### 2. Start the backend

```bash
cd server
npm install
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm run seed              # seeds 48 products, categories, users, coupons
npm run dev               # http://localhost:5000
```

### 3. Start the frontend

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

Open **http://localhost:5173** in any browser.

### `.env` (server folder)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nustcafe
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

---

## 👥 Demo Accounts

Seeded automatically by `npm run seed`.

| Role | Email | Password | Landing Page |
|---|---|---|---|
| Customer | `customer@nustcafe.pk` | `customer123` | `/menu` |
| Admin | `admin@nustcafe.pk` | `admin123` | `/admin` |
| Kitchen | `kitchen@nustcafe.pk` | `kitchen123` | `/kitchen` |
| Delivery | `delivery@nustcafe.pk` | `delivery123` | `/delivery` |
| Pickup | `pickup@nustcafe.pk` | `pickup123` | `/pickup` |

> ⚠️ **Change all passwords before going to production.** These are for demo only.

---

## 🎬 End-to-End Demo (5 minutes)

1. **Login as customer** → browse menu → customize a Zinger Burger → add to cart → checkout
2. Choose **Delivery** → fill in address → click **📍 Use my current location**
3. Apply `WELCOME10` → choose Cash on Delivery → **Place Order** — note the tracking number (`NCxxxxxxxxxx`)
4. **Login as admin** → `/admin/orders` → set status to **accepted**
5. **Login as kitchen** → `/kitchen` → **Start Preparing** → **Mark Ready**
6. **Login as delivery** → `/delivery` → **Picked Up** → click **Simulate Ride**
7. **Switch to the customer tracking page** → watch the 🛵 move toward the 🏠 on the live map
8. Delivery marks **Delivered** — customer tracking updates, admin stats refresh

One flow exercises auth, RBAC, menu, cart, customization, coupons, checkout, three dashboards, and live tracking.

---

## 📁 Project Structure

```
nest_cafe/
├── server/                    # Backend API
│   ├── models/                # Mongoose schemas (User, Product, Order, Payment, Promotion)
│   ├── routes/                # REST endpoints (auth, products, orders, payments, admin)
│   ├── middleware/            # JWT auth, error handling
│   ├── config/                # Database connection
│   ├── seed.js                # Database seeding script
│   ├── .env.example           # Environment template
│   └── server.js              # App entry point
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/               # Axios with JWT interceptor
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── components/        # Navbar, Footer, ProductCard, ProtectedRoute
│   │   └── pages/
│   │       ├── Home, Menu, Deals, ProductDetail
│   │       ├── Cart, Checkout, Login, Register
│   │       ├── Account, MyOrders, OrderSuccess, TrackOrder
│   │       ├── Kitchen, Delivery, Pickup
│   │       └── admin/         # AdminDashboard, AdminProducts, AdminOrders,
│   │                          # AdminCustomers, AdminPromotions
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/                      # SRS, handoff PDFs (optional)
├── .gitignore
└── README.md
```

---

## 🔌 API Overview

| Group | Endpoints |
|---|---|
| **Auth** | `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me` · `PUT /api/auth/profile` |
| **Products** | `GET /api/products` · `GET /api/products/:id` · `POST/PUT/DELETE /api/products` (admin) |
| **Categories** | `GET /api/categories` · `POST/PUT/DELETE` (admin) |
| **Orders** | `POST /api/orders` · `GET /api/orders/my-orders` · `GET /api/orders/track/:orderNumber` · `GET /api/orders/:id` · `POST /api/orders/:id/cancel` |
| **Payments** | `POST /api/payments/initialize` · `POST /api/payments/verify` |
| **Promotions** | `GET /api/promotions` · `POST /api/promotions/validate` |
| **Admin** | `GET /api/admin/dashboard` · `/api/admin/orders` · `/api/admin/orders/:id/status` · `/api/admin/orders/:id/assign` · `/api/admin/orders/:id/location` · `/api/admin/customers` · `/api/admin/staff` · `/api/admin/promotions` |

All admin endpoints enforce server-side role checks.

---

## 🧪 What's Included vs Simulated

| ✅ Fully Working | ⚠️ Simulated (needs merchant accounts) |
|---|---|
| All ordering, cart, checkout, tracking | Easypaisa / JazzCash / Card payments |
| All 4 dashboards | (Drop-in replaceable in `server/routes/payments.js`) |
| Coupons, RBAC, product customization | |
| Live rider tracking with GPS + map | |

### ❌ Not included in v1.0 (planned for future)
- OTP phone verification, email verification
- Password reset UI (backend endpoint exists)
- Cloudinary image uploads (admin pastes image URLs)
- Inventory, expenses, refunds, PDF/Excel report exports
- Staff management UI (backend endpoints exist)
- Multi-branch support, loyalty points, mobile apps

---

## 🌐 Deployment Checklist

1. Provision a VPS (Hostinger / DigitalOcean / AWS Lightsail)
2. Create a MongoDB Atlas cluster (free tier works)
3. Point a domain name to the server, get an SSL cert (Let's Encrypt)
4. Backend: `pm2 start server.js` behind nginx
5. Frontend: `npm run build` and serve `dist/` as static files via nginx
6. **Change every demo password** and every secret in `.env`
7. Register Easypaisa / JazzCash merchants and update `payments.js` (1–3 week lead time)
8. Set up daily MongoDB backups
9. Run the acceptance checklist (below)

Estimated time to live: **1–2 days** with Cash only, **2–3 weeks** if online payment onboarding is required.

---

## ✅ Acceptance Checklist

- [ ] Customer can register, log in, log out
- [ ] All categories and products visible on the menu
- [ ] Product customization recalculates price correctly
- [ ] Cart persists on refresh
- [ ] Delivery order placed successfully
- [ ] Pickup order placed successfully
- [ ] Coupon `WELCOME10` reduces total by 10%
- [ ] COD order reaches admin dashboard
- [ ] Simulated online payment completes (success + failure both tested)
- [ ] Order confirmation shows tracking number
- [ ] Track page shows status timeline
- [ ] Kitchen: Preparing → Ready works
- [ ] Delivery: Picked Up → Delivered works
- [ ] Live rider map updates as location changes
- [ ] Pickup: Mark Collected works
- [ ] Admin can CRUD products
- [ ] Admin can block/unblock customers
- [ ] Admin can create coupons
- [ ] Role-based access enforced on all dashboards
- [ ] Responsive on mobile, tablet, desktop

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection failed` | Ensure MongoDB is running (`mongod`) or Atlas URI is correct |
| `Cannot GET /api/...` | Backend not started — check terminal 1 |
| `Network Error` on frontend | Backend not on port 5000, or proxy in `vite.config.js` broken |
| `Failed to resolve import` | Missing file — check path, check for `.jsx.txt` extension |
| `EADDRINUSE` | Kill port 5000: `taskkill /F /IM node.exe` (Windows) |
| Login fails with correct password | Run `npm run seed` again to recreate demo users |
| Map doesn't show | `leaflet/dist/leaflet.css` missing from `main.jsx` |

---

## 📄 License

**Proprietary** — NUST Café. All rights reserved. Not for redistribution without written permission.

---

## 👤 Author

**Waleed ur Rehman**
- GitHub: [@waleed-ur-Rehman-1](https://github.com/waleed-ur-Rehman-1)
- Email: *(add yours)*

---

## 🙏 Acknowledgements

- Design inspired by KFC Pakistan and McDonald's Pakistan (no proprietary assets copied)
- Icons by Tailwind CSS defaults
- Maps by [OpenStreetMap](https://www.openstreetmap.org) contributors
- Product photos: [Unsplash](https://unsplash.com)
```

---

## How to add and push it

From `C:\Users\waleed\Desktop\nust cafe`:

```powershell
# 1. Create README.md — paste the content above into VS Code
# File → New File → Save as README.md in the project root

# 2. (Optional but recommended) add .env.example so the repo is runnable
# Create server/.env.example with:
#   PORT=5000
#   MONGO_URI=mongodb://127.0.0.1:27017/nustcafe
#   JWT_SECRET=replace_with_a_long_random_string
#   CLIENT_URL=http://localhost:5173

git add README.md server/.env.example
git commit -m "Add README and env example"
git push
```

GitHub will render the README automatically on the repo landing page — badges, tables, checklists, everything. That's what your client will see first.
