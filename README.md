# 🧾 Stock Buddy – POS & Inventory Management System

A full-stack POS (Point of Sale) and Inventory Management System built with Next.js, Prisma, PostgreSQL, and Stack Auth.

This application allows small retail businesses to manage products, track sales, handle pay-later transactions, monitor revenue trends, and analyze business performance through a powerful dashboard.

---

## 🚀 Live Demo

🔗 Live URL: https://stock-buddy-by-fahim.vercel.app/  

### 🔑 Demo Credentials

Email: demo@stockbuddy.com  
Password: demo1234

You can use the demo account to explore the system with realistic sales and inventory data (600+ sales from Jan 2026 – Dec 2027).

---

## ✨ Features

### 🛒 POS System
- Cart-based sales processing
- Stock validation before checkout
- Prevent selling more than available stock
- Real-time inventory updates
- Pay-later (credit sales) option
- Mark unpaid sales as paid
- Multiple payment methods:
  - Cash
  - bKash
  - Nagad
  - Rocket
  - Bank Transfer

---

### 📦 Inventory Management
- Add, edit, delete products
- SKU support
- Low stock threshold detection
- Out-of-stock tracking
- Inventory value calculation
- Search and pagination

---

### 📊 Business Dashboard
- Total revenue
- Monthly revenue tracking
- Outstanding dues (credit tracking)
- Inventory value overview
- Revenue chart (6-month trend)
- Payment method breakdown
- Top-selling products panel
- Inventory health (low stock & out of stock)

---

### 🔐 Authentication
- Stack Auth integration
- Email/password authentication
- Google login
- Microsoft login
- Route protection with server-side session validation

---

## 🏗 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS
- Recharts

**Backend**
- Next.js Server Actions
- Prisma ORM
- PostgreSQL

**Authentication**
- Stack Auth

**Other Tools**
- Faker (for demo data seeding)
- TypeScript

---

## 📈 Realistic Demo Data

The demo account includes:
- 40 products
- 600+ sales
- Paid & unpaid transactions
- Payment method distribution
- 2 years of sales history (Jan 2026 – Dec 2027)
- Low stock and out-of-stock scenarios

This allows full testing of analytics and dashboard features.

---

## 🧠 Architecture Overview

- Server Components for data fetching
- Client Components for interactive UI (cart, charts)
- Transaction-based sale creation
- Relational database design:
  - Product → SaleItem → Sale
- Business logic handled on server for integrity

---

## 🛠 Installation (Local Development)

```bash
git clone https://github.com/yourusername/stock-buddy.git
cd stock-buddy
npm install
```

## Set up environment variables in `.env`:

```env
DATABASE_URL=your_database_url
STACK_PROJECT_ID=your_stack_project_id
STACK_SECRET_KEY=your_stack_secret
```

## Run Migrations and Seed Demo Data:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Start the Development Server:

```bash
npm run dev
```

## Author
- [Fahim Shariar](https://fahimshariar.vercel.app/)
- [GitHub](https://github.com/fahimshariar28)
- [LinkedIn](https://www.linkedin.com/in/fahimshariar28/)
- [Portfolio](https://fahimshariar.vercel.app/)
- [Email](mailto:fahimshariar28@gmail.com)
- [Facebook](https://www.facebook.com/fahimshariar28)

## License
This project is for portfolio and educational purposes. Not for commercial use. Please contact the author for any inquiries.

