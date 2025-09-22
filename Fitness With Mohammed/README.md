# GymPro Website

A modern, responsive gym website with a React frontend and Flask backend, featuring exercise programs, session booking, and trainer information.

**Developer**: S Mohammed Kaif  
**GitHub**: [https://github.com/Shaik-Mohammed-Kaif/GymPro-Website](https://github.com/Shaik-Mohammed-Kaif/GymPro-Website)

## 🚀 Live Demo

Visit the live website: [GymPro Demo](https://lovable.dev/projects/a263f965-03d2-4978-83d7-5f0168edf9ff)

## ✨ Features

- **Modern Design**: Dark theme with vibrant orange accents
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Exercise Catalog**: Browse different workout programs with filtering
- **Session Booking**: Real-time booking system with trainer selection
- **Professional Trainers**: Meet our expert fitness coaches
- **Smooth Animations**: Engaging user interface with CSS animations
- **RESTful API**: Flask backend with CSV data storage

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Shadcn/ui** component library
- **Lucide React** for icons

### Backend
- **Python Flask** web framework
- **CSV files** for data storage
- **Flask-CORS** for cross-origin requests
- **RESTful API** design

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
│   ├── types/             # TypeScript types
│   ├── data/              # Mock data
│   └── assets/            # Images and media
└── README.md
```

## 🚀 Quick Start

### Frontend Setup (React)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

### Backend Setup (Flask)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server:**
   ```bash
   python app.py
   ```

5. **Server will start on:**
   ```
   http://localhost:5000
   ```

## 📡 API Endpoints

### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/<id>` - Get specific exercise

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create new reservation

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

### Health Check
- `GET /api/health` - API health status

## 📊 Data Schema

### Exercises (menu.csv)
```csv
id,exercise_name,duration,calories_burn,description,difficulty
1,Strength Training,45 minutes,350,Build muscle and strength,Intermediate
```

### Reservations (reservations.csv)
```csv
id,name,date,time,trainer,session_type,email,phone,created_at
1,John Doe,2024-01-15,09:00,Mike Johnson,Strength Training,john@email.com,+1-555-0123,2024-01-10T10:30:00
```

### Users (users.csv)
```csv
id,name,email,membership_type,created_at
1,John Doe,john@email.com,Premium,2024-01-10T10:30:00
```

## 🎨 Design Features

- **Dark Theme**: Professional gym atmosphere
- **Orange Accents**: High-energy brand colors
- **Smooth Animations**: CSS transitions and keyframes
- **Responsive Grid**: Mobile-first design approach
- **Modern Typography**: Clean, readable fonts

## 🧪 Testing

### Test API Endpoints

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

## 🚀 Deployment

### Frontend Deployment
The frontend is deployed on Lovable and can be published directly from the platform.

### Backend Deployment Options
1. **Heroku**: Deploy Flask app with CSV files
2. **Railway**: Simple Python app deployment
3. **DigitalOcean App Platform**: Container deployment
4. **AWS EC2**: Virtual machine deployment

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**S Mohammed Kaif**
- GitHub: [@Shaik-Mohammed-Kaif](https://github.com/Shaik-Mohammed-Kaif)
- Project: [GymPro-Website](https://github.com/Shaik-Mohammed-Kaif/GymPro-Website)

## 🙏 Acknowledgments

- **Lovable.dev** for the amazing development platform
- **Shadcn/ui** for the beautiful component library
- **Unsplash** for high-quality fitness images
- **Lucide** for the icon library

---

**Made with ❤️ for the fitness community**
