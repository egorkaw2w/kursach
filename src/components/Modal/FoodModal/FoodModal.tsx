// src/components/Modal/FoodModal/FoodModal.tsx
"use client";

import { useAuth } from "src/app/lib/AuthContext";
import { addToCart, getOrCreateCart } from "src/services/CartService";
import "./FoodModal.scss";
import { toast } from "react-toastify";

type FoodModalProps = {
  FoodName: string;
  FoodeDescription: string;
  FoodImage: string;
  FoodPrice: string;
  FoodId: number;
  onClose: () => void;
};

const FoodModal = ({
  FoodName,
  FoodeDescription,
  FoodImage,
  FoodPrice,
  FoodId,
  onClose,
}: FoodModalProps) => {
  const { userId } = useAuth();

  const handleOrder = async () => {
    if (!userId) {
      toast.error("Пожалуйста, авторизуйтесь для добавления в корзину");
      return;
    }

    try {
      console.log("Добавление в корзину:", { userId, FoodId });
      const cart = await getOrCreateCart(userId);
      console.log("Получена корзина:", cart);
      await addToCart(cart.id, FoodId, 1);
      toast.success("Товар добавлен в корзину!");
      onClose();
    } catch (err: any) {
      console.error("Ошибка добавления в корзину:", err);
      if (err.response) {
        console.error("Ответ сервера:", err.response.data);
        toast.error(`Ошибка: ${err.response.data.message || "Не удалось добавить товар"}`);
      } else {
        toast.error("Не удалось добавить товар в корзину");
      }
    }
  };

  return (
    <div className="FoodModal-overlay" onClick={onClose}>
      <div className="FoodModal-content" onClick={(e) => e.stopPropagation()}>
        <div className="Food-item">
          <button className="Close-btn" onClick={onClose}>
            ✕
          </button>
          <div className="foodTitle">
            <h3>{FoodName}</h3>
          </div>
          <div className="foodContent grid grid-cols-2">
            <div className="foodImage">
              <img src={FoodImage} alt={FoodName} />
            </div>
            <div className="foodDescription">{FoodeDescription}</div>
          </div>
          <div className="foodFooter">
            <div className="foodPrice">{FoodPrice} ₽</div>
            <button className="Order-btn" onClick={handleOrder}>
              Заказать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;