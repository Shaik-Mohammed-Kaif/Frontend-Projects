import React from 'react';
import pastaDish from '@/assets/pasta-dish.jpg';
import salmonDish from '@/assets/salmon-dish.jpg';
import chocolateDessert from '@/assets/chocolate-dessert.jpg';
import steakDish from '@/assets/steak-dish.jpg';
import seafoodPlatter from '@/assets/seafood-platter.jpg';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Truffle Pasta Perfection",
    description: "Handmade pasta with black truffle shavings, parmesan, and wild mushrooms",
    price: "$32",
    image: pastaDish,
    category: "Main Course"
  },
  {
    id: 2,
    name: "Atlantic Salmon Supreme",
    description: "Pan-seared salmon with seasonal vegetables and citrus butter sauce",
    price: "$28",
    image: salmonDish,
    category: "Main Course"
  },
  {
    id: 3,
    name: "Decadent Chocolate Symphony",
    description: "Rich chocolate mousse with gold leaf, fresh berries, and vanilla cream",
    price: "$16",
    image: chocolateDessert,
    category: "Dessert"
  },
  {
    id: 4,
    name: "Prime Ribeye Excellence",
    description: "Aged ribeye steak with herb butter, roasted garlic, and seasonal sides",
    price: "$48",
    image: steakDish,
    category: "Main Course"
  },
  {
    id: 5,
    name: "Ocean's Bounty Platter",
    description: "Fresh lobster, prawns, and seasonal seafood with house-made sauces",
    price: "$65",
    image: seafoodPlatter,
    category: "Signature"
  }
];

const MenuSection = () => {
  return (
    <section id="menu" className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-playfair font-bold text-gold mb-4 animate-fade-in-up">
            Our Culinary Creations
          </h2>
          <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto animate-fade-in-up"
             style={{ animationDelay: '0.2s' }}>
            Each dish is crafted with passion, using the finest ingredients to create an unforgettable dining experience.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className="menu-card group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-sm font-semibold">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-charcoal/80 text-gold px-3 py-1 rounded-full text-lg font-bold">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-playfair font-semibold text-cream mb-3 group-hover:text-gold transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6 font-inter">
            Want to see our full menu? Visit us for the complete culinary experience.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-gold"
          >
            Reserve Your Table
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;