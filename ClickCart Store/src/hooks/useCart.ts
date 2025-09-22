import { useState, useEffect } from 'react';
import { cartStore } from '@/store/cartStore';
import { CartItem, Product } from '@/types/product';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(cartStore.getItems());
  const [totalItems, setTotalItems] = useState(cartStore.getTotalItems());
  const [totalPrice, setTotalPrice] = useState(cartStore.getTotalPrice());

  useEffect(() => {
    const unsubscribe = cartStore.subscribe(() => {
      setItems(cartStore.getItems());
      setTotalItems(cartStore.getTotalItems());
      setTotalPrice(cartStore.getTotalPrice());
    });

    return unsubscribe;
  }, []);

  const addItem = (product: Product) => {
    cartStore.addItem(product);
  };

  const removeItem = (productId: string) => {
    cartStore.removeItem(productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    cartStore.updateQuantity(productId, quantity);
  };

  const clearCart = () => {
    cartStore.clearCart();
  };

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};