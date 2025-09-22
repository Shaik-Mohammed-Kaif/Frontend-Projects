import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/gym-hero.jpg';

interface HeroProps {
  onNavigateToBooking: () => void;
}

export const Hero = ({ onNavigateToBooking }: HeroProps) => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center text-white parallax-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
      
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Transform Your
          <span className="block text-primary animate-pulse-glow">Body & Mind</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200">
          Join GymPro and unlock your potential with world-class equipment, 
          expert trainers, and a community that motivates you to achieve greatness.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="gym-button group"
            onClick={onNavigateToBooking}
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 hover:border-primary"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Tour
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-slide-up">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-300">Members</div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-300">Classes Weekly</div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl font-bold text-primary mb-2">10+</div>
            <div className="text-gray-300">Expert Trainers</div>
          </div>
        </div>
      </div>
    </section>
  );
};