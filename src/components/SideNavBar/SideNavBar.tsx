// src/components/SideNavBar/SideNavBar.tsx
import Link from "next/link";
import "./SideNavBar.scss";

type SideBarObject = {
  icon: string;
  name: string;
  link?: string;
};

type SideNavBarProps = {
  className?: string;
  navElement: SideBarObject[];
  onNavClick?: (name: string) => void;
};

const SideNavBar = ({ navElement, className, onNavClick }: SideNavBarProps) => {
  const handleClick = (name: string) => {
    if (onNavClick) {
      onNavClick(name);
    }
  };

  return (
    <div className={`SideNavBar flex flex-col p-5 justify-between ${className}`}>
      <ul className="SideNavBar-list">
        {navElement.map((element, index) => (
          <li key={index} className="SideNavBar-item">
            <a
              href={element.link || "#"}
              className="SideNavBar-link"
              onClick={(e) => {
                e.preventDefault();
                handleClick(element.name);
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
      </Link>
    </div>
  );
};

export default SideNavBar;