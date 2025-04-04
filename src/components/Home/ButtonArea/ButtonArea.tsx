"use client"; // Добавляем, потому что будем использовать состояние
import React, { useState } from "react";
import ActionButton from "@components/ActionButton/ActionButton";
import "./ButtonArea.scss";
import HallModal from "@components/Hall/Hall";

const ButtonArea = () => {
  const [isHallOpen, setIsHallOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  return (
    <div className="ButtonArea container w-7/12 m-auto flex justify-around">
      <ActionButton
        buttonText="Меню"
        img="/usable_img/FoodImage/image.png"
        imgHover="/icons/menu.svg"
        LinkTo="/Menu"
      />
      <ActionButton
        buttonText="Мероприятия"
        img="/usable_img/image (1).png"
        imgHover="/icons/party.svg"
      />
      <ActionButton
        buttonText="Зал"
        img="/usable_img/image (2).png"
        imgHover="/icons/hall.svg"
        onModalOpen={() => setIsHallOpen(true)} // Передаём функцию для открытия модалки
      />
      <HallModal
        isOpen={isHallOpen}
        onClose={() => setIsHallOpen(false)}
        setNotification={setNotification}
      />
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default ButtonArea;