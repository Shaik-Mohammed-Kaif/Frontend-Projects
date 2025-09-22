import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-charcoal/95 backdrop-blur-md shadow-xl' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-light rounded-full"></div>
            <span className="text-2xl font-playfair font-bold text-gold">Gourmet Delight</span>
          </div>

          <ul className="hidden md:flex space-x-8">
            {['home', 'menu', 'about', 'contact'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item)}
                  className="text-cream hover:text-gold transition-colors duration-300 font-inter font-medium capitalize tracking-wide"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollToSection('contact')}
            className="btn-gold hidden md:inline-block"
          >
            Reserve Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;