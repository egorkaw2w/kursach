// src/app/Register/page.tsx
"use client";
import { useState } from "react";
import Logo from "@assets/icons/Logo";
import "./Register.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleShowPasswordChange = () => setShowPassword((prev) => !prev);
  const handleShowConfirmPasswordChange = () => setShowConfirmPassword((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { login, firstName, lastName, middleName, birthDate, phone, email, password, confirmPassword } = formData;

    // Локальная валидация
    if (!login || !firstName || !lastName || !middleName || !birthDate || !phone || !email || !password || !confirmPassword) {
      setError("Все поля должны быть заполнены!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают!");
      setLoading(false);
      return;
    }

    if (!Date.parse(birthDate)) {
      setError("Укажите корректную дату рождения!");
      setLoading(false);
      return;
    }

    const fullName = `${lastName} ${firstName} ${middleName}`.trim();
    const userData = {
      login,
      fullName,
      birthDate,
      phone,
      email,
      passwordHash: password,
      roleId: 1,
    };

    try {
      const response = await fetch("http://localhost:5252/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseText = await response.text();

      if (response.ok) {
        setTimeout(() => router.push("/"), 0);
      } else {
        let errorMessage = "Что-то пошло не так, попробуйте снова.";
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.message.includes("Логин уже занят")) {
            errorMessage = "Этот логин уже занят, выберите другой.";
          } else if (errorData.message.includes("Email уже занят")) {
            errorMessage = "Этот email уже зарегистрирован.";
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = "Ошибка на сервере, попробуйте позже.";
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      setError("Не удалось подключиться к серверу. Проверьте интернет и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="Register container mx-auto justify-center items-center min-h-screen flex flex-col">
      <Logo className="mb-6" />
      <h1 className="title">Регистрация</h1>
      <div className="RegisterArea flex flex-col justify-center items-center gap-4">
        <form onSubmit={handleSubmit}>
          {/* Уведомления */}
          {error && (
            <div className="notification error">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="notification success">
              <span>{success}</span>
            </div>
          )}

          <div className="input-wrapper">
            <input
              className="input_field"
              type="text"
              placeholder="Логин"
              name="login"
              value={formData.login}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-wrapper name-group flex gap-5">
            <div className="input-field">
              <input
                className="UserData_Input"
                type="text"
                placeholder="Фамилия"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <input
                className="UserData_Input"
                type="text"
                placeholder="Имя"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <input
                className="UserData_Input"
                type="text"
                placeholder="Отчество"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="input-wrapper">
            <input
              className="UserData_Input"
              type="date"
              placeholder="Дата рождения"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-wrapper">
            <input
              className="UserData_Input"
              type="tel"
              placeholder="Номер"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-wrapper">
            <input
              className="UserData_Input"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-wrapper passwordBox flex items-center">
            <input
              className="UserData_Input"
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="checkbox"
              className="ShpwPassword"
              checked={showPassword}
              onChange={handleShowPasswordChange}
            />
          </div>

          <div className="input-wrapper passwordBox flex items-center">
            <input
              className="UserData_Input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Подтверждение пароля"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <input
              type="checkbox"
              className="ShpwPassword"
              checked={showConfirmPassword}
              onChange={handleShowConfirmPasswordChange}
            />
          </div>

          <div className="Register__footer w-full flex flex-col mt-10 gap-5">
            <div className="ToLogin">
              <p className="linkToLogin justify-self-end">
                Есть аккаунт? <Link href="/Auth/Login">Войди!</Link>
              </p>
            </div>
            <button
              className="Register-btn py-1 self-center text-center px-10"
              type="submit"
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Зарегистрироваться"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;