# 🍽️ Gourmet Delight – Modern Restaurant Website

[![GitHub Repo](https://img.shields.io/badge/GitHub-Frontend--Projects-blue?logo=github)](https://github.com/Shaik-Mohammed-Kaif/Frontend-Projects/tree/main/Gourmet%20Delight)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?logo=webapp)](https://gourmet-delight-dining.lovable.app/)

**Developed by:** S Mohammed Kaif

---

## 📝 Project Overview

Gourmet Delight is a modern, fully-responsive restaurant website built with **React**, **TypeScript**, **Tailwind CSS**, and **shadcn-ui**.
It offers users a premium online dining experience with a beautifully designed landing page, animated hero sections, interactive food menu, reservation system, and smooth animations.

**Live Demo:** [https://gourmet-delight-dining.lovable.app/](https://gourmet-delight-dining.lovable.app/)
**GitHub Repository:** [https://github.com/Shaik-Mohammed-Kaif/Frontend-Projects/tree/main/Gourmet%20Delight](https://github.com/Shaik-Mohammed-Kaif/Frontend-Projects/tree/main/Gourmet%20Delight)

---

## 🚀 Features

### 🌐 Frontend

* Animated hero banner with gradient motion background
* Navigation bar with sections: Home, Menu, About Us, Contact, Reservations
* Menu grid with **food items** (image, name, price)
* Smooth hover effects on menu cards
* Reservation form (Name, Email, Date, Time)
* Fully responsive for mobile and desktop
* Checkout simulation using alert messages

### 🖥️ Backend (Optional)

* Node.js + Express API
* REST API routes:

  * `GET /api/menu` → Returns food items
  * `POST /api/reservations` → Saves reservation
  * `GET /api/reservations` → Admin view of reservations
* MongoDB schemas for menu and reservations

### 🎨 UI/UX

* Professional typography and spacing
* Smooth scroll animations
* Interactive buttons and hover effects
* Slow-motion hero background animation
* Product cards with shadow and zoom-in effects

---

## 🛠️ Technologies Used

* **Frontend:** React.js, TypeScript, Tailwind CSS, shadcn-ui, Framer Motion
* **Backend (Optional):** Node.js, Express.js
* **Database (Optional):** MongoDB / MongoDB Atlas
* **Tools:** Vite, npm, GitHub, Lovable
* **Images:** Unsplash / Pexels free images

---

## 📁 Project Structure

```
Gourmet Delight/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── chocolate-dessert.jpg
│   │   ├── hero-restaurant.jpg
│   │   ├── pasta-dish.jpg
│   │   ├── salmon-dish.jpg
│   │   ├── seafood-platter.jpg
│   │   └── steak-dish.jpg
│   ├── components/
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── MenuSection.tsx
│   │   └── Navigation.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── postcss.config.js
```

---

## ⚡ How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shaik-Mohammed-Kaif/Frontend-Projects.git
cd "Frontend-Projects/Gourmet Delight"
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`

---

## ✨ Contribution Guidelines

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes & test locally
4. Commit changes: `git commit -m "Add feature"`
5. Push branch: `git push origin feature/your-feature`
6. Open Pull Request

---

## 🔗 Live Demo

[https://gourmet-delight-dining.lovable.app/](https://gourmet-delight-dining.lovable.app/)

---

## 📄 License

MIT License © S Mohammed Kaif
