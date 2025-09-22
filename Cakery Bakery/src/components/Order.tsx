import React, { useState } from 'react';
import { ShoppingCart, Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { products } from '../data/products';
import { User as UserType } from '../types';

interface OrderProps {
  user: UserType | null;
  setCurrentPage: (page: string) => void;
}

const Order: React.FC<OrderProps> = ({ user, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    email: user?.email || '',
    contactNumber: '',
    eventName: '',
    eventType: '',
    selectedProduct: '',
    quantity: 1,
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const eventTypes = [
    'Birthday Party', 
    'Wedding', 
    'Office Event', 
    'Anniversary', 
    'Baby Shower', 
    'Graduation', 
    'Holiday Celebration',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedProductData = products.find(p => p.id === formData.selectedProduct);
  const totalPrice = selectedProductData ? selectedProductData.price * formData.quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to place an order');
      setCurrentPage('login');
      return;
    }

    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      const order = {
        orderId: `ORD-${Date.now()}`,
        userId: user.id,
        ...formData,
        productName: selectedProductData?.name || '',
        totalPrice,
        date: new Date().toISOString()
      };

      // Save to localStorage (simulating CSV storage)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to place an order and enjoy our delicious baked goods.</p>
          <button 
            onClick={() => setCurrentPage('login')}
            className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order! We'll contact you soon to confirm the details and arrange pickup/delivery.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => setCurrentPage('menu')}
              className="w-full bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors duration-300"
            >
              Order More Items
            </button>
            <button 
              onClick={() => setCurrentPage('home')}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Place Your Order</h1>
          <p className="text-gray-600 text-lg">
            Tell us about your event and we'll create the perfect baked goods for your special occasion.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Customer Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Event Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Name *
                      </label>
                      <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        placeholder="e.g., Sarah's Birthday Party"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Type *
                      </label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Select Event Type</option>
                        {eventTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Product Selection
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Product *
                      </label>
                      <select
                        name="selectedProduct"
                        value={formData.selectedProduct}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Choose a product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any special requests, dietary restrictions, or custom decorations..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 text-white py-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              
              {selectedProductData ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedProductData.imageUrl} 
                      alt={selectedProductData.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{selectedProductData.name}</h4>
                      <p className="text-sm text-gray-600">${selectedProductData.price} each</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-semibold">{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unit Price:</span>
                      <span>${selectedProductData.price}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-pink-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a product to see order summary</p>
              )}

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📞 Need Help?</h4>
                <p className="text-sm text-gray-600">
                  Call us at <span className="font-semibold">(555) 123-4567</span> for custom orders or special requests!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;