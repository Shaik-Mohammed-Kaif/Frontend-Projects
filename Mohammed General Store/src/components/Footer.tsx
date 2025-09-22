import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    try {
      // Simulate API call - replace with actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="bg-primary-hover py-12 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest offers, new arrivals, and exclusive deals.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus-ring"
              required
            />
            <Button
              type="submit"
              disabled={isSubscribing}
              className="btn-accent whitespace-nowrap focus-ring"
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Store Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Mohammed Kiran General Store</h3>
              <p className="text-primary-foreground/80 mb-4">
                Your trusted neighborhood store providing quality products at affordable prices with exceptional customer service.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+91 6300472873</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>mohammedkaif8297@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>General Store Location</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Groceries
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Electronics
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Clothing
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Home & Kitchen
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                    Personal Care
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Support</h4>
              <ul className="space-y-2 mb-6">
                <li className="text-primary-foreground/80">
                  Help & FAQ
                </li>
                <li className="text-primary-foreground/80">
                  Return Policy
                </li>
                <li className="text-primary-foreground/80">
                  Shipping Info
                </li>
                <li className="text-primary-foreground/80">
                  Track Your Order
                </li>
              </ul>

              {/* Social Links */}
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-smooth focus-ring"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-smooth focus-ring"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-smooth focus-ring"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-primary-foreground/80 text-sm">
                © 2024 Mohammed Kiran General Store. All rights reserved.
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-primary-foreground/80 text-sm flex items-center justify-center md:justify-end gap-2">
                Greetings — This website was lovingly built by Mohammed Kiran. Thank you for visiting!
                <Heart className="w-4 h-4 text-accent-yellow fill-current" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;