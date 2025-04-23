'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./Admin.scss";
import AdminTableItem from "@components/AdminTableItem/AdminTableItem";
import SideNavBar from "@components/SideNavBar/SideNavBar";
import { getMenuItems, getEvents, getUsers, MenuItemDTO, EventDTO, UserDTO, CategoryDTO, getCategories, createEvent, createMenuItem } from "src/services/AdminService";

const API_URL = "http://strhzy.ru:8080/api";

const navItems = [
  { icon: "/icons/menu.png", name: "Меню", link: "" },
  { icon: "/icons/cart.png", name: "Мероприятия", link: "" },
  { icon: "/icons/about.png", name: "Сотрудники", link: "" },
  { icon: "/icons/export.png", name: "Экспортировать в Excel", link: "" },
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

  const exportOrdersToExcel = async () => {
    try {
      console.log("Fetching orders for export...");
      const response = await axios.get(`${API_URL}/orders`);
      const orders = response.data;

      if (!orders || orders.length === 0) {
        setError("Нет заказов для экспорта");
        return;
      }

      // Подготовка данных для Excel
      const data = orders.map((order: any) => ({
        ID: order.id,
        Пользователь: order.user.fullName,
        Email: order.user.email,
        Адрес: order.address.addressText,
        Статус: order.status,
        Стоимость: `${order.totalPrice} ₽`,
        Дата: new Date(order.createdAt).toLocaleDateString("ru-RU"),
        Товары: order.orderItems
          .map((item: any) => `${item.menuItemName} (x${item.quantity}) - ${item.priceAtOrder} ₽`)
          .join("\n"),
      }));

      // Создаём рабочий лист
      const ws = XLSX.utils.json_to_sheet(data, {
        header: ["ID", "Пользователь", "Email", "Адрес", "Статус", "Стоимость", "Дата", "Товары"],
      });

      // Настраиваем ширину столбцов
      ws["!cols"] = [
        { wch: 10 }, // ID
        { wch: 20 }, // Пользователь
        { wch: 30 }, // Email
        { wch: 30 }, // Адрес
        { wch: 15 }, // Статус
        { wch: 15 }, // Стоимость
        { wch: 15 }, // Дата
        { wch: 40 }, // Товары
      ];

      // Создаём рабочую книгу
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Заказы");

      // Генерируем и скачиваем файл
      XLSX.writeFile(wb, "orders_history.xlsx");

      console.log("Orders exported to Excel successfully");
    } catch (err: any) {
      console.error("Error exporting orders to Excel:", err);
      setError("Не удалось экспортировать заказы: " + (err.message || "Неизвестная ошибка"));
    }
  };

  const handleNavClick = (name: string) => {
    if (name === "Экспортировать в Excel") {
      exportOrdersToExcel();
    } else {
      setShowAddForm(false);
      fetchData(name);
    }
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
    <div className="Adminka flex h-screen">
      <SideNavBar
        className="w-64 bg-gray-800 text-white"
        navElement={navItems}
        onNavClick={handleNavClick}
      />
      <div className="Adminka-content flex-1 p-6 bg-gray-100">
        <div className="Adminka-content__title text-2xl font-bold text-gray-800 bg-white p-4 rounded-lg shadow mb-6 text-center">
          {title}
        </div>
        {(title === "Меню" || title === "Мероприятия") && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="AddBtn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
          >
            {showAddForm ? "Отмена" : `Добавить ${title === "Меню" ? "позицию" : "событие"}`}
          </button>
        )}
        {showAddForm && title === "Меню" && (
          <div className="AddForm bg-white p-6 rounded-lg shadow mb-6">
            <input
              type="text"
              placeholder="Название"
              value={newItem.name ?? ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Описание"
              value={newItem.description ?? ""}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Цена"
              value={newItem.price ?? 0}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <select
              value={newItem.categoryId ?? 0}
              onChange={(e) => setNewItem({ ...newItem, categoryId: parseInt(e.target.value) || 0 })}
              className="w-full p-2 mb-4 border rounded-lg"
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
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <button 
              onClick={handleAddItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Сохранить
            </button>
          </div>
        )}
        {showAddForm && title === "Мероприятия" && (
          <div className="AddForm bg-white p-6 rounded-lg shadow mb-6">
            <input
              type="text"
              placeholder="Название"
              value={newEvent.title ?? ""}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Описание"
              value={newEvent.description ?? ""}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Ссылка на изображение"
              value={newEvent.imageUrl ?? ""}
              onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <button 
              onClick={handleAddEvent}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Сохранить
            </button>
          </div>
        )}
        <div className="Adminka-content__table bg-white rounded-lg shadow p-6">
          {loading && <div className="text-gray-600">Загрузка...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && Array.isArray(tableData) && headers.length > 0 && (
            <div className="admin-table-header">
              {headers.map((header, index) => (
                <div key={index} className="header-item">
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
              <div className="header-item justify-self-center">Действия</div>
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
            !loading && !error && <div className="text-gray-600">Нет данных для отображения</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;