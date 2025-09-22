import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';
import { products } from '../data/products';
import { User } from '../types';

interface MenuProps {
  setCurrentPage: (page: string) => void;
  user: User | null;
}

const Menu: React.FC<MenuProps> = ({ setCurrentPage, user }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['All', 'Cake', 'Pastry', 'Cookie', 'Bread', 'Cupcake', 'Sandwich'];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderNow = () => {
    if (!user) {
      alert('Please login to place an order');
      setCurrentPage('login');
      return;
    }
    setCurrentPage('order');
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Our Delicious Menu</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our wide variety of freshly baked goods, each crafted with premium ingredients and traditional techniques.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for your favorite treats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Best Sellers Badge */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🔥 Best Sellers This Week</h3>
              <p className="text-gray-600">Don't miss out on our customers' favorites!</p>
            </div>
            <Star className="h-12 w-12 text-yellow-500 fill-current" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                  <span className="text-pink-600 font-bold">${product.price}</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-gray-500 text-sm ml-2">(4.8)</span>
                  </div>
                  <button 
                    onClick={handleOrderNow}
                    className="flex items-center bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors duration-300 text-sm"
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gradient-to-r from-pink-600 to-orange-500 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-white mb-4">Can't Find What You're Looking For?</h3>
          <p className="text-pink-100 mb-6">
            We offer custom orders for special occasions. Contact us to discuss your unique requirements!
          </p>
          <button 
            onClick={() => setCurrentPage('contact')}
            className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Us for Custom Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;