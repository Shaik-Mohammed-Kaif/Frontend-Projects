import { useState } from "react";
import { Star, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onViewDetails }: ProductCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    
    // Add flying animation effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const flyingImage = document.createElement('div');
    flyingImage.innerHTML = `<img src="${product.images[0]}" class="w-12 h-12 object-cover rounded" />`;
    flyingImage.className = 'fixed z-50 pointer-events-none fly-to-cart';
    flyingImage.style.left = rect.left + 'px';
    flyingImage.style.top = rect.top + 'px';
    
    document.body.appendChild(flyingImage);
    
    setTimeout(() => {
      document.body.removeChild(flyingImage);
    }, 800);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-accent-yellow fill-current'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <div 
      className="flip-card group cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => onViewDetails(product)}
    >
      <div className={`flip-card-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="flip-card-front bg-card border border-border overflow-hidden">
          {/* Discount badge */}
          {product.discount_pct && (
            <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground">
              {product.discount_pct}% OFF
            </Badge>
          )}
          
          {/* Stock badge */}
          <Badge 
            variant={product.stock > 10 ? "default" : "destructive"}
            className="absolute top-3 right-3 z-10"
          >
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
          </Badge>

          {/* Product image */}
          <div className="relative h-48 bg-muted">
            {!imageLoaded && (
              <div className="skeleton w-full h-full" />
            )}
            <img
              src={product.images[0]}
              alt={product.title}
              className={`w-full h-full object-cover transition-smooth group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Product info */}
          <div className="p-4">
            <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">
              {product.title}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews_count})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.old_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.old_price)}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="flip-card-back bg-primary text-primary-foreground flex flex-col justify-center items-center p-6 text-center">
          <h3 className="font-bold text-lg mb-4">{product.title}</h3>
          <p className="text-sm mb-6 opacity-90">
            {product.description}
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={handleAddToCart}
              className="btn-accent w-full focus-ring"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 focus-ring"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;