'use client'
import Logo from "@assets/icons/Logo";
import "./Burger.scss";
import Link from "next/link";
import BurgerIco from "@assets/icons/BurgerIco";
import { useState } from "react";

type BurgerNavigationItem = {
  id: number;
  BurgerNavigationName: string;
  BurgerNavigationTo: string;
};

type BurgerProps = {
  BurgerNavigation: BurgerNavigationItem[];
  setIsBurgerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBurgerOpened: boolean
  className?: string
};

const Burger = ({ BurgerNavigation, setIsBurgerOpen, isBurgerOpened,className }: BurgerProps) => {
  const BurgerNav = BurgerNavigation;
const BurgerHandle = () =>{
    setIsBurgerOpen(!isBurgerOpened);
    console.log(isBurgerOpened)
}
  return (
    <div className={`Burger px-10  w-1/3 h-screen py-10 ${className}`}>
      <div className="Burger__header flex flex-row-reverse items-start justify-between  ">
        <button className="cursor-pointer pt-3" onClick={BurgerHandle}>
          <BurgerIco typeOfBurger = {false} />
        </button>
        <Logo className="" />
      </div>
<div className="Burger__body flex flex-col gap-5">
          {BurgerNav?.map((item) => (
            <Link  href={item.BurgerNavigationTo} className="Burger__link" key={item.id}>
              {item.BurgerNavigationName}
            </Link>
          ))}
</div>
      <div className="Burger__footer flex flex-col justify-between h-full ">
        <button className="Burger-action-button mx-auto  px-20 py-3 ">
          <Link href="">Забронировать столик</Link>
        </button>
        <div>
            <ul className="contact_info flex flex-col  ">
              <li className="Burger__tel">
                <span className="Burger__Contact-info-dark">Тел: </span> +7 123 456 78 90
              </li>
              <li className="Burger__tel">
                <span className="Burger__Contact-info-dark">Тел: </span> +7 123 456 78 90 (доб 123)
              </li>
              <li className="Burger__mail">
                <span className="Burger__Contact-info-dark">Почта: </span>  ChillAndDrill@gmail.com
              </li>
              <li className="Burger__adress">
                <span className="Burger__Contact-info-dark">Адрес: </span> г. Москва,  ул. Никакущая 12
              </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Burger;
