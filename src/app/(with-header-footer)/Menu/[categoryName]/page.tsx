"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CategoryPageItem from "@components/Menu/CategoryPageItem/CategoryPageItem";
import FoodModal from "@components/Modal/FoodModal/FoodModal";

type MenuItem = {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryName: string;
};

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.categoryName as string;
  const decodedCategoryName = decodeURIComponent(categoryName).toLowerCase();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string>("");
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Шаг 1: Получаем категории, чтобы найти ID по slug
        const categoriesRes = await fetch("http://localhost:5252/api/MenuCategories");
        if (!categoriesRes.ok) throw new Error("Ошибка загрузки категорий");
        const categories = await categoriesRes.json();

        const category = categories.find(
          (cat: { slug: string; name: string }) => cat.slug.toLowerCase() === decodedCategoryName
        );

        if (!category) {
          setError("Категория не найдена");
          setLoading(false);
          return;
        }

        // Сохраняем отображаемое имя категории
        setCategoryDisplayName(category.name);

        // Шаг 2: Получаем блюда и фильтруем по categoryId
        const itemsRes = await fetch("http://localhost:5252/api/MenuItems");
        if (!itemsRes.ok) throw new Error("Ошибка загрузки блюд");
        const items = await itemsRes.json();

        const filteredItems = items.filter(
          (item: MenuItem) => item.categoryId === category.id
        );

        setMenuItems(filteredItems);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка:", err);
        setError("Не удалось загрузить данные. Попробуйте позже.");
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryData();
    }
  }, [categoryName]);

  const openModal = (item: MenuItem) => {
    setSelectedFood(item);
  };

  const closeModal = () => {
    setSelectedFood(null);
  };

  if (loading) {
    return (
      <div className="Category mt-14">
        <div className="CategoryList text-center py-10">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Category mt-14">
        <div className="CategoryList text-center py-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="Category">
      <div className="CategoryList mt-10 container mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {categoryDisplayName.charAt(0).toUpperCase() + categoryDisplayName.slice(1)}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <CategoryPageItem
                key={item.id}
                index={item.id.toString()}
                img={item.imageUrl ? `http://localhost:5252${item.imageUrl}` : "/usable_img/default-food.png"}
                foodName={item.name}
                foodCost={item.price.toFixed(2)}
                foodDesc={item.description || "Описание отсутствует"}
                onClick={() => openModal(item)}
              />
            ))
          ) : (
            <p className="text-center">В этой категории пока нет блюд. Повар спит?</p>
          )}
        </div>
      </div>

      {selectedFood && (
        <FoodModal
          FoodName={selectedFood.name}
          FoodeDescription={selectedFood.description || "Без описания"}
          FoodImage={selectedFood.imageUrl ? `http://localhost:5252${selectedFood.imageUrl}` : "/usable_img/default-food.png"}
          FoodPrice={selectedFood.price.toFixed(2)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}