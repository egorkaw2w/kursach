import ActionButton from "@components/ActionButton/ActionButton";
import "./ButtonArea.scss";

const ButtonArea = () => {
  return (
    <div className="ButtonArea container w-7/12 m-auto flex justify-around ">
        <ActionButton buttonText="Меню" img = "/usable_img/FoodImage/image.png" imgHover="/icons/menu.svg" />
        <ActionButton buttonText="Мероприятия" img = "/usable_img/image (1).png" imgHover="/icons/party.svg" />
        <ActionButton buttonText="Меню" img = "/usable_img/image (2).png" imgHover="/icons/hall.svg" />
    </div>

  );
};

export default ButtonArea;