import React from "react";
import BurgerIco from "@assets/icons/BurgerIco";
import Logo from "@assets/icons/Logo";
import "../css/Header.css"

const Header = () => {
  return (
    <header className=" ">
      <div className="container mx-auto px-4  sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button className="focus:outline-none">
              <BurgerIco />
            </button>
          </div>

          <div className=" flex justify-center items-end flex-1 ">
            <Logo className="logo p-"/>
          </div>

          <div className="hidden md:flex flex-col justify-start  items-start s">
            <div className=" loca-date-item p-0 m-0">ru</div>
            <div className=" loca-date-item p-0 m-0">адрес: место, город</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;