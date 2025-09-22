import { Wrench, Droplets, Zap, Car, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import engineRepairImg from "@/assets/engine-repair.jpg";
import oilChangeImg from "@/assets/oil-change.jpg";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Engine Repair",
      description: "Complete engine diagnostics and repair services with genuine parts",
      price: "₹3,500",
      duration: "4-6 hours",
      image: engineRepairImg,
      icon: <Wrench className="w-8 h-8" />,
      popular: true,
    },
    {
      id: 2,
      title: "Oil Change",
      description: "Premium quality engine oil change with filter replacement",
      price: "₹1,200",
      duration: "30 minutes",
      image: oilChangeImg,
      icon: <Droplets className="w-8 h-8" />,
      popular: false,
    },
    {
      id: 3,
      title: "Car Diagnostics",
      description: "Advanced computerized diagnostics to identify any issues",
      price: "₹800",
      duration: "1 hour",
      image: engineRepairImg,
      icon: <Zap className="w-8 h-8" />,
      popular: false,
    },
    {
      id: 4,
      title: "Car Wash",
      description: "Premium exterior and interior cleaning service",
      price: "₹500",
      duration: "45 minutes",
      image: oilChangeImg,
      icon: <Car className="w-8 h-8" />,
      popular: true,
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Expert <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional automotive services with experienced technicians, 
            quality parts, and guaranteed satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="card-service group cursor-pointer">
              {service.popular && (
                <div className="absolute -top-3 left-6 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-garage-dark/80 to-transparent flex items-end p-4">
                    <div className="text-accent bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                      {service.icon}
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-4 h-4 text-accent" />
                      <span className="font-medium">Price</span>
                    </div>
                    <span className="font-bold text-primary">{service.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="font-medium">Duration</span>
                    </div>
                    <span className="text-muted-foreground">{service.duration}</span>
                  </div>
                </div>
                
                <Button className="w-full btn-service">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="btn-hero">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;