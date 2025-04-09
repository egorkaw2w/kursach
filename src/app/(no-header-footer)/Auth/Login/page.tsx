// src/app/(no-header-footer)/Auth/Login/page.tsx
"use client";
import { useState } from "react";
import Logo from "@assets/icons/Logo";
import "./Login.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "src/app/lib/AuthContext";
const Login = () => {
  const [loginData, setLoginData] = useState({ login: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { login: username, password } = loginData;

    if (!username || !password) {
      setError("Введите логин и пароль!");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending login request with:", { login: username, password });
      const response = await fetch("http://localhost:5252/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: username, password }),
      });

      console.log("Fetch response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (response.ok) {
        const data = JSON.parse(responseText).Data;
        console.log("Login successful, user data:", data);
        login({ fullName: data.fullName }, data.id);
        setTimeout(() => {
          console.log("Redirecting to / after login");
          router.push("/");
        }, 500);
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.Error || "Неверный логин или пароль!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="Login flexc flex-col">
      <Logo className="" />
      <h1 className="title">Авторизация</h1>
      <div className="LoginArea flex justify-center items-center">
        <form onSubmit={handleSubmit}>
          {error && <div className="notification error">{error}</div>}
          <div className="input-wrapper">
            <input
              className="Login__login"
              placeholder="Логин"
              name="login"
              value={loginData.login}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-wrapper">
            <input
              className="Login__password"
              placeholder="Пароль"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="ToAuth self-end">
            <p>
              Нет аккаунта? <Link href="../Register">Зарегистрируйся!</Link>
            </p>
          </div>
          <button className="Login-btn px-10 py-2" type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Авторизоваться"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;