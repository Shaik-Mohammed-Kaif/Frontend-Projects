import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-primary py-20 lg:py-32">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-white/90 text-sm font-medium">Premium Tech Collection</span>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Discover Amazing
          <br />
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Tech Products
          </span>
        </h1>
        
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Explore our curated selection of premium technology products designed to enhance your digital lifestyle.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={scrollToProducts}
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 transition-all duration-300 group"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 transition-all duration-300"
          >
            View Categories
          </Button>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};