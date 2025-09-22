import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, Shield, Headphones } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 px-4" id="home">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Neighborhood
            <span className="block bg-gradient-to-r from-accent-yellow to-white bg-clip-text text-transparent">
              General Store
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Quality products, great prices, and exceptional service.<br />
            Everything you need, delivered right to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="btn-accent text-lg px-8 py-4 focus-ring">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Now
            </Button>
            <Button className="btn-glass text-lg px-8 py-4 focus-ring">
              View Categories
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="glass-card text-white p-4">
              <Truck className="w-8 h-8 mx-auto mb-2 text-accent-yellow" />
              <h3 className="font-semibold mb-1">Free Delivery</h3>
              <p className="text-sm text-white/80">Orders above ₹500</p>
            </div>
            
            <div className="glass-card text-white p-4">
              <Shield className="w-8 h-8 mx-auto mb-2 text-accent-yellow" />
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-sm text-white/80">100% Safe & Secure</p>
            </div>
            
            <div className="glass-card text-white p-4">
              <Headphones className="w-8 h-8 mx-auto mb-2 text-accent-yellow" />
              <h3 className="font-semibold mb-1">24/7 Support</h3>
              <p className="text-sm text-white/80">Always here to help</p>
            </div>
            
            <div className="glass-card text-white p-4">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-accent-yellow" />
              <h3 className="font-semibold mb-1">Quality Products</h3>
              <p className="text-sm text-white/80">Handpicked items</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;