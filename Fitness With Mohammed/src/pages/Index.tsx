import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ExerciseGrid } from '@/components/ExerciseGrid';
import { BookingForm } from '@/components/BookingForm';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Reservation } from '@/types/gym';

const Index = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Refs for smooth scrolling
  const homeRef = useRef<HTMLDivElement>(null);
  const exercisesRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    const refs = {
      home: homeRef,
      exercises: exercisesRef,
      booking: bookingRef,
      contact: contactRef,
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleNavigateToBooking = () => {
    handleNavigate('booking');
  };

  const handleBookingSuccess = (reservation: Reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} />
      
      <main>
        <div ref={homeRef}>
          <Hero onNavigateToBooking={handleNavigateToBooking} />
        </div>
        
        <div ref={exercisesRef}>
          <ExerciseGrid />
        </div>
        
        <div ref={bookingRef}>
          <BookingForm onBookingSuccess={handleBookingSuccess} />
        </div>
        
        <div ref={contactRef}>
          <Contact />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
