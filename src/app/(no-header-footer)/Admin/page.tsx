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
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, categoryId: 0, image: null as File | null });
  const [newEvent, setNewEvent] = useState({ title: "", description: "", imageUrl: "" });
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
        await fetchData("Меню");
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchData = async (category: string) => {
    setLoading(true);
    try {
      switch (category) {
        case "Меню":
          const menuItems = await getMenuItems();
          setTableData(menuItems);
          setTitle("Меню");
          break;
        case "Мероприятия":
          const events = await getEvents();
          setTableData(events);
          setTitle("Мероприятия");
          break;
        case "Сотрудники":
          const users = await getUsers();
          setTableData(users);
          setTitle("Сотрудники");
          break;
        default:
          setTableData([]);
          setTitle("Меню");
      }
      setLoading(false);
    } catch (err) {
      setError("Не удалось загрузить данные");
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
      await createMenuItem(newItem, newItem.image || undefined);
      setNewItem({ name: "", description: "", price: 0, categoryId: 0, image: null });
      setShowAddForm(false);
      fetchData("Меню");
    } catch (err) {
      setError("Ошибка добавления позиции");
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title) {
      setError("Название обязательно");
      return;
    }
    try {
      await createEvent(newEvent);
      setNewEvent({ title: "", description: "", imageUrl: "" });
      setShowAddForm(false);
      fetchData("Мероприятия");
    } catch (err) {
      setError("Ошибка добавления события");
    }
  };

  const headers = tableData.length > 0 ? Object.keys(tableData[0]).filter(h => h !== "id" && h !== "categoryId" && h !== "roleId") : [];

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
              type="file"
              accept="image/*"
              onChange={(e) => setNewItem({ ...newItem, image: e.target.files?.[0] || null })}
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
              placeholder="Ссылка на картинку"
              value={newEvent.imageUrl ?? ""}
              onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
            />
            <button onClick={handleAddEvent}>Сохранить</button>
          </div>
        )}
        <div className="Adminka-content__table p-10">
          {loading && <div>Загрузка...</div>}
          {error && <div>{error}</div>}
          {!loading && !error && headers.length > 0 && (
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
                   header === "roleName" ? "Роль" : header}
                </div>
              ))}
              <div className="grid-item header-item justify-self-center">Действия</div>
            </div>
          )}
          {!loading && !error && tableData.map((item) => (
            <AdminTableItem
              key={(item as any).id}
              bdItem={item}
              onUpdate={fetchData}
              category={title}
              categories={categories}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;