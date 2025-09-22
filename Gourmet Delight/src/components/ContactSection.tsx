import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface ReservationForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<ReservationForm>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate reservation processing
    toast({
      title: "Reservation Confirmed! 🎉",
      description: `Thank you ${formData.name}! Your reservation for ${formData.guests} guests on ${formData.date} at ${formData.time} has been confirmed. We'll send you a confirmation email shortly.`,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '2',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-playfair font-bold text-gold mb-4 animate-fade-in-up">
            Reserve Your Experience
          </h2>
          <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto animate-fade-in-up"
             style={{ animationDelay: '0.2s' }}>
            Ready to embark on a culinary journey? Make your reservation today and let us create
            an unforgettable dining experience for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="animate-slide-in-left">
            <div className="elegant-card">
              <h3 className="text-3xl font-playfair font-semibold text-cream mb-8">
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-charcoal font-bold">📍</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-playfair font-semibold text-cream mb-1">Address</h4>
                    <p className="text-muted-foreground font-inter">
                      123 Culinary Avenue<br />
                      Downtown District<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-charcoal font-bold">📞</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-playfair font-semibold text-cream mb-1">Phone</h4>
                    <p className="text-muted-foreground font-inter">(555) 123-DINE</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-charcoal font-bold">✉️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-playfair font-semibold text-cream mb-1">Email</h4>
                    <p className="text-muted-foreground font-inter">reservations@gourmetdelight.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-charcoal font-bold">🕒</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-playfair font-semibold text-cream mb-1">Hours</h4>
                    <div className="text-muted-foreground font-inter text-sm space-y-1">
                      <p>Tuesday - Thursday: 5:00 PM - 10:00 PM</p>
                      <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                      <p>Sunday: 5:00 PM - 9:00 PM</p>
                      <p>Monday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="animate-slide-in-right">
            <div className="elegant-card">
              <h3 className="text-3xl font-playfair font-semibold text-cream mb-8">
                Make a Reservation
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-cream font-inter">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-charcoal-light border-border text-cream"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-cream font-inter">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-charcoal-light border-border text-cream"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-cream font-inter">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2 bg-charcoal-light border-border text-cream"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guests" className="text-cream font-inter">Number of Guests</Label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="mt-2 w-full px-3 py-2 bg-charcoal-light border border-border rounded-md text-cream"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-cream font-inter">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-charcoal-light border-border text-cream"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-cream font-inter">Time *</Label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full px-3 py-2 bg-charcoal-light border border-border rounded-md text-cream"
                    >
                      <option value="">Select Time</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="5:30 PM">5:30 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="6:30 PM">6:30 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="8:30 PM">8:30 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-cream font-inter">Special Requests</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any dietary restrictions, special occasions, or other requests..."
                    className="mt-2 bg-charcoal-light border-border text-cream min-h-20"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gold text-lg py-6"
                >
                  Confirm Reservation
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;