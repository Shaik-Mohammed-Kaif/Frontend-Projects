import React from 'react';
import heroImage from '@/assets/hero-restaurant.jpg';

const HeroSection = () => {
  const scrollToMenu = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Gourmet Delight Restaurant Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-bg opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold text-cream mb-6 animate-fade-in-up">
          Welcome to
          <span className="block text-gold mt-2">Gourmet Delight</span>
        </h1>

        <p className="text-xl md:text-2xl text-cream/90 mb-8 font-inter font-light leading-relaxed animate-fade-in-up"
           style={{ animationDelay: '0.2s' }}>
          Experience culinary artistry where every dish tells a story of passion,
          creativity, and the finest ingredients from around the world.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
             style={{ animationDelay: '0.4s' }}>
          <button
            onClick={scrollToMenu}
            className="btn-gold"
          >
            Explore Our Menu
          </button>

          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border-2 border-gold text-gold font-semibold rounded-full
                     hover:bg-gold hover:text-charcoal transition-all duration-300
                     transform hover:scale-105"
          >
            Make Reservation
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;