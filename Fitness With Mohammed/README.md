# 🏋️‍♂️ GymPro Website

A modern, responsive gym website with a **React frontend** and **Flask backend**, featuring exercise programs, session booking, and trainer information.

**Developer:** S Mohammed Kaif  

[![GitHub](https://img.shields.io/badge/GitHub-Visit-black?style=for-the-badge&logo=github)](https://github.com/Shaik-Mohammed-Kaif/GymPro-Website)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin&style=for-the-badge)](https://www.linkedin.com/in/s-mohammed-kaif-2a500a341/)  
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-green?style=for-the-badge)](https://shaik-mohammed-kaif.github.io/)

---

## 🚀 Live Demo

Check out the live website: [GymPro Demo](https://fitness-with-mohammed.lovable.app/)

---

## ✨ Features

- **Modern Dark Theme** with vibrant orange accents  
- **Responsive Layout** optimized for desktop & mobile  
- **Exercise Catalog** with filtering options  
- **Session Booking** with trainer selection  
- **Professional Trainers** showcase  
- **Smooth Animations** for engaging UI  
- **RESTful API** backend using Flask with CSV data  

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript  
- **Tailwind CSS** for styling  
- **Vite** for fast development  
- **Shadcn/ui** component library  
- **Lucide React** for icons  

### Backend
- **Python Flask**  
- **CSV files** for data storage  
- **Flask-CORS** for cross-origin requests  
- **RESTful API** design  

---

## 📁 Project Structure

```

GymPro-Website/
├── backend/
│   ├── app.py              # Flask application
│   ├── menu.csv            # Exercise data
│   ├── reservations.csv    # Booking data
│   ├── users.csv           # User data
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── components/         # React components
│   ├── types/              # TypeScript types
│   ├── data/               # Mock data
│   └── assets/             # Images and media
└── README.md

````

---

## 🚀 Quick Start

### Frontend (React)

```bash
npm install
npm run dev
````

Open in browser: `http://localhost:8080`

### Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Server runs at: `http://localhost:5000`

---

## 📡 API Endpoints

### Exercises

* `GET /api/exercises` – Get all exercises
* `GET /api/exercises/<id>` – Get specific exercise

### Reservations

* `GET /api/reservations` – Get all reservations
* `POST /api/reservations` – Create new reservation

### Users

* `GET /api/users` – Get all users
* `POST /api/users` – Create new user

### Health Check

* `GET /api/health` – API health status

---

## 📊 Data Schema

### Exercises (`menu.csv`)

```csv
id,exercise_name,duration,calories_burn,description,difficulty
1,Strength Training,45 minutes,350,Build muscle and strength,Intermediate
```

### Reservations (`reservations.csv`)

```csv
id,name,date,time,trainer,session_type,email,phone,created_at
1,John Doe,2024-01-15,09:00,Mike Johnson,Strength Training,john@email.com,+1-555-0123,2024-01-10T10:30:00
```

### Users (`users.csv`)

```csv
id,name,email,membership_type,created_at
1,John Doe,john@email.com,Premium,2024-01-10T10:30:00
```

---

## 🎨 Design Features

* **Dark Theme** for a professional gym atmosphere
* **Orange Accents** for high-energy brand colors
* **Smooth Animations** with CSS transitions
* **Responsive Grid** – mobile-first design
* **Modern Typography** – clean, readable fonts

---

## 🧪 Testing API

```bash
# Health check
curl http://localhost:5000/api/health

# Get exercises
curl http://localhost:5000/api/exercises

# Create reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "date": "2024-02-15",
    "time": "10:00",
    "trainer": "Sarah Chen",
    "session_type": "Yoga Flow",
    "email": "jane@email.com",
    "phone": "+1-555-0124"
  }'
```

---

## 🚀 Deployment

### Frontend

* Deploy via Lovable.dev or platforms like Netlify, Vercel

### Backend

* Options: Heroku, Railway, DigitalOcean, AWS EC2

---

## 🔧 Environment Variables

Create `.env` in `backend/`:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📝 License

MIT License – see [LICENSE](LICENSE)

---

## 👨‍💻 Developer

**S Mohammed Kaif**

* GitHub: [@Shaik-Mohammed-Kaif](https://github.com/Shaik-Mohammed-Kaif)
* Project: [GymPro-Website][(https://github.com/Shaik-Mohammed-Kaif/Frontend-Projects/tree/main/Fitness%20With%20Mohammed)
---

## 🙏 Acknowledgments

* **Lovable.dev** – Development platform
* **Shadcn/ui** – Component library
* **Unsplash** – Fitness images
* **Lucide** – Icons

---

**Made with ❤️ by S Mohammed Kaif for the fitness community**
