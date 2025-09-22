export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  old_price?: number;
  discount_pct?: number;
  images: string[];
  rating: number;
  reviews_count: number;
  stock: number;
  description: string;
}

export const categories = [
  "All",
  "Groceries",
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Personal Care",
  "Snacks & Beverages",
  "Stationery"
];

export const products: Product[] = [
  {
    id: "1",
    title: "Basmati Rice Premium 5KG",
    category: "Groceries",
    price: 850,
    old_price: 950,
    discount_pct: 11,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"],
    rating: 4.5,
    reviews_count: 324,
    stock: 50,
    description: "Premium quality basmati rice with extra long grains and aromatic fragrance."
  },
  {
    id: "2",
    title: "Samsung Galaxy Earbuds",
    category: "Electronics",
    price: 8999,
    old_price: 12999,
    discount_pct: 31,
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"],
    rating: 4.3,
    reviews_count: 567,
    stock: 25,
    description: "Wireless earbuds with active noise cancellation and premium sound quality."
  },
  {
    id: "3",
    title: "Cotton Kurta Set Men's",
    category: "Clothing",
    price: 1299,
    old_price: 1899,
    discount_pct: 32,
    images: ["https://images.unsplash.com/photo-1622445275576-721325763afe?w=400"],
    rating: 4.2,
    reviews_count: 189,
    stock: 30,
    description: "Comfortable cotton kurta set perfect for festivals and casual wear."
  },
  {
    id: "4",
    title: "Non-Stick Cookware Set",
    category: "Home & Kitchen",
    price: 2499,
    old_price: 3499,
    discount_pct: 29,
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"],
    rating: 4.4,
    reviews_count: 443,
    stock: 15,
    description: "Complete non-stick cookware set with induction base and heat-resistant handles."
  },
  {
    id: "5",
    title: "Himalaya Face Wash",
    category: "Personal Care",
    price: 165,
    old_price: 199,
    discount_pct: 17,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400"],
    rating: 4.1,
    reviews_count: 892,
    stock: 100,
    description: "Gentle face wash with neem and turmeric for clear and healthy skin."
  },
  {
    id: "6",
    title: "Maggi Masala Noodles Pack",
    category: "Snacks & Beverages",
    price: 144,
    old_price: 160,
    discount_pct: 10,
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"],
    rating: 4.6,
    reviews_count: 1234,
    stock: 200,
    description: "Pack of 12 Maggi masala noodles - quick and tasty meal solution."
  },
  {
    id: "7",
    title: "Wireless Bluetooth Speaker",
    category: "Electronics",
    price: 2299,
    old_price: 2999,
    discount_pct: 23,
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"],
    rating: 4.3,
    reviews_count: 356,
    stock: 40,
    description: "Portable wireless speaker with deep bass and 12-hour battery life."
  },
  {
    id: "8",
    title: "A4 Notebook Set",
    category: "Stationery",
    price: 299,
    old_price: 399,
    discount_pct: 25,
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"],
    rating: 4.0,
    reviews_count: 156,
    stock: 75,
    description: "Set of 5 premium quality A4 notebooks with ruled pages."
  },
  {
    id: "9",
    title: "Organic Honey 500g",
    category: "Groceries",
    price: 349,
    old_price: 425,
    discount_pct: 18,
    images: ["https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400"],
    rating: 4.7,
    reviews_count: 678,
    stock: 60,
    description: "Pure organic honey sourced directly from beekeepers."
  },
  {
    id: "10",
    title: "LED Desk Lamp",
    category: "Electronics",
    price: 1499,
    old_price: 1999,
    discount_pct: 25,
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
    rating: 4.2,
    reviews_count: 234,
    stock: 35,
    description: "Adjustable LED desk lamp with touch control and USB charging port."
  },
  {
    id: "11",
    title: "Women's Ethnic Dress",
    category: "Clothing",
    price: 1799,
    old_price: 2499,
    discount_pct: 28,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"],
    rating: 4.4,
    reviews_count: 298,
    stock: 20,
    description: "Beautiful ethnic dress with traditional embroidery and modern fit."
  },
  {
    id: "12",
    title: "Pressure Cooker 5L",
    category: "Home & Kitchen",
    price: 2199,
    old_price: 2799,
    discount_pct: 21,
    images: ["https://images.unsplash.com/photo-1585515656692-93a72b8e46ce?w=400"],
    rating: 4.5,
    reviews_count: 445,
    stock: 25,
    description: "Stainless steel pressure cooker with safety features and induction base."
  },
  {
    id: "13",
    title: "Hair Oil Ayurvedic",
    category: "Personal Care",
    price: 249,
    old_price: 299,
    discount_pct: 17,
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"],
    rating: 4.3,
    reviews_count: 567,
    stock: 80,
    description: "Natural ayurvedic hair oil for strong and healthy hair growth."
  },
  {
    id: "14",
    title: "Mixed Dry Fruits 1KG",
    category: "Snacks & Beverages",
    price: 1299,
    old_price: 1599,
    discount_pct: 19,
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"],
    rating: 4.6,
    reviews_count: 789,
    stock: 45,
    description: "Premium quality mixed dry fruits including almonds, cashews, and raisins."
  },
  {
    id: "15",
    title: "Ballpoint Pen Set",
    category: "Stationery",
    price: 199,
    old_price: 250,
    discount_pct: 20,
    images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400"],
    rating: 4.1,
    reviews_count: 123,
    stock: 150,
    description: "Set of 10 smooth-writing ballpoint pens in assorted colors."
  },
  {
    id: "16",
    title: "Smart Watch Fitness",
    category: "Electronics",
    price: 3999,
    old_price: 5999,
    discount_pct: 33,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
    rating: 4.2,
    reviews_count: 445,
    stock: 30,
    description: "Fitness smartwatch with heart rate monitor and GPS tracking."
  },
  {
    id: "17",
    title: "Casual T-Shirt Cotton",
    category: "Clothing",
    price: 599,
    old_price: 799,
    discount_pct: 25,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    rating: 4.0,
    reviews_count: 234,
    stock: 100,
    description: "100% cotton casual t-shirt available in multiple colors and sizes."
  },
  {
    id: "18",
    title: "Water Purifier Filter",
    category: "Home & Kitchen",
    price: 1299,
    old_price: 1599,
    discount_pct: 19,
    images: ["https://images.unsplash.com/photo-1582719201952-c27ec0159de6?w=400"],
    rating: 4.4,
    reviews_count: 356,
    stock: 40,
    description: "Advanced water purifier filter with multi-stage purification technology."
  },
  {
    id: "19",
    title: "Herbal Shampoo 400ml",
    category: "Personal Care",
    price: 299,
    old_price: 349,
    discount_pct: 14,
    images: ["https://images.unsplash.com/photo-1556228852-bbf0fe596bc3?w=400"],
    rating: 4.2,
    reviews_count: 445,
    stock: 90,
    description: "Natural herbal shampoo for all hair types with nourishing ingredients."
  },
  {
    id: "20",
    title: "Green Tea Premium 100g",
    category: "Snacks & Beverages",
    price: 449,
    old_price: 599,
    discount_pct: 25,
    images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"],
    rating: 4.5,
    reviews_count: 567,
    stock: 70,
    description: "Premium green tea leaves with antioxidants and natural flavor."
  }
];

export const featuredProducts = products.filter(p => p.discount_pct && p.discount_pct > 25);
export const topRatedProducts = products.filter(p => p.rating >= 4.4);