# Cakery - Modern Bakery Website

[![Projects](https://img.shields.io/badge/Projects-1+-orange?style=for-the-badge)](https://github.com/Shaik-Mohammed-Kaif)
[![Cakery](https://img.shields.io/badge/Cakery-BakeryStore-red?style=for-the-badge)](https://cakery-store.lovable.app)

A beautiful, fully responsive modern bakery website built with React and TypeScript, featuring a complete user management system and order processing capabilities.

## 🍰 About Cakery

Cakery is a premium bakery website that showcases freshly baked delights including cakes, pastries, cookies, breads, and custom treats for special occasions. Our mission is to create perfect baked goods for every celebration, made with love and the finest ingredients.

## ✨ Features

### Frontend Features
- **Modern Homepage** with hero section and featured products
- **Interactive Menu** with search, filtering, and categorization
- **User Authentication** - Registration and login system
- **Order Management** - Custom orders for events and celebrations
- **Contact System** - Contact forms and business inquiries
- **Newsletter Subscription** - Stay updated with sweet deals
- **Responsive Design** - Mobile-first approach for all devices

### Product Categories
- 🎂 **Cakes** - Birthday, Wedding, Custom designs
- 🥐 **Pastries** - Croissants, Danish, Muffins
- 🍪 **Cookies** - Chocolate chip, Oatmeal, Custom varieties
- 🍞 **Breads** - Artisan sourdough, Whole wheat, Fresh daily
- 🧁 **Cupcakes** - Festive decorations, Multiple flavors
- 🥪 **Sandwiches** - Fresh ingredients, Daily specials

### Event Specialization
- Birthday Parties
- Weddings
- Office Events
- Anniversaries
- Baby Showers
- Graduations
- Holiday Celebrations

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for modern styling
- **Lucide React** for beautiful icons
- **Vite** for fast development and building

### Backend Simulation
- **localStorage** for data persistence (simulating CSV storage)
- **Client-side data validation**
- **Simulated API calls** with realistic delays

### Design Features
- **Color Palette**: Warm bakery colors (pinks, creams, browns)
- **Typography**: Modern, readable fonts with proper hierarchy
- **Animations**: Smooth hover effects and transitions
- **Micro-interactions**: Enhanced user engagement
- **Professional Images**: High-quality bakery photos from Pexels

## 📁 Project Structure

```
cakery/
├── src/
│   ├── components/
│   │   ├── Homepage.tsx      # Hero section & featured items
│   │   ├── Menu.tsx          # Product catalog with filtering
│   │   ├── Order.tsx         # Order placement system
│   │   ├── Contact.tsx       # Contact forms & info
│   │   ├── Login.tsx         # User authentication
│   │   ├── Register.tsx      # User registration
│   │   ├── Navbar.tsx        # Navigation component
│   │   └── Footer.tsx        # Footer with newsletter
│   ├── data/
│   │   └── products.ts       # Product catalog data
│   ├── types.ts              # TypeScript interfaces
│   └── App.tsx               # Main application
├── csv-structure.md          # Backend data structure
└── README.md                 # This file
```

## 🎨 Design Philosophy

### Apple-Level Aesthetics
- **Attention to Detail**: Every element carefully crafted
- **Clean Interface**: Minimalist design with purposeful elements
- **Intuitive UX**: Natural user flows and interactions
- **Premium Feel**: High-quality visuals and smooth animations

### Color System
- **Primary**: Pink (#EC4899) for main actions
- **Secondary**: Orange (#F97316) for accents
- **Success**: Green (#10B981) for confirmations
- **Neutral**: Grays for text and backgrounds
- **Warm Tones**: Creams and browns for bakery atmosphere

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🍪 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cakery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📊 Data Management

The application uses localStorage to simulate a CSV-based backend system:

### Data Storage
- **Users**: Registration and authentication data
- **Orders**: Customer orders with event details
- **Contacts**: Contact form submissions
- **Newsletter**: Email subscriptions
- **Products**: Bakery item catalog

### CSV Structure
See `csv-structure.md` for detailed information about data models and Java backend implementation notes.

## 🎯 Key Features Implementation

### User Authentication
- Secure registration with password validation
- Login system with error handling
- User session management
- Protected routes for order placement

### Order System
- Product selection with quantity
- Event type categorization
- Customer information capture
- Order confirmation and tracking
- Price calculation with totals

### Search & Filter
- Real-time product search
- Category-based filtering
- Price and availability sorting
- Best sellers highlighting

### Contact Management
- Multiple contact methods
- Form validation and submission
- Business inquiry handling
- Location and hours information

## 📱 Mobile Experience

- **Touch-Optimized**: All interactions work seamlessly on mobile
- **Fast Loading**: Optimized images and code splitting
- **Offline-Ready**: Core functionality works offline
- **App-Like Feel**: Smooth animations and transitions

## 🎉 Special Features

### Newsletter System
- Email subscription management
- Welcome messages for new subscribers
- Integration with contact system

### Event Customization
- Multiple event types supported
- Custom decoration requests
- Special dietary accommodations
- Bulk order capabilities

### Business Features
- Corporate catering options
- Wedding cake specialization
- Custom order consultations
- Wholesale inquiries

## 🔮 Future Enhancements

- **Payment Integration**: Stripe payment processing
- **Real Backend**: Java Spring Boot with MySQL
- **Mobile App**: React Native companion app
- **Admin Panel**: Order management dashboard
- **Inventory System**: Real-time stock tracking
- **Delivery Tracking**: Order status updates

## 🏆 About the Developer

This project showcases modern web development practices and attention to detail in creating production-ready applications. The implementation demonstrates expertise in React, TypeScript, responsive design, and user experience optimization.

---

**Made with ❤️ by the Cakery team**

*"The Perfect Baked Cake Every Day!"*