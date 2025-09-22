import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Cart, { CartItem } from "@/components/Cart";
import Checkout, { OrderData } from "@/components/Checkout";
import { products, Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast({
            title: "Stock limit reached",
            description: `Only ${product.stock} items available`,
            variant: "destructive",
          });
          return prev;
        }
        
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.images[0],
          stock: product.stock,
        };
        return [...prev, newItem];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleViewDetails = (product: Product) => {
    // For now, just show a toast. In a real app, this would open a product details modal
    toast({
      title: product.title,
      description: product.description,
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = async (orderData: OrderData) => {
    try {
      // In a real app, this would send data to your backend
      console.log("Order data:", orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and close modals
      setCartItems([]);
      setIsCheckoutOpen(false);
      
      toast({
        title: "Order placed successfully!",
        description: `Thank you ${orderData.customerInfo.name}! Your order will be delivered soon.`,
      });
      
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={handleSearchChange}
      />
      
      <main>
        <Hero />
        
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
        />
        
        <ContactForm />
      </main>
      
      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBack={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        items={cartItems}
        total={finalTotal}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default Index;
