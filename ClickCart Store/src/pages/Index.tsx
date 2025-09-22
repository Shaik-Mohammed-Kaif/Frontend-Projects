import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        <section id="products" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our handpicked selection of premium technology products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        
        <footer className="bg-muted py-12 border-t">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-semibold mb-2">TechStore</h3>
            <p className="text-muted-foreground">
              Your trusted destination for premium technology products
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              © 2024 TechStore. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
