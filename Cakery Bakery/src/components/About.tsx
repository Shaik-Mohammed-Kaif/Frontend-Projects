import React from 'react';
import { ArrowRight, Users, MapPin, Clock } from 'lucide-react';

interface AboutProps {
  setCurrentPage: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                Our Story of <span className="text-pink-600">Sweet Passion</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2010, Cakery began as a small family bakery with a simple mission: to create exceptional baked goods that bring joy to every occasion. What started in a modest kitchen has grown into a beloved bakery known for its artisanal approach and unwavering commitment to quality.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every morning, our skilled bakers arrive before dawn to craft fresh breads, pastries, cakes, and treats using time-honored techniques and premium ingredients sourced from local farms and trusted suppliers worldwide.
              </p>
              <button 
                onClick={() => setCurrentPage('menu')}
                className="flex items-center bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors duration-300"
              >
                Explore Our Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Bakery interior" 
                className="rounded-2xl shadow-lg w-full h-64 object-cover"
              />
              <img 
                src="https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Baker at work" 
                className="rounded-2xl shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="px-4 py-20 bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We believe that great baking is more than just following recipes—it's about creating moments of happiness and connection.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <Users className="h-16 w-16 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community First</h3>
              <p className="text-gray-600">
                We're more than a bakery—we're part of the community, supporting local events and bringing people together through the love of food.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <MapPin className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Local Ingredients</h3>
              <p className="text-gray-600">
                We partner with local farmers and suppliers to ensure the freshest ingredients while supporting our community's economy.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <Clock className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Traditional Craftsmanship</h3>
              <p className="text-gray-600">
                Our recipes combine traditional techniques passed down through generations with modern innovation and creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Master Bakers</h2>
            <p className="text-gray-600 text-lg">The talented team behind every delicious creation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Head Baker" 
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800">Sarah Johnson</h3>
              <p className="text-pink-600 font-medium">Head Baker & Owner</p>
              <p className="text-gray-600 mt-2">15+ years of experience in artisanal baking</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Pastry Chef" 
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800">Marcus Chen</h3>
              <p className="text-orange-500 font-medium">Pastry Specialist</p>
              <p className="text-gray-600 mt-2">Expert in French pastries and desserts</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Cake Designer" 
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-800">Emily Rodriguez</h3>
              <p className="text-green-500 font-medium">Cake Designer</p>
              <p className="text-gray-600 mt-2">Creates stunning custom cakes for special events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-20 bg-gradient-to-r from-pink-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Taste the Difference?</h2>
          <p className="text-pink-100 text-lg mb-8">
            Experience the quality and craftsmanship that makes Cakery special. Visit us today or place an order online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setCurrentPage('menu')}
              className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Browse Menu
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-colors duration-300"
            >
              Visit Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;