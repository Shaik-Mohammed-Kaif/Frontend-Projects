import { CartItem, Product } from '@/types/product';

class CartStore {
  private items: CartItem[] = [];
  private listeners: Array<() => void> = [];

  getItems(): CartItem[] {
    return this.items;
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  addItem(product: Product): void {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    
    this.notifyListeners();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this.notifyListeners();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.notifyListeners();
    }
  }

  clearCart(): void {
    this.items = [];
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const cartStore = new CartStore();