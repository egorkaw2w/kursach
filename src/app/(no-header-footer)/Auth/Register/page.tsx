"use client"; // Добавляем, так как используем состояние
import { useState } from "react";
import Logo from "@assets/icons/Logo";
import "./Register.scss";
import Link from "next/link";

const Register = () => {
  // Состояние для чекбокса "Пароль"
  const [showPassword, setShowPassword] = useState(false);
  // Состояние для чекбокса "Подтверждение пароля"
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Обработчик для чекбокса "Пароль"
  const handleShowPasswordChange = () => {
    setShowPassword((prev) => !prev);
  };

  // Обработчик для чекбокса "Подтверждение пароля"
  const handleShowConfirmPasswordChange = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <main className="Register container mx-auto justify-center items-center min-h-screen flex flex-col">
      <Logo className="mb-6" />
      <h1 className="title">Регистрация</h1>
      <div className="RegisterArea flex flex-col justify-center items-center gap-4">
        <form>
          <div className="input-wrapper">
            <input
              className="input_field"
              type="text"
              placeholder="Логин"
            />
          </div>
          <div className="input-wrapper name-group flex gap-5">
            <div className="input-field">
              <input
                className="UserData_Input"
                type="text"
                placeholder="Фамилия"
              />
            </div>
            <div className="input-field">
              <input
                className="UserData_Input"
                type="text"
                placeholder="Имя"
              />
            </div>
           <div className="input-field">
              <input
                className="UserData_Input"
                type="text"
                placeholder="Отчество"
              />
            </div>
          </div>

          {/* Поле для даты рождения */}
          <div className="input-wrapper">
            <input
              className="UserData_Input"
              type="date"
              placeholder="Дата рождения"
            />
          </div>

          {/* Поле для номера телефона */}
          <div className="input-wrapper">
            <input
              className="UserData_Input"
              type="tel"
              placeholder="Номер"
            />
          </div>

          {/* Поле для email */}
          <div className="input-wrapper">
            <input
              className="UserData_Input"
              type="email"
              placeholder="Email"
            />
          </div>

          {/* Поле для пароля */}
          <div className="input-wrapper passwordBox flex items-center">
            <input
              className="UserData_Input"
              type={showPassword ? "text" : "password"} // Переключаем тип в зависимости от состояния
              placeholder="Пароль"
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
            />
            <input
              type="checkbox"
              className="ShpwPassword"
              checked={showConfirmPassword}
              onChange={handleShowConfirmPasswordChange}
            />
          </div>
        </form>

        {/* Футер с кнопкой и ссылкой */}
        <div className="Register__footer w-full flex flex-col mt-10 gap-5">
          <div className="ToLogin">
            <p className="linkToLogin justify-self-end">
              Есть аккаунт? <Link href="/Auth/Login">Войди!</Link>
            </p>
          </div>
          <button
            className="Register-btn py-1 self-center text-center px-10"
            type="submit"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </main>
  );
};

export default Register;