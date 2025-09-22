export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  availability: boolean;
}

export interface Order {
  orderId: string;
  userId: string;
  productName: string;
  quantity: number;
  eventName: string;
  eventType: string;
  totalPrice: number;
  date: string;
  customerName: string;
  email: string;
  contactNumber: string;
  additionalNotes: string;
}

export interface Contact {
  contactId: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface Newsletter {
  id: string;
  email: string;
  date: string;
}