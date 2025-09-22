import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden smooth-scroll">
      <Navigation />
      <main>
        <HeroSection />
        <MenuSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-charcoal-light py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-light rounded-full"></div>
              <span className="text-2xl font-playfair font-bold text-gold">Gourmet Delight</span>
            </div>
            <p className="text-muted-foreground font-inter mb-4">
              Where culinary artistry meets unforgettable experiences
            </p>
            <p className="text-sm text-muted-foreground font-inter">
              © 2024 Gourmet Delight Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;