// src/components/Admin.tsx
'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.scss";
import AdminTableItem from "@components/AdminTableItem/AdminTableItem";
import SideNavBar from "@components/SideNavBar/SideNavBar";
import { getMenuItems, getEvents, getUsers, MenuItemDTO, EventDTO, UserDTO, CategoryDTO, getCategories, createEvent, createMenuItem } from "src/services/AdminService";

const API_URL = "http://localhost:5252/api";

const navItems = [
  { icon: "/icons/menu.png", name: "Меню", link: "" },
  { icon: "/icons/cart.png", name: "Мероприятия", link: "" },
  { icon: "/icons/about.png", name: "Сотрудники", link: "" },
];

const Admin = () => {
  const [tableData, setTableData] = useState<(MenuItemDTO | EventDTO | UserDTO)[]>([]);
  const [title, setTitle] = useState("Меню");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, categoryId: 0, imageUrl: "" });
  const [newEvent, setNewEvent] = useState({ title: "", description: "", imageUrl: "" });
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  console.log("Admin rendering...");

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log("Loading categories...");
        const cats = await getCategories();
        console.log("Categories loaded:", cats);
        setCategories(cats);
        await fetchData("Меню");
      } catch (err: any) {
        console.error("Error in loadInitialData:", err);
        setError("Не удалось загрузить данные: " + (err.message || "Неизвестная ошибка"));
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchData = async (category: string) => {
    setLoading(true);
    try {
      console.log(`Fetching data for category: ${category}`);
      switch (category) {
        case "Меню":
          const menuItems = await getMenuItems();
          console.log("Menu items fetched:", menuItems);
          setTableData(menuItems);
          setTitle("Меню");
          break;
        case "Мероприятия":
          const events = await getEvents();
          console.log("Events fetched:", events);
          setTableData(events);
          setTitle("Мероприятия");
          break;
        case "Сотрудники":
          const users = await getUsers();
          console.log("Users fetched:", users);
          setTableData(users);
          setTitle("Сотрудники");
          break;
        default:
          setTableData([]);
          setTitle("Меню");
      }
      setLoading(false);
    } catch (err: any) {
      console.error(`Error fetching data for ${category}:`, err.message);
      setError(`Не удалось загрузить данные: ${err.message}`);
      setTableData([]);
      setLoading(false);
    }
  };

  const handleNavClick = (name: string) => {
    setShowAddForm(false);
    fetchData(name);
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.categoryId) {
      setError("Название и категория обязательны");
      return;
    }
    try {
      console.log("Creating new menu item:", newItem);
      await createMenuItem(newItem);
      setNewItem({ name: "", description: "", price: 0, categoryId: 0, imageUrl: "" });
      setShowAddForm(false);
      fetchData("Меню");
    } catch (err: any) {
      console.error("Error in handleAddItem:", err);
      setError("Ошибка добавления позиции: " + (err.message || "Неизвестная ошибка"));
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title) {
      setError("Название обязательно");
      return;
    }
    try {
      console.log("Creating new event:", newEvent);
      await createEvent(newEvent);
      setNewEvent({ title: "", description: "", imageUrl: "" });
      setShowAddForm(false);
      fetchData("Мероприятия");
    } catch (err: any) {
      console.error("Error in handleAddEvent:", err);
      setError("Ошибка добавления события: " + (err.message || "Неизвестная ошибка"));
    }
  };

  const headers = Array.isArray(tableData) && tableData.length > 0 
    ? Object.keys(tableData[0]).filter(h => h !== "id" && h !== "categoryId" && h !== "roleId") 
    : [];
  console.log("Headers for table:", headers);

  return (
    <div className="Admimka gap-5">
      <SideNavBar
        className="w-full"
        navElement={navItems}
        onNavClick={handleNavClick}
      />
      <div className="Adminka-content p-10">
        <div className="Adminka-content__title">{title}</div>
        {(title === "Меню" || title === "Мероприятия") && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="AddBtn">
            {showAddForm ? "Отмена" : `Добавить ${title === "Меню" ? "позицию" : "событие"}`}
          </button>
        )}
        {showAddForm && title === "Меню" && (
          <div className="AddForm">
            <input
              type="text"
              placeholder="Название"
              value={newItem.name ?? ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Описание"
              value={newItem.description ?? ""}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Цена"
              value={newItem.price ?? 0}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
            />
            <select
              value={newItem.categoryId ?? 0}
              onChange={(e) => setNewItem({ ...newItem, categoryId: parseInt(e.target.value) || 0 })}
            >
              <option value={0}>Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Ссылка на изображение"
              value={newItem.imageUrl ?? ""}
              onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
            />
            <button onClick={handleAddItem}>Сохранить</button>
          </div>
        )}
        {showAddForm && title === "Мероприятия" && (
          <div className="AddForm">
            <input
              type="text"
              placeholder="Название"
              value={newEvent.title ?? ""}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Описание"
              value={newEvent.description ?? ""}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ссылка на изображение"
              value={newEvent.imageUrl ?? ""}
              onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
            />
            <button onClick={handleAddEvent}>Сохранить</button>
          </div>
        )}
        <div className="Adminka-content__table p-10">
          {loading && <div>Загрузка...</div>}
          {error && <div>{error}</div>}
          {!loading && !error && Array.isArray(tableData) && headers.length > 0 && (
            <div className={`admin-table-header grid-cols-${headers.length + 1}`}>
              {headers.map((header, index) => (
                <div key={index} className="grid-item header-item">
                  {header === "name" ? "Название" :
                   header === "description" ? "Описание" :
                   header === "price" ? "Цена" :
                   header === "categoryName" ? "Категория" :
                   header === "title" ? "Название" :
                   header === "imageUrl" ? "Картинка" :
                   header === "fullName" ? "Имя" :
                   header === "roleName" ? "Роль" :
                   header === "email" ? "Email" :
                   header === "avatarUrl" ? "Аватар" : header}
                </div>
              ))}
              <div className="grid-item header-item justify-self-center">Действия</div>
            </div>
          )}
          {!loading && !error && Array.isArray(tableData) && tableData.length > 0 ? (
            tableData.map((item) => (
              <AdminTableItem
                key={(item as any).id}
                bdItem={item}
                onUpdate={fetchData}
                category={title}
                categories={categories}
              />
            ))
          ) : (
            !loading && !error && <div>Нет данных для отображения</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;