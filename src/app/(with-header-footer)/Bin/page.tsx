// src/components/Bin/Bin.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import BinItem from "@components/Bin-item/Bin-item";
import CheckoutModal from "@components/Modal/CheckoutModal/CheckoutModal";
import {
  getOrCreateCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "../../../services/CartService";
import "./Bin.scss";

const Bin = () => {
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setError("Пожалуйста, авторизуйтесь для просмотра корзины");
        setLoading(false);
        return;
      }

      try {
        const cart = await getOrCreateCart(userId);
        setCartId(cart.id);
        const items = await getCartItems(cart.id);
        setCartItems(items);
      } catch (err) {
        setError("Ошибка загрузки корзины");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const removeItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Ошибка удаления товара:", err);
      alert("Не удалось удалить товар");
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Ошибка обновления количества:", err);
      alert("Не удалось обновить количество");
    }
  };

  const handleOrderSuccess = () => {
    setCartItems([]); // Очищаем корзину после заказа
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.menuItemPrice, // Используем menuItemPrice вместо menuItem.price
    0
  );

  if (loading) return <div className="Bin container mx-auto mt-10">Загрузка...</div>;
  if (error) return <div className="Bin container mx-auto mt-10">{error}</div>;

  return (
    <div className="Bin container mx-auto mt-10">
      <h2 className="Bin-title text-2xl font-bold mb-6">Корзина</h2>
      {cartItems.length === 0 ? (
        <p className="Bin-empty">Корзина пуста</p>
      ) : (
        <>
          <div className="Bin-list">
            {cartItems.map((item) => (
              <BinItem
                key={item.id}
                GoodName={item.menuItemName} // menuItemName вместо menuItem.name
                GoodDesc={item.menuItemDescription || "Без описания"} // Если API возвращает description
                GoodImg={
                  item.menuItemId
                    ? `http://localhost:5252/api/MenuItems/image/${item.menuItemId}`
                    : "/usable_img/default-food.png"
                }
                GoodPrice={(item.menuItemPrice * item.quantity).toFixed(2)} // menuItemPrice
                Quantity={item.quantity}
                onRemove={() => removeItem(item.id)}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
              />
            ))}
          </div>
          <div className="Bin-total mt-6">
            <p className="text-xl font-semibold">Итого: {totalPrice.toFixed(2)} ₽</p>
            <button
              className="Checkout-btn mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              onClick={() => setIsCheckoutOpen(true)}
            >
              Оформить заказ
            </button>
          </div>
        </>
      )}
      {isCheckoutOpen && cartId && (
        <CheckoutModal
          cartId={cartId}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};

export default Bin;