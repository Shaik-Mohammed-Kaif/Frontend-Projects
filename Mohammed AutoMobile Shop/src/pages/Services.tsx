import { useState } from "react";
import { Calendar, Clock, IndianRupee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import engineRepairImg from "@/assets/engine-repair.jpg";
import oilChangeImg from "@/assets/oil-change.jpg";

const Services = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    carModel: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });

  const services = [
    {
      id: 1,
      title: "Engine Repair & Diagnostics",
      description: "Complete engine diagnostics, repair, and maintenance with genuine parts and expert technicians.",
      price: "₹3,500",
      originalPrice: "₹4,200",
      duration: "4-6 hours",
      image: engineRepairImg,
      rating: 4.9,
      reviews: 156,
      features: ["Engine diagnostics", "Genuine parts", "6-month warranty", "Expert technicians"]
    },
    {
      id: 2,
      title: "Premium Oil Change",
      description: "High-quality engine oil change with filter replacement and multi-point inspection.",
      price: "₹1,200",
      originalPrice: "₹1,500",
      duration: "30 minutes",
      image: oilChangeImg,
      rating: 4.8,
      reviews: 203,
      features: ["Premium oil", "Filter replacement", "Multi-point check", "Quick service"]
    },
    {
      id: 3,
      title: "Brake Service & Repair",
      description: "Complete brake system inspection, pad replacement, and fluid change for optimal safety.",
      price: "₹2,800",
      originalPrice: "₹3,200",
      duration: "2-3 hours",
      image: engineRepairImg,
      rating: 4.9,
      reviews: 98,
      features: ["Brake inspection", "Pad replacement", "Fluid change", "Safety tested"]
    },
    {
      id: 4,
      title: "Tire Services",
      description: "Tire installation, balancing, alignment, and puncture repair services.",
      price: "₹800",
      originalPrice: "₹1,000",
      duration: "1 hour",
      image: oilChangeImg,
      rating: 4.7,
      reviews: 134,
      features: ["Tire installation", "Wheel balancing", "Alignment", "Puncture repair"]
    },
    {
      id: 5,
      title: "AC Service & Repair",
      description: "Complete air conditioning system service, gas refill, and component replacement.",
      price: "₹2,200",
      originalPrice: "₹2,600",
      duration: "2 hours",
      image: engineRepairImg,
      rating: 4.8,
      reviews: 87,
      features: ["AC diagnostics", "Gas refill", "Component check", "Performance test"]
    },
    {
      id: 6,
      title: "Car Wash & Detailing",
      description: "Premium exterior and interior cleaning with wax protection and detailing.",
      price: "₹500",
      originalPrice: "₹700",
      duration: "45 minutes",
      image: oilChangeImg,
      rating: 4.6,
      reviews: 245,
      features: ["Exterior wash", "Interior cleaning", "Wax protection", "Detailing"]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send data to backend
    toast({
      title: "Booking Submitted!",
      description: "We'll contact you within 24 hours to confirm your appointment.",
    });
    setFormData({
      name: "",
      phone: "",
      email: "",
      carModel: "",
      serviceType: "",
      preferredDate: "",
      preferredTime: "",
      notes: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="garage-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Professional Auto <span className="text-accent">Services</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Expert automotive care with experienced technicians, quality parts, and guaranteed satisfaction.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="card-service group">
                <CardHeader className="pb-4">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-engine-red text-white px-2 py-1 rounded-md text-sm font-medium">
                      Save {Math.round(((parseInt(service.originalPrice.slice(1)) - parseInt(service.price.slice(1))) / parseInt(service.originalPrice.slice(1))) * 100)}%
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {service.rating} ({service.reviews} reviews)
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4 text-accent" />
                        <span className="font-medium">Price</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary text-lg">{service.price}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">{service.originalPrice}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="font-medium">Duration</span>
                      </div>
                      <span className="text-muted-foreground">{service.duration}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full btn-service" onClick={() => handleInputChange('serviceType', service.title)}>
                    Book This Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Book Your Service</h2>
            <p className="text-xl text-muted-foreground">
              Schedule your appointment and we'll take care of the rest
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="carModel">Car Model *</Label>
                  <Input
                    id="carModel"
                    value={formData.carModel}
                    onChange={(e) => handleInputChange('carModel', e.target.value)}
                    placeholder="e.g., Honda City, Maruti Swift"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.title}>
                        {service.title} - {service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime">Preferred Time *</Label>
                  <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                      <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any specific requirements or issues you'd like us to know about..."
                />
              </div>

              <Button type="submit" className="w-full btn-hero text-lg py-4">
                <Calendar className="mr-2 w-5 h-5" />
                Book Appointment
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;