import { Product } from '@/types/product';
import headphonesImg from '@/assets/headphones.jpg';
import smartphoneImg from '@/assets/smartphone.jpg';
import laptopImg from '@/assets/laptop.jpg';
import smartwatchImg from '@/assets/smartwatch.jpg';
import keyboardImg from '@/assets/keyboard.jpg';
import cameraLensImg from '@/assets/camera-lens.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image: headphonesImg,
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    category: 'Audio'
  },
  {
    id: '2',
    name: 'Flagship Smartphone',
    price: 899.99,
    image: smartphoneImg,
    description: 'Latest flagship smartphone with advanced camera system and lightning-fast performance.',
    category: 'Mobile'
  },
  {
    id: '3',
    name: 'Professional Laptop',
    price: 1299.99,
    image: laptopImg,
    description: 'High-performance laptop perfect for work, gaming, and creative projects.',
    category: 'Computing'
  },
  {
    id: '4',
    name: 'Smart Fitness Watch',
    price: 399.99,
    image: smartwatchImg,
    description: 'Advanced fitness tracking with heart rate monitoring and GPS capabilities.',
    category: 'Wearables'
  },
  {
    id: '5',
    name: 'Gaming Mechanical Keyboard',
    price: 149.99,
    image: keyboardImg,
    description: 'RGB mechanical keyboard with customizable switches for the ultimate gaming experience.',
    category: 'Gaming'
  },
  {
    id: '6',
    name: 'Professional Camera Lens',
    price: 699.99,
    image: cameraLensImg,
    description: 'High-quality camera lens for professional photography and videography.',
    category: 'Photography'
  }
];