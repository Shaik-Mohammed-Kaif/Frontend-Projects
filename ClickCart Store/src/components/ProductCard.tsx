import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group bg-gradient-card border-border/50 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ${product.price}
          </span>
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 group"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};