import Link from "next/link";
import "./SideNavBar.scss";

type SideBarObject = {
  icon: string;
  name: string;
  link?: string; // Опциональная ссылка для навигации
};

type SideNavBarProps = {
  className?: string;
  navElement: SideBarObject[];
  onNavClick?: (name: string) => void; // Добавляем пропс для обработки клика
};

const SideNavBar = ({ navElement, className, onNavClick }: SideNavBarProps) => {
  // Обработчик клика по элементу навигации
  const handleClick = (name: string) => {
    if (onNavClick) {
      onNavClick(name); // Вызываем переданную функцию с именем пункта
    }
  };

  return (
    <div className={`SideNavBar flex flex-col p-5 justify-between ${className}`}>
      <ul className="SideNavBar-list">
        {navElement.map((element, index) => (
          <li key={index} className="SideNavBar-item">
            <a
              href={element.link || "#"} // Если нет ссылки, ставим заглушку
              className="SideNavBar-link"
              onClick={(e) => {
                e.preventDefault(); // Предотвращаем переход по ссылке
                handleClick(element.name); // Вызываем обработчик
              }}
            >
              <img
                src={element.icon}
                alt={element.name}
                className="SideNavBar-icon"
              />
              <span className="SideNavBar-name">{element.name}</span>
            </a>
          </li>
        ))}
      </ul>
<Link href={"/Auth/Login"} className="">
      <div className="exit text-center">
          <button className="">выйти</button>
      </div>
</Link >
    </div>
  );
};

export default SideNavBar;