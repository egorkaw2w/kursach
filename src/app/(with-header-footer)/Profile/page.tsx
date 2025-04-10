// src/components/profile/Profile.tsx
"use client";
import { useState, useEffect } from "react";
import "./profile.scss";
import Link from "next/link";
import { useAuth } from "src/app/lib/AuthContext";

const Profile = () => {
  const { user, userId, isAuthReady } = useAuth();
  console.log("Profile: user from useAuth:", user);
  console.log("Profile: userId from useAuth:", userId);
  console.log("Profile: isAuthReady:", isAuthReady);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    DOB: "",
    mail: "",
    img: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const response = await fetch(`http://localhost:5252/api/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Fetch response status:", response.status);
        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (response.ok) {
          const parsedResponse = JSON.parse(responseText);
          const data = parsedResponse.data; // Данные внутри data
          console.log("Profile data loaded:", data);
          setFormData({
            name: data.fullName || "",
            DOB: data.birthDate || "", // Используем birthDate вместо dob
            mail: data.email || "",
            img: data.avatarUrl || "", // Используем avatarUrl вместо img
          });
        } else {
          const errorData = JSON.parse(responseText);
          setError(errorData.error || "Не удалось загрузить данные профиля.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Ошибка при загрузке данных.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthReady) {
      fetchProfileData();
    }
  }, [user, userId, isAuthReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      setError("Пользователь не авторизован.");
      return;
    }

    try {
      setError(null);
      console.log("Saving profile data:", formData);
      const response = await fetch(`http://localhost:5252/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          fullName: formData.name,
          birthDate: formData.DOB, // Используем birthDate
          email: formData.mail,
          avatarUrl: formData.img, // Используем avatarUrl
        }),
      });

      console.log("Save response status:", response.status);
      const responseText = await response.text();
      console.log("Save response text:", responseText);

      if (response.ok) {
        setIsEditing(false);
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.error || "Не удалось обновить профиль.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Ошибка при сохранении данных.");
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
    <div className="Profile container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      <h1 className="col-span-1 md:col-span-2 self-center justify-self-center my-10 text-3xl font-bold">
        Здравствуйте, {formData.name}
      </h1>
      <div className="Profile__img flex justify-center">
        <img
          src={formData.img}
          alt="profile Img"
          className="w-48 h-48 rounded-full object-cover shadow-lg"
        />
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
            <p>{formData.DOB}</p>
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
            <p>{formData.mail}</p>
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
  );
};

export default Profile;