"use client";
import React, { useState } from "react";
import BurgerIco from "@assets/icons/BurgerIco";
import Logo from "@assets/icons/Logo";
import "./Header.scss";
import Link from "next/link";
import Burger from "@components/Burger/Burger";

const testDataBurger = {
  BurgerNavigation: [
    { id: 1, BurgerNavigationName: "Главная", BurgerNavigationTo: "/" },
    { id: 2, BurgerNavigationName: "О нас", BurgerNavigationTo: "/" },
    { id: 3, BurgerNavigationName: "Доставка", BurgerNavigationTo: "/" },
    { id: 4, BurgerNavigationName: "Мероприятия", BurgerNavigationTo: "/" },
    { id: 5, BurgerNavigationName: "Контакты", BurgerNavigationTo: "/" },
  ],
};

const Header = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const toggleBurger = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  return (
    <header className="Header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button className="focus:outline-none" onClick={toggleBurger}>
              <BurgerIco typeOfBurger = {true} />
            </button>
          </div>
          <Link href="/" className="flex justify-center items-end flex-1">
            <Logo className="logo" />
          </Link>
          <div className="hidden md:flex flex-col justify-start items-start">
            <div className="loca-date-item p-0 m-0">ru</div>
            <div className="loca-date-item p-0 m-0">адрес: место, город</div>
          </div>
        </div>
      </div>

      {/* Всегда рендерим overlay и Burger-prikol */}
<div className={`overlay ${isBurgerOpen ? 'active' : ''}`} onClick={toggleBurger}></div>
      <div className={`Burger-prikol ${isBurgerOpen ? 'open' : ''} `}>
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