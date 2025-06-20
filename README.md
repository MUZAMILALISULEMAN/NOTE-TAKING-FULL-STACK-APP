# 💧 RO Water Plant Management System

This is a two-phase project to manage sales and customer data for a local RO water business. It simplifies how account holders, walk-in customers, and dealers are managed — across both offline and online systems.

---

## 🚀 Project Vision

A smart, efficient system that handles daily bottle sales, customer records, and dealer transactions — and scales with time. Offline-first, with optional online syncing.

---

## 📦 Project Structure

### 🖥️ Phase 1: Offline App (with PyQt + MySQL)
- Desktop GUI using **PyQt**
- **MySQL** as local database (instead of SQLite for long-term use)
- Supports:
  - 👤 Walk-in customers
  - 🧾 Account customers (monthly billing)
  - 🧃 Dealers (bulk buyers with discounts)
- Key Features:
  - Dashboard with earnings summary
  - CRUD for customers and sales
  - Month-end billing reports
  - "Upload to server" sync button

---

### 🌐 Phase 2: Online System (Read-Only Dashboard)
- Frontend: HTML + CSS + JS hosted on **Vercel**
- Backend: **FastAPI** with MySQL (hosted on Render)
- Database: Hosted on **FreeMySQLHosting.net**
- Fetches data via **GET API** for readonly reports

---

## ⚙️ Tech Stack

| Layer        | Technology        |
|--------------|-------------------|
| GUI (Offline) | PyQt5             |
| Backend       | FastAPI           |
| Database      | MySQL             |
| Frontend      | HTML, CSS, JS     |
| Hosting       | Render, Vercel    |
| DB Hosting    | freemysqlhosting.net |

---

## 📊 Database Design

- `accounts` – Account customers
- `dealers` – Dealers with bulk pricing
- `sales` – Records of all bottle sales (linked by `customer_type`)
- `monthly_reports` (planned) – Auto-generated summaries

---

## ⏳ Timeline

| Day | Task |
|-----|------|
| Day 1-2 | Design DB, PyQt UI |
| Day 3-4 | Implement CRUD + dashboard |
| Day 5 | Upload-to-server feature |
| Day 6 | FastAPI read-only API |
| Day 7 | Deploy frontend, final polish |

---

## 🧠 Muzzy's Personal Notes

✅ Focus: Execution over theory  
✅ Remember: Simplicity > Overengineering  
✅ Strategy: "Build bit by bit, push daily"  
✅ End Goal: Build reliable, user-friendly software for real-world use

---

## 🔥 GitHub Streak Motivation

Keep pushing. Even a single commit counts.  
You're not just building an app — you're building discipline.

> “Consistency is harder when no one is clapping for you. Clap for your damn self.” 👏

---

## 📍 Next Steps

- [ ] Finalize DB constraints
- [ ] Code PyQt layout
- [ ] Write FastAPI routes
- [ ] Connect frontend + backend
- [ ] Test monthly report automation

---

## 👨‍💻 Author

**Muzzy** – Uni Software Dev | Focused, Emotional, Hungry for Growth  
“Radical Summer Execution Project ☀️”

---

