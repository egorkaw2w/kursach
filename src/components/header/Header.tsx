// src/components/header/Header.tsx
"use client";
import React, { useState } from "react";
import BurgerIco from "@assets/icons/BurgerIco";
import Logo from "@assets/icons/Logo";
import "./Header.scss";
import Link from "next/link";
import Burger from "@components/Burger/Burger";
import { useAuth } from "src/app/lib/AuthContext";
const testDataBurger = {
  BurgerNavigation: [
    { id: 1, BurgerNavigationName: "Главная", BurgerNavigationTo: "/" },
    { id: 2, BurgerNavigationName: "О нас", BurgerNavigationTo: "/" },
    { id: 3, BurgerNavigationName: "Доставка", BurgerNavigationTo: "/" },
    { id: 4, BurgerNavigationName: "Мероприятия", BurgerNavigationTo: "/" },
    { id: 5, BurgerNavigationName: "Контакты", BurgerNavigationTo: "/" },
  ],
};

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  console.log("Header rendering...");
  const { user, logout } = useAuth();
  console.log("useAuth called, user:", user);

  const toggleBurger = () => setIsBurgerOpen(!isBurgerOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`Header ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button className="focus:outline-none" onClick={toggleBurger}>
              <BurgerIco typeOfBurger={true} />
            </button>
          </div>
          <Link href="/" className="flex justify-center items-end flex-1">
            <Logo className="logo" />
          </Link>
          <div className="hidden md:flex flex-col justify-start items-start relative">
            {user ? (
              <div className="user-menu">
                <button className="user-name" onClick={toggleUserMenu}>
                  <span>{user.fullName}</span>
                  <svg
                    className={`ml-2 h-4 w-4 transform transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="dropdown">
                    <Link href="/Profile" onClick={() => setIsUserMenuOpen(false)}>
                      <button className="dropdown-item">Профиль</button>
                    </Link>
                    <Link href="/cart" onClick={() => setIsUserMenuOpen(false)}>
                      <button className="dropdown-item">Корзина</button>
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/Auth/Login">
                <button className="loca-date-item p-0 m-0">Авторизоваться</button>
              </Link>
            )}
            <div className="loca-date-item p-0 m-0">адрес: место, город</div>
          </div>
        </div>
      </div>

      <div className={`overlay ${isBurgerOpen ? "active" : ""}`} onClick={toggleBurger}></div>
      <div className={`Burger-prikol ${isBurgerOpen ? "open" : ""}`}>
        <Burger
          setIsBurgerOpen={setIsBurgerOpen}
          isBurgerOpened={isBurgerOpen}
          BurgerNavigation={testDataBurger.BurgerNavigation}
        />
      </div>
    </header>
  );
};

export default Header;