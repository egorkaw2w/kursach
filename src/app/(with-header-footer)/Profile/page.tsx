// src/components/profile/Profile.tsx
"use client";
import { useState, useEffect } from "react";
import "./profile.scss";
import Link from "next/link";
import { useAuth } from "src/app/lib/AuthContext";
import axios from "axios";

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
    login: "", // Добавляем login
    phone: "", // Добавляем phone
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

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
          login: data.login || "", // Сохраняем login
          phone: data.phone || "", // Сохраняем phone
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      setError("Пользователь не авторизован.");
      return;
    }

    // Валидация email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.mail)) {
      setError("Пожалуйста, введите корректный email.");
      return;
    }

    // Валидация birthDate (только на будущую дату)
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
        login: formData.login, // Добавляем login
        phone: formData.phone, // Добавляем phone
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
          if (errors.Email) {
            errorFields.push(`Email: ${errors.Email[0]}`);
          }
          if (errors.BirthDate) {
            errorFields.push(`Дата рождения: ${errors.BirthDate[0]}`);
          }
          if (errors.FullName) {
            errorFields.push(`Имя: ${errors.FullName[0]}`);
          }
          if (errors.AvatarUrl) {
            errorFields.push(`URL аватара: ${errors.AvatarUrl[0]}`);
          }
          if (errors.RoleId) {
            errorFields.push(`Роль: ${errors.RoleId[0]}`);
          }
          if (errors.Login) {
            errorFields.push(`Логин: ${errors.Login[0]}`);
          }
          if (errors.Phone) {
            errorFields.push(`Телефон: ${errors.Phone[0]}`);
          }
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
    <div className="Profile container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      <h1 className="col-span-1 md:col-span-2 self-center justify-self-center my-10 text-3xl font-bold">
        Здравствуйте, {formData.name}
      </h1>
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