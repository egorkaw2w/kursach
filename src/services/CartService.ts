// src/services/CartService.ts
import axios from "axios";

const API_URL = "http://localhost:5252/api";

interface Cart {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
}

interface CartItem {
  id: number;
  cartId: number;
  menuItemId: number;
  menuItemName: string;
  menuItemPrice: number;
  quantity: number;
  createdAt: string;
}

// Получить или создать корзину пользователя
export const getOrCreateCart = async (userId: number): Promise<Cart> => {
  try {
    const response = await axios.get(`${API_URL}/Carts?userId=${userId}`);
    const carts = response.data;
    if (carts.length > 0) {
      return carts[0];
    }

    const newCart = await axios.post(`${API_URL}/Carts`, {
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newCart.data;
  } catch (error) {
    console.error("Ошибка получения/создания корзины:", error);
    throw error;
  }
};

// Получить товары в корзине
export const getCartItems = async (cartId: number): Promise<CartItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/CartItems?cartId=${cartId}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка получения товаров корзины:", error);
    throw error;
  }
};

// Добавить товар в корзину
export const addToCart = async (
    cartId: number,
    menuItemId: number,
    quantity: number = 1
  ) => {
    try {
      const response = await axios.post(`${API_URL}/CartItems`, {
        cartId,
        menuItemId,
        quantity,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка добавления товара в корзину:", error);
      throw error;
    }
  };

// Обновить количество товара
export const updateCartItemQuantity = async (itemId: number, quantity: number) => {
  try {
    await axios.put(`${API_URL}/CartItems/${itemId}`, {
      id: itemId,
      quantity,
    });
  } catch (error) {
    console.error("Ошибка обновления количества:", error);
    throw error;
  }
};

// Удалить товар из корзины
export const removeFromCart = async (itemId: number) => {
  try {
    await axios.delete(`${API_URL}/CartItems/${itemId}`);
  } catch (error) {
    console.error("Ошибка удаления товара:", error);
    throw error;
  }
};

// Создать заказ
export const createOrder = async (
  userId: number,
  addressId: number,
  cartItems: CartItem[]
) => {
  try {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.menuItemPrice, // Используем menuItemPrice
      0
    );
    const response = await axios.post(`${API_URL}/Orders`, {
        userId,
        addressId,
        totalPrice,
        status: "pending",
        orderItems: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceAtOrder: item.menuItemPrice,
        })),
      });
    return response.data;
  } catch (error) {
    console.error("Ошибка создания заказа:", error);
    throw error;
  }
};

// Получить адреса пользователя
export const getUserAddresses = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/Addresses?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка получения адресов:", error);
    throw error;
  }
};

// Добавить новый адрес
export const addAddress = async (
  userId: number,
  addressText: string,
  isDefault: boolean = false
) => {
  try {
    const response = await axios.post(`${API_URL}/Addresses`, {
      userId,
      addressText,
      isDefault,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка добавления адреса:", error);
    throw error;
  }
};