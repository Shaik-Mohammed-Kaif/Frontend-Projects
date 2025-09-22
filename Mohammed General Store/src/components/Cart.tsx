import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) => {
  const [promoCode, setPromoCode] = useState("");

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="focus-ring"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center h-full px-4 pb-20">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Looks like you haven't added any items to your cart yet
            </p>
            <Button onClick={onClose} className="btn-primary">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border border-border rounded-lg bg-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground line-clamp-2 text-sm">
                      {item.title}
                    </h4>
                    <p className="text-primary font-semibold">
                      {formatPrice(item.price)}
                    </p>
                    
                    {item.quantity > item.stock && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Limited Stock: {item.stock} available
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 h-auto text-destructive hover:text-destructive focus-ring"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 p-0 focus-ring"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="w-8 h-8 p-0 focus-ring"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-border p-4 space-y-4">
              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 focus-ring"
                  />
                  <Button variant="outline" size="sm" className="focus-ring">
                    Apply
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{500 - subtotal} more for free shipping
                  </p>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                onClick={onCheckout}
                className="w-full btn-primary text-lg py-3 focus-ring"
                disabled={items.some(item => item.quantity > item.stock)}
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                variant="outline"
                onClick={onClose}
                className="w-full focus-ring"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;