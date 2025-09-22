import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { trainers, exercises } from '@/data/mockData';
import { Reservation } from '@/types/gym';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';

interface BookingFormProps {
  onBookingSuccess: (reservation: Reservation) => void;
}

export const BookingForm = ({ onBookingSuccess }: BookingFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    trainer: '',
    session_type: '',
    notes: ''
  });

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.date || !formData.time || !formData.trainer || !formData.session_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create new reservation (simulate API call)
    const newReservation: Reservation = {
      id: Date.now(),
      name: formData.name,
      date: formData.date,
      time: formData.time,
      trainer: formData.trainer,
      session_type: formData.session_type,
      email: formData.email,
      phone: formData.phone
    };

    // Simulate API success
    onBookingSuccess(newReservation);
    
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your ${formData.session_type} session with ${formData.trainer} is booked for ${formData.date} at ${formData.time}.`,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      trainer: '',
      session_type: '',
      notes: ''
    });
  };

  return (
    <section className="py-20 px-4" id="booking">
      <div className="container mx-auto max-w-4xl">
        <h2 className="section-title">Book Your Session</h2>
        
        <Card className="gym-card animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reserve Your Training Session</CardTitle>
            <CardDescription>
              Choose your preferred trainer, session type, and time slot
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Preferred Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Preferred Time *
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="trainer">Preferred Trainer *</Label>
                    <Select value={formData.trainer} onValueChange={(value) => handleInputChange('trainer', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.name}>
                            {trainer.name} - {trainer.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="session_type">Session Type *</Label>
                <Select value={formData.session_type} onValueChange={(value) => handleInputChange('session_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose session type" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.exercise_name}>
                        {exercise.exercise_name} ({exercise.duration})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any specific goals, injuries, or preferences you'd like to mention?"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                size="lg"
                className="w-full gym-button"
              >
                Book My Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};