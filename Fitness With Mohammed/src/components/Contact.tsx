import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trainers } from '@/data/mockData';
import { MapPin, Phone, Mail, Clock, Star } from 'lucide-react';

export const Contact = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30" id="contact">
      <div className="container mx-auto">
        <h2 className="section-title">Meet Our Expert Trainers</h2>
        
        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trainers.map((trainer, index) => (
            <Card key={trainer.id} className="gym-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary/20"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{trainer.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{trainer.specialty}</p>
                <p className="text-muted-foreground text-xs">{trainer.experience} experience</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="gym-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Visit Our Gym
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">GymPro Fitness Center</p>
                <p className="text-muted-foreground">123 Fitness Boulevard</p>
                <p className="text-muted-foreground">Health District, FIT 12345</p>
                <p className="text-muted-foreground">United States</p>
              </div>
            </CardContent>
          </Card>

          <Card className="gym-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) GYM-PROF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>info@gympro.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@gympro.com</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gym-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">5:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">7:00 AM - 9:00 PM</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    24/7 access available for Premium & VIP members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="gym-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to Transform Your Life?</CardTitle>
              <CardDescription>
                Join our community of fitness enthusiasts and start your journey to a healthier, stronger you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">15+</div>
                  <div className="text-muted-foreground">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">98%</div>
                  <div className="text-muted-foreground">Member Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-muted-foreground">Premium Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};