import { useState } from "react";
import { Search, Filter, ShoppingCart, Star, Heart, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import toolsImage from "@/assets/tools-showcase.jpg";

const Products = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [cart, setCart] = useState<number[]>([]);

  const products = [
    {
      id: 1,
      name: "Professional Wrench Set",
      category: "Tools",
      price: 2500,
      originalPrice: 3200,
      rating: 4.8,
      reviews: 124,
      image: toolsImage,
      description: "Complete set of professional-grade wrenches for automotive repair",
      inStock: true,
      brand: "Stanley",
      features: ["Chrome finish", "Lifetime warranty", "Sizes 8-24mm"]
    },
    {
      id: 2,
      name: "OBD2 Diagnostic Scanner",
      category: "Diagnostics",
      price: 4500,
      originalPrice: 5500,
      rating: 4.9,
      reviews: 89,
      image: toolsImage,
      description: "Advanced diagnostic tool for reading car error codes",
      inStock: true,
      brand: "Autel",
      features: ["Multi-brand support", "Live data", "Code clearing"]
    },
    {
      id: 3,
      name: "Engine Oil Filter",
      category: "Spare Parts",
      price: 350,
      originalPrice: 450,
      rating: 4.7,
      reviews: 203,
      image: toolsImage,
      description: "High-quality oil filter for most car models",
      inStock: true,
      brand: "Bosch",
      features: ["OEM quality", "Easy installation", "Extended life"]
    },
    {
      id: 4,
      name: "Brake Pad Set",
      category: "Spare Parts",
      price: 1800,
      originalPrice: 2200,
      rating: 4.6,
      reviews: 156,
      image: toolsImage,
      description: "Premium brake pads for optimal stopping power",
      inStock: false,
      brand: "Brembo",
      features: ["Low noise", "Long lasting", "Easy installation"]
    },
    {
      id: 5,
      name: "Socket Set 40-Piece",
      category: "Tools",
      price: 1200,
      originalPrice: 1500,
      rating: 4.5,
      reviews: 98,
      image: toolsImage,
      description: "Comprehensive socket set with ratchet handle",
      inStock: true,
      brand: "Craftsman",
      features: ["Chrome vanadium", "Quick release", "Organized case"]
    },
    {
      id: 6,
      name: "Car Battery Charger",
      category: "Diagnostics",
      price: 3200,
      originalPrice: 4000,
      rating: 4.8,
      reviews: 67,
      image: toolsImage,
      description: "Smart battery charger with multiple charging modes",
      inStock: true,
      brand: "CTEK",
      features: ["Automatic charging", "Battery maintenance", "Spark-proof"]
    }
  ];

  const categories = ["all", "Tools", "Diagnostics", "Spare Parts"];

  const filteredProducts = products
    .filter(product => 
      (categoryFilter === "all" || product.category === categoryFilter) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (productId: number) => {
    setCart(prev => [...prev, productId]);
    const product = products.find(p => p.id === productId);
    toast({
      title: "Added to Cart!",
      description: `${product?.name} has been added to your cart.`,
    });
  };

  const getDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="garage-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quality Auto <span className="text-accent">Products</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Professional tools and genuine spare parts for all your automotive needs.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="card-product group">
                <CardHeader className="pb-4">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 tool-shine"
                    />
                    <div className="absolute top-4 left-4">
                      {getDiscount(product.originalPrice, product.price) > 0 && (
                        <Badge className="bg-engine-red text-white">
                          {getDiscount(product.originalPrice, product.price)}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
                        <Heart className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{product.category}</Badge>
                      <span className="text-sm text-muted-foreground">{product.brand}</span>
                    </div>
                    <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-4 h-4 text-accent" />
                      <span className="font-bold text-primary text-lg">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full btn-service" 
                    disabled={!product.inStock}
                    onClick={() => addToCart(product.id)}
                  >
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">{cart.length} items in cart</span>
            <Button variant="secondary" size="sm">
              View Cart
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Products;