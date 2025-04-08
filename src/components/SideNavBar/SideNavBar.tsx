import "./SideNavBar.scss";

type SideBarObject = {
  icon: string;
  name: string;
  link?: string; // Добавляем опциональную ссылку для навигации
};

type SideNavBarProps = {
  navElement: SideBarObject[];
};

const SideNavBar = ({ navElement }: SideNavBarProps) => {
  return (
    <div className="SideNavBar">
      <ul className="SideNavBar-list">
        {navElement.map((element, index) => (
          <li key={index} className="SideNavBar-item">
            <a
              href={element.link || "#"} // Если нет ссылки, ставим заглушку
              className="SideNavBar-link"
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
    </div>
  );
};

export default SideNavBar;