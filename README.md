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
