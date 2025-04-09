'use client'; // Добавляем, так как будем использовать хуки
import { useState } from "react";
import "./Admin.scss";
import AdminTableItem from "@components/AdminTableItem/AdminTableItem";
import SideNavBar from "@components/SideNavBar/SideNavBar";

// Пример данных для разных категорий
const menuData = [
  { id: 1, name: "Бургер", price: 300 },
  { id: 2, name: "Пицца", price: 500 },
];
const eventsData = [
  { id: 1, eventName: "Концерт", date: "2025-05-01" },
  { id: 2, eventName: "Фестиваль", date: "2025-06-15" },
];
const employeeData = [
  { id: 1, firstName: "Иван", position: "Менеджер", worke: "уфыв" },
  { id: 2, firstName: "Анна", position: "Официант", worke: "вечер" },
];

const Admin = () => {
  const navItems = [
    { icon: "/icons/menu.png", name: "Меню", link: "" },
    { icon: "/icons/cart.png", name: "Мероприятия", link: "" },
    { icon: "/icons/about.png", name: "Сотрудники", link: "" },
  ];

  // Состояние для текущих данных таблицы
  const [tableData, setTableData] = useState(menuData); // Изначально данные для "Меню"
  const [title, setTitle] = useState("Меню"); // Заголовок тоже обновляем

  // Функция обработки клика по навигации
  const handleNavClick = (name: string) => {
    switch (name) {
      case "Меню":
        setTableData(menuData);
        setTitle("Меню");
        break;
      case "Мероприятия":
        setTableData(eventsData);
        setTitle("Мероприятия");
        break;
      case "Сотрудники":
        setTableData(employeeData);
        setTitle("Сотрудники");
        break;
      default:
        setTableData(menuData);
        setTitle("Меню");
    }
  };

  // Получаем ключи из первого объекта для заголовков, если данные есть
  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="Admimka gap-5">
      <SideNavBar
        className="w-full"
        navElement={navItems}
        onNavClick={handleNavClick} // Передаем функцию в SideNavBar
      />
      <div className="Adminka-content p-10">
        <div className="Adminka-content__title">{title}</div>
        <div className="Adminka-content__table p-10">
          {/* Заголовки таблицы */}
          {headers.length > 0 && (
            <div className={`admin-table-header grid-cols-${headers.length + 1}`}>
              {headers.map((header, index) => (
                <div key={index} className="grid-item header-item ">
                  {header}
                </div>
              ))}
              <div className="grid-item header-item justify-self-center">Действия</div> {/* Колонка для кнопки */}
            </div>
          )}
          {/* Строки таблицы */}
          {tableData.map((item, index) => (
            <AdminTableItem key={index} bdItem={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;