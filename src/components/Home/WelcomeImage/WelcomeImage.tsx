"use client";
import React, { useState } from "react";
import "./WelcomeImage.scss";
import Link from "next/link";
import HallModal from "@components/Hall/Hall";

const WelcomeImage: React.FC = () => {
  const [isHallOpen, setIsHallOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  return (
    <div className="">
      <div className="background flex w-full">
        <div className="flex container mx-auto my-11 flex-col justify-end">
          <nav className="w-2/3 flex p-0 justify-center mx-auto">
            <ul className="Welcome-items flex justify-between p-0 items-center gap-10">
              <li className="Welcome-item">
                <Link href="" className="Welcome-link px-11 py-3">
                  Доставка
                </Link>
              </li>
              <li className="Welcome-item">
                <Link href="/Menu" className="Welcome-link px-11 py-3">
                  Меню
                </Link>
              </li>
              <li className="Welcome-item Welcome-link ">
                <button
                  onClick={() => setIsHallOpen(true)}
                  className="  px-11 py-3"
                >
                  Зал
                </button>
              </li>
              <li className="Welcome-item">
                <Link href="/Events" className="Welcome-link px-11 py-3">
                  Мероприятия
                </Link>
              </li>
            </ul>
          </nav>
          <div className="date-info flex justify-center flex-col items-center mt-6">
            <div className="date-of-day-info">ПН-ВС</div>
            <div className="time-open">Круглосуточно</div>
          </div>
        </div>
      </div>
      <HallModal
        isOpen={isHallOpen}
        onClose={() => setIsHallOpen(false)}
        setNotification={setNotification}
      />
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default WelcomeImage;