import React from 'react';
import { Play, ShoppingCart, ArrowRight, Heart, Award, Clock } from 'lucide-react';
import { products } from '../data/products';

interface HomepageProps {
  setCurrentPage: (page: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({ setCurrentPage }) => {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 to-orange-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                The Perfect Baked <span className="text-pink-600">Cake</span> Every Day!
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Welcome to Cakery! Discover our freshly baked cakes and treats, made with love and the finest ingredients for every occasion.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors duration-300 shadow-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Video
                </button>
                <button 
                  onClick={() => setCurrentPage('order')}
                  className="flex items-center bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Order Now
                </button>
                <button 
                  onClick={() => setCurrentPage('about')}
                  className="flex items-center border-2 border-gray-800 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-300"
                >
                  Read More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Delicious cake" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-red-500 fill-current" />
                  <span className="font-semibold">500+ Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Foods Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Featured Delights</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our signature collection of freshly baked items, crafted with premium ingredients and traditional techniques.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Cakes', 'Muffins', 'Waffles', 'Pancakes', 'Cookies', 'Bread'].map((item, index) => (
              <div key={index} className="text-center group cursor-pointer" onClick={() => setCurrentPage('menu')}>
                <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-2xl mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-pink-200 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-pink-300 transition-colors duration-300">
                    <span className="text-2xl">🧁</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">{item}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Cakery?</h2>
            <p className="text-gray-600 text-lg">We're committed to delivering the finest baked goods with exceptional service</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Award className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
                <p className="text-gray-600">Using only the finest ingredients sourced from trusted suppliers for exceptional taste and quality.</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Fresh Daily</h3>
                <p className="text-gray-600">All our products are baked fresh every morning to ensure maximum freshness and flavor.</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">Made with Love</h3>
                <p className="text-gray-600">Every item is crafted with passion and attention to detail by our experienced bakers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Items</h2>
            <p className="text-gray-600 text-lg">Taste the favorites that keep our customers coming back</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <span className="text-pink-600 font-bold text-xl">${product.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <button 
                    onClick={() => setCurrentPage('order')}
                    className="w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition-colors duration-300"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => setCurrentPage('menu')}
              className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors duration-300 inline-flex items-center"
            >
              View Full Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;