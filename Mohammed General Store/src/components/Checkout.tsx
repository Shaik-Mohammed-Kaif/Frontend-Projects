import { useState } from "react";
import { ArrowLeft, CreditCard, Truck, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./Cart";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  items: CartItem[];
  total: number;
  onPlaceOrder: (orderData: OrderData) => void;
}

export interface OrderData {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  items: CartItem[];
  total: number;
  timestamp: string;
}

const Checkout = ({ isOpen, onClose, onBack, items, total, onPlaceOrder }: CheckoutProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Phone must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderData: OrderData = {
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      paymentMethod: formData.paymentMethod,
      items,
      total,
      timestamp: new Date().toISOString(),
    };

    try {
      await onPlaceOrder(orderData);
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Checkout Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="focus-ring"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-2xl font-semibold">Checkout</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="focus-ring">
              <span className="sr-only">Close</span>
              ×
            </Button>
          </div>

          <div className="flex overflow-hidden h-full max-h-[calc(90vh-80px)]">
            {/* Form Section */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`focus-ring ${errors.name ? 'border-destructive' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`focus-ring ${errors.phone ? 'border-destructive' : ''}`}
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`focus-ring ${errors.email ? 'border-destructive' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`focus-ring ${errors.address ? 'border-destructive' : ''}`}
                      placeholder="House/Flat/Block No., Building Name, Road Name, Area"
                      rows={3}
                    />
                    {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={`focus-ring ${errors.city ? 'border-destructive' : ''}`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className={`focus-ring ${errors.state ? 'border-destructive' : ''}`}
                        placeholder="State"
                      />
                      {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        className={`focus-ring ${errors.pincode ? 'border-destructive' : ''}`}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && <p className="text-sm text-destructive mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Payment Method</h3>
                  </div>
                  
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay when your order is delivered
                        </p>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 opacity-50">
                      <RadioGroupItem value="online" id="online" disabled />
                      <Label htmlFor="online" className="flex-1 cursor-not-allowed">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Online Payment</span>
                          <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Credit/Debit Card, UPI, Net Banking
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="w-80 bg-muted/30 p-6 border-l border-border overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total - (total > 500 ? 0 : 50))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{total > 500 ? "FREE" : formatPrice(50)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full btn-primary mt-6 focus-ring"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;