export interface Exercise {
  id: number;
  exercise_name: string;
  duration: string;
  calories_burn: number;
  image: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  trainer: string;
  session_type: string;
  email?: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  membership_type: 'Basic' | 'Premium' | 'VIP';
}

export interface Trainer {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  image: string;
}