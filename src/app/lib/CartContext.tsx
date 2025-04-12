// src/app/lib/CartContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getOrCreateCart, getCartItems} from '../../services/CartService';

interface CartContextType {
  cartItems: any[];
  cartId: number | null;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);

  const refreshCart = async () => {
    if (!userId) {
      setCartItems([]);
      setCartId(null);
      return;
    }
    try {
      const cart = await getOrCreateCart(userId);
      setCartId(cart.id);
      const items = await getCartItems(cart.id);
      setCartItems(items);
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [userId]);

  return (
    <CartContext.Provider value={{ cartItems, cartId, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};