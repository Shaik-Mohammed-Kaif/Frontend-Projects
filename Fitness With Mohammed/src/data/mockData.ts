import { Exercise, Reservation, Trainer } from '../types/gym';
import deadliftsImage from '@/assets/deadlifts.jpg';
import cardioImage from '@/assets/cardio.jpg';
import yogaImage from '@/assets/yoga.jpg';
import personalTrainingImage from '@/assets/personal-training.jpg';

export const exercises: Exercise[] = [
  {
    id: 1,
    exercise_name: "Strength Training",
    duration: "45 minutes",
    calories_burn: 350,
    image: deadliftsImage,
    description: "Build muscle and strength with our comprehensive weight training program.",
    difficulty: 'Intermediate'
  },
  {
    id: 2,
    exercise_name: "Cardio Blast",
    duration: "30 minutes",
    calories_burn: 400,
    image: cardioImage,
    description: "High-intensity cardio workout to boost your heart rate and burn calories.",
    difficulty: 'Beginner'
  },
  {
    id: 3,
    exercise_name: "Yoga Flow",
    duration: "60 minutes",
    calories_burn: 250,
    image: yogaImage,
    description: "Improve flexibility, balance, and mindfulness with guided yoga sessions.",
    difficulty: 'Beginner'
  },
  {
    id: 4,
    exercise_name: "Personal Training",
    duration: "50 minutes",
    calories_burn: 450,
    image: personalTrainingImage,
    description: "One-on-one training sessions customized to your fitness goals.",
    difficulty: 'Advanced'
  },
  {
    id: 5,
    exercise_name: "HIIT Circuit",
    duration: "35 minutes",
    calories_burn: 500,
    image: cardioImage,
    description: "High-Intensity Interval Training for maximum calorie burn.",
    difficulty: 'Advanced'
  },
  {
    id: 6,
    exercise_name: "Pilates Core",
    duration: "45 minutes",
    calories_burn: 300,
    image: yogaImage,
    description: "Strengthen your core and improve posture with Pilates exercises.",
    difficulty: 'Intermediate'
  }
];

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Mike Johnson",
    specialty: "Strength Training",
    experience: "8 years",
    image: personalTrainingImage
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "Yoga & Pilates",
    experience: "6 years",
    image: yogaImage
  },
  {
    id: 3,
    name: "David Rodriguez",
    specialty: "HIIT & Cardio",
    experience: "10 years",
    image: cardioImage
  },
  {
    id: 4,
    name: "Emily Thompson",
    specialty: "Personal Training",
    experience: "7 years",
    image: deadliftsImage
  }
];

// Mock reservations data (would be loaded from CSV in real backend)
export let reservations: Reservation[] = [
  {
    id: 1,
    name: "John Doe",
    date: "2024-01-15",
    time: "09:00",
    trainer: "Mike Johnson",
    session_type: "Strength Training",
    email: "john.doe@email.com",
    phone: "+1-555-0123"
  }
];