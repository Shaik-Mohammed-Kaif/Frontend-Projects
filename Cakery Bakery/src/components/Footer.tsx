import React, { useState } from 'react';
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Send } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Save to localStorage (simulating CSV storage)
    const newsletter = {
      id: `NEWS-${Date.now()}`,
      email,
      date: new Date().toISOString()
    };

    const existingSubscribers = JSON.parse(localStorage.getItem('newsletter') || '[]');
    existingSubscribers.push(newsletter);
    localStorage.setItem('newsletter', JSON.stringify(existingSubscribers));

    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-gray-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-pink-600 to-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Stay Updated with Sweet Deals! 🍰</h3>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, special offers, and baking tips!
          </p>
          
          {subscribed ? (
            <div className="bg-white/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="font-semibold">Thank you for subscribing! 🎉</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="bg-white text-pink-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 flex items-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-pink-400 mr-2" />
                <span className="font-bold text-xl">Cakery</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Crafting delicious moments since 2010. Your neighborhood bakery for all of life's sweet celebrations.
              </p>
              <div className="flex space-x-4">
                <button className="bg-gray-700 p-2 rounded-full hover:bg-pink-600 transition-colors duration-300">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="bg-gray-700 p-2 rounded-full hover:bg-pink-600 transition-colors duration-300">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="bg-gray-700 p-2 rounded-full hover:bg-pink-600 transition-colors duration-300">
                  <Instagram className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('about')}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('menu')}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300"
                  >
                    Menu
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('order')}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300"
                  >
                    Order Online
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('contact')}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-bold text-lg mb-4">Our Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Custom Cakes</li>
                <li>Fresh Pastries</li>
                <li>Artisan Breads</li>
                <li>Cookies & Treats</li>
                <li>Wedding Cakes</li>
                <li>Corporate Catering</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">123 Baker Street<br />Sweet Valley, CA 90210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-pink-400" />
                  <span className="text-gray-300">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-pink-400" />
                  <span className="text-gray-300">info@cakery.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Cakery - Freshly Baked Delights. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <button className="hover:text-pink-400 transition-colors duration-300">
                Privacy Policy
              </button>
              <button className="hover:text-pink-400 transition-colors duration-300">
                Terms of Service
              </button>
              <button className="hover:text-pink-400 transition-colors duration-300">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;