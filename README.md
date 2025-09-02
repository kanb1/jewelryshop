# JewelryShop – Fullstack E-commerce App

A fullstack e-commerce web application.  
The platform allows users to browse jewelry, create an account, log in, add items to their cart, and complete a checkout flow.  
It has been extended to support buying and selling **pre-owned jewelry** for a more sustainable future 🩵

👉 **Live demo**: https://jewelryshop-two.vercel.app/

---

## Features

- **Authentication** with JWT (signup/login/logout)
- **Product management (CRUD)** – users can view/filter products, admins can add/delete
- **Favorites** and user profile
- **Cart + Checkout flow** (Stripe integration)
- **Security**:
  - Input validation (manual + backend)
  - Password hashing (bcrypt)
  - Rate limiting
  - Helmet & CORS
  - Dependency security with Dependabot
- **Frontend**:
  - Built with React + TypeScript
  - Styled with Chakra UI
  - Responsive design
  - Reusable components
- **Deployment**:
  - Frontend hosted on **Vercel**
  - Backend hosted on **Render**
  - MongoDB Atlas as database

---

## Tech Stack

**Frontend**

- React (TypeScript)
- Chakra UI

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt

---

## What I Learned

- Building a fullstack application with **MERN + TypeScript**
- Integrating **Stripe** and designing a user-friendly checkout flow
- Structuring code in both frontend (hooks, components) and backend (controllers, middleware)
- Implementing **security best practices** (JWT, hashing, validation, CORS, Helmet, rate limiting)
- Deploying apps in the cloud (**Vercel + Render**) and connecting frontend ↔ backend
- Creating a professional, responsive UI with **Chakra UI** and TypeScript
