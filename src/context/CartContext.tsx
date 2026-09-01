import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setCartLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      setCartItems(data as CartItem[]);
    }
    setCartLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) return;
    const existing = cartItems.find((item) => item.product_id === productId);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: productId, quantity });
      if (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
      await fetchCart();
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user || quantity < 1) return;
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);
    if (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
    await fetchCart();
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    if (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    if (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
    setCartItems([]);
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discount_price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartSubtotal,
      cartLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
