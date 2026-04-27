# AI Health Risk Predictor 🚀

A premium, portfolio-ready full-stack application built with **React.js**, **Pure Node.js** (no Express), and **MongoDB**.

## ✨ Features
- **Modern Dashboard**: Real-time analytics and risk trend visualization.
- **AI Assessment**: Rule-based prediction engine for cardiovascular health.
- **Custom Auth**: JWT-based authentication (Signup/Login) stored in MongoDB.
- **Glassmorphism UI**: High-end SaaS aesthetic with Tailwind CSS & Framer Motion.
- **History Tracking**: All assessments stored securely in MongoDB.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Framer Motion.
- **Backend**: Pure Node.js (`http` module), JWT, Bcrypt.
- **Database**: MongoDB.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 2. Environment Setup
Create a `.env` file in the `/server` directory:
```env
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Installation
```bash
# Install all dependencies (Root, Client, Server)
npm run install:all
```

### 4. Run Locally
```bash
# Start both Frontend and Backend
npm start
```

## 📂 Project Structure
- `/client`: React application (Vite).
- `/server`: Pure Node.js backend with MongoDB integration.
- `package.json`: Unified script management.

---
*Note: This project is designed for internship portfolios to demonstrate full-stack integration, UI/UX skills, and database management without relying on heavy frameworks.*
