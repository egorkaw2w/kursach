import Link from "next/link";
import "./ActionButton.scss";

type ActionProps = {
  buttonText: string;
  img?: string;
  imgHover?: string;
  LinkTo?: string;
  onModalOpen?: () => void; // Функция для открытия модалки
};

const ActionButton: React.FC<ActionProps> = ({
  buttonText,
  img = "",
  imgHover = "",
  LinkTo,
  onModalOpen,
}) => {
  if (LinkTo) {
    return (
      <Link href={LinkTo} className="action-link">
        <button
          className="action-button"
          style={{
            "--img-hover": `url(${imgHover})`,
            "--button-text": `"${buttonText}"`,
          }}
        >
          {img && <img src={img} alt="Action icon" />}
        </button>
      </Link>
    );
  }

  // Если передан onModalOpen, рендерим кнопку с обработчиком клика
  return (
    <button
      className="action-button"
      onClick={onModalOpen} // Вызываем функцию открытия модалки
      style={{
        "--img-hover": `url(${imgHover})`,
        "--button-text": `"${buttonText}"`,
      }}
    >
      {img && <img src={img} alt="Action icon" />}
    </button>
  );
};

export default ActionButton;