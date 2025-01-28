import React from "react";
import "../css/WelcomeImage.css";

const WelcomeImage = () => {
  return (
    <div className="">
      <div className="background flex w-full">
        <div className="flex container mx-auto my-11 flex-col justify-end">
          <nav className="w-2/3 flex p-0 justify-center mx-auto">
            <ul className="Welcome-items flex justify-between p-0 items-center gap-10 ">
              <li className="Welcome-item  px-11 py-3 ">Доставка</li>
              <li className="Welcome-item  px-11 py-3 ">Меню</li>
              <li className="Welcome-item  px-11 py-3 ">Зал</li>
              <li className="Welcome-item  px-11 py-3 ">Мероприятия</li>
            </ul>
          </nav>
          <div className="date-info flex justify-center flex-col items-center mt-6">
            <div className="date-of-day-info">ПН-ВС</div>
            <div className="time-open">Круглосуточно</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeImage;
