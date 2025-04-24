"use client";
import { useState, useEffect } from "react";
import "./profile.scss";
import Link from "next/link";
import { useAuth } from "src/app/lib/AuthContext";
import axios from "axios";
import { parseISO, format, isPast } from "date-fns";
import { ru } from "date-fns/locale";

const Profile = () => {
  const { user, userId, isAuthReady } = useAuth();
  console.log("Profile: user from useAuth:", user);
  console.log("Profile: userId from useAuth:", userId);
  console.log("Profile: isAuthReady:", isAuthReady);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || "Неизвестный пользователь",
    DOB: "",
    mail: "",
    img: "",
    roleId: null as number | null,
    roleName: "",
    login: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "reservations">("profile");
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [reservationsError, setReservationsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !userId) {
        setError("Пользователь не авторизован.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching profile data for userId: ${userId}`);
        const response = await axios.get(`http://strhzy.ru:8080/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Fetch response status:", response.status);
        console.log("Response data:", response.data);

        const data = response.data.data || response.data;

        if (!data || typeof data !== "object") {
          throw new Error("Данные пользователя не найдены в ответе сервера.");
        }

        console.log("Profile data loaded:", data);
        setFormData({
          name: data.fullName || user.fullName || "Неизвестный пользователь",
          DOB: data.birthDate || "",
          mail: data.email || "",
          img: data.avatarUrl || "",
          roleId: data.roleId || null,
          roleName: data.roleName || "",
          login: data.login || "",
          phone: data.phone || "",
        });
      } catch (err: any) {
        console.error("Fetch error:", err);
        let errorMessage = "Ошибка при загрузке данных.";
        if (err.response) {
          console.log("Error response data:", err.response.data);
          errorMessage = err.response.data.error || errorMessage;
        } else if (err.request) {
          errorMessage = "Сервер не отвечает. Проверьте подключение.";
        } else {
          errorMessage = err.message || errorMessage;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthReady) {
      fetchProfileData();
    }
  }, [userId, isAuthReady]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        const response = await axios.get("http://strhzy.ru:8080/api/Orders");
        console.log("Orders response data:", response.data);
        console.log("Current userId:", userId);
        const userOrders = response.data
          .filter((order: any) => Number(order.userId) === Number(userId))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log("Filtered and sorted userOrders:", userOrders);
        setOrders(userOrders);
      } catch (err: any) {
        console.error("Fetch orders error:", err);
        setOrdersError("Ошибка при загрузке заказов.");
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchReservations = async () => {
      if (!userId) return;
      try {
        setReservationsLoading(true);
        setReservationsError(null);
        const response = await axios.get("http://strhzy.ru:8080/api/TableReservations");
        console.log("Reservations response data:", response.data);
        console.log("Current userId:", userId);
        const userReservations = response.data
          .filter((reservation: any) => Number(reservation.userId) === Number(userId))
          .filter((reservation: any) => {
            const reservationEndTime = new Date(reservation.reservationTime);
            reservationEndTime.setMinutes(reservationEndTime.getMinutes() + reservation.durationMinutes);
            return !isPast(reservationEndTime);
          })
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log("Filtered and sorted userReservations:", userReservations);
        setReservations(userReservations);
      } catch (err: any) {
        console.error("Fetch reservations error:", err);
        setReservationsError("Ошибка при загрузке бронирований.");
      } finally {
        setReservationsLoading(false);
      }
    };

    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "reservations") {
      fetchReservations();
    }
  }, [activeTab, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      setError("Пользователь не авторизован.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.mail)) {
      setError("Пожалуйста, введите корректный email.");
      return;
    }

    if (formData.DOB) {
      const today = new Date();
      const birthDate = new Date(formData.DOB);
      if (birthDate > today) {
        setError("Дата рождения не может быть в будущем.");
        return;
      }
    }

    try {
      setError(null);
      const payload = {
        id: userId,
        fullName: formData.name,
        birthDate: formData.DOB || null,
        email: formData.mail,
        avatarUrl: formData.img || null,
        roleId: formData.roleId,
        roleName: formData.roleName,
        login: formData.login,
        phone: formData.phone,
      };
      console.log("Saving profile data:", payload);

      const response = await axios.put(`http://strhzy.ru:8080/api/users/${userId}`, payload);

      console.log("Save response status:", response.status);
      console.log("Save response data:", response.data);

      setIsEditing(false);
    } catch (err: any) {
      console.error("Save error:", err);
      let errorMessage = "Ошибка при сохранении данных.";
      if (err.response) {
        console.log("Error response data:", err.response.data);
        if (err.response.data.errors) {
          const errors = err.response.data.errors;
          console.log("Validation errors:", errors);
          const errorFields = [];
          if (errors.Email) errorFields.push(`Email: ${errors.Email[0]}`);
          if (errors.BirthDate) errorFields.push(`Дата рождения: ${errors.BirthDate[0]}`);
          if (errors.FullName) errorFields.push(`Имя: ${errors.FullName[0]}`);
          if (errors.AvatarUrl) errorFields.push(`URL аватара: ${errors.AvatarUrl[0]}`);
          if (errors.RoleId) errorFields.push(`Роль: ${errors.RoleId[0]}`);
          if (errors.Login) errorFields.push(`Логин: ${errors.Login[0]}`);
          if (errors.Phone) errorFields.push(`Телефон: ${errors.Phone[0]}`);
          if (errorFields.length > 0) {
            errorMessage = errorFields.join("; ");
          } else {
            errorMessage = JSON.stringify(errors);
          }
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else {
          errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Сервер не отвечает. Проверьте подключение.";
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    }
  };

  const openModal = () => {
    setNewImageUrl(formData.img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewImageUrl("");
  };

  const handleImageChange = () => {
    setFormData((prev) => ({ ...prev, img: newImageUrl }));
    setImgError(false);
    closeModal();
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await axios.delete(`http://strhzy.ru:8080/api/TableReservations/${reservationId}`);
      setReservations((prev) => prev.filter((res) => res.id !== reservationId));
    } catch (err: any) {
      setReservationsError("Ошибка при отмене бронирования.");
    }
  };

  const formatReservationTime = (time: string) => {
    try {
      const date = parseISO(time);
      return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return "Недоступно";
    }
  };

  const formatOrderTime = (time: string) => {
    try {
      const date = parseISO(time);
      return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return "Недоступно";
    }
  };

  if (!isAuthReady) {
    return <div className="container mx-auto mt-10 text-center">Проверка авторизации...</div>;
  }

  if (!user || !userId) {
    return (
      <div className="container mx-auto mt-10 text-center">
        <p>Пожалуйста, авторизуйтесь, чтобы просмотреть профиль.</p>
        <Link href="/Auth/Login" className="text-blue-500 underline">
          Войти
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto mt-10 text-center">Загрузка...</div>;
  }

  return (
    <div className="Profile container mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center my-10">
        Здравствуйте, {formData.name}
      </h1>

      <div className="tabs flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 mx-2 rounded-lg ${activeTab === "profile" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600 hover:text-white transition`}
        >
          Профиль
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 mx-2 rounded-lg ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600 hover:text-white transition`}
        >
          Мои заказы
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`px-4 py-2 mx-2 rounded-lg ${activeTab === "reservations" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} hover:bg-blue-600 hover:text-white transition`}
        >
          Мои брони
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="Profile__img flex flex-col items-center">
            <img
              src={
                imgError || !formData.img
                  ? "https://via.placeholder.com/150?text=Avatar"
                  : formData.img
              }
              alt="profile Img"
              className="w-48 h-48 rounded-full object-cover shadow-lg"
              onError={() => setImgError(true)}
            />
            {isEditing && (
              <button
                onClick={openModal}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Изменить
              </button>
            )}
          </div>
          <div className="Profile__data w-full md:w-3/4 mx-auto">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="DOB flex justify-between items-center py-2 my-4">
              <p className="font-medium">День рождения</p>
              {isEditing ? (
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 dark-input"
                />
              ) : (
                <p>{formData.DOB || "Не указан"}</p>
              )}
            </div>
            <div className="profile__mail flex justify-between items-center py-2">
              <p className="font-medium">Почта</p>
              {isEditing ? (
                <input
                  type="email"
                  name="mail"
                  value={formData.mail}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 dark-input"
                />
              ) : (
                <p>{formData.mail || "Не указан"}</p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Сохранить
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Редактировать
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="orders">
          <h2 className="text-2xl font-bold mb-4 text-center">Мои заказы</h2>
          {ordersLoading && <p className="text-center">Загрузка заказов...</p>}
          {ordersError && <p className="text-red-500 text-center">{ordersError}</p>}
          {orders.length === 0 && !ordersLoading && !ordersError && (
            <p className="text-center">У вас нет заказов.</p>
          )}
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg shadow">
                <p><strong>Заказ #{order.id}</strong></p>
                <p>Статус: {order.status}</p>
                <p>Общая сумма: {order.totalPrice} ₽</p>
                <p>Дата создания: {formatOrderTime(order.createdAt)}</p>
                <p>Адрес: {order.address?.addressText || "Не указан"}</p>
                <p>Товары:</p>
                <ul className="list-disc pl-5">
                  {order.orderItems.map((item: any) => (
                    <li key={item.id}>
                      {item.menuItemName} - {item.quantity} шт. (по {item.priceAtOrder} ₽)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reservations" && (
        <div className="reservations">
          <h2 className="text-2xl font-bold mb-4 text-center">Мои брони</h2>
          {reservationsLoading && <p className="text-center">Загрузка бронирований...</p>}
          {reservationsError && <p className="text-red-500 text-center">{reservationsError}</p>}
          {reservations.length === 0 && !reservationsLoading && !reservationsError && (
            <p className="text-center">У вас нет актуальных бронирований.</p>
          )}
          <div className="grid grid-cols-1 gap-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="border p-4 rounded-lg shadow">
                <p><strong>Бронирование #{reservation.id}</strong></p>
                <p>Стол: {reservation.tableName}</p>
                <p>Время: {formatReservationTime(reservation.reservationTime)}</p>
                <p>Длительность: {reservation.durationMinutes} минут</p>
                {reservation.comment && <p>Комментарий: {reservation.comment}</p>}
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Отменить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal__overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal__content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Изменить аватар
            </h2>
            <input
              type="text"
              placeholder="Введите URL изображения..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleImageChange}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Изменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;