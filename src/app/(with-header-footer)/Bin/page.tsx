'use client'
import { useState } from "react";
import BinItem from "@components/Bin-item/Bin-item";
import "./Bin.scss";

const Bin = () => {
  // Пример состояния с товарами (в будущем можно брать из базы данных или контекста)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      GoodName: "Тестовый товар",
      GoodDesc: "Описание тестового товара, чтобы проверить, как оно выглядит в корзине.",
      GoodImg: "/usable_img/EventsImage/EventTestImage.jpg",
      GoodPrice: 500, // Добавим цену для подсчёта
    },
    {
      id: 2,
      GoodName: "Второй товар",
      GoodDesc: "Ещё одно описание, покороче.",
      GoodImg: "/usable_img/EventsImage/EventTestImage.jpg",
      GoodPrice: 300,
    },
  ]);

  // Функция для удаления товара из корзины
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Подсчёт общей стоимости
  const totalPrice = cartItems.reduce((sum, item) => sum + item.GoodPrice, 0);

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
                GoodName={item.GoodName}
                GoodDesc={item.GoodDesc}
                GoodImg={item.GoodImg}
                GoodPrice={item.GoodPrice.toString()}
                onRemove={() => removeItem(item.id)} // Передаём функцию удаления
              />
            ))}
          </div>
          <div className="Bin-total mt-6">
            <p className="text-xl font-semibold">Итого: {totalPrice} ₽</p>
            <button className="Checkout-btn mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Bin;