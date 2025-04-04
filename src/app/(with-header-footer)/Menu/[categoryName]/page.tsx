"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import CategoryPageItem from "@components/Menu/CategoryPageItem/CategoryPageItem";
import FoodModal from "@components/Modal/FoodModal/FoodModal";

// Тестовые данные
const menuTestData = {
  category: [
    {
      name: "закуски",
      items: [
        { id: 1, name: "закузка_1", description: "loremIpsum", cost: 9999.99, img: "/usable_img/MenuImga1.png" },
        { id: 2, name: "закузка_2", description: "loremIpsum", cost: 123.00, img: "usable_img/zakuska2.png" },
      ],
    },
    {
      name: "винная карта",
      items: [
        { id: 1, name: "Вино DonPerenion", description: "loremIpsum", cost: 9999.99, img: "usable_img/wine1.png" },
        { id: 2, name: "RussianVODKa", description: "loremIpsum", cost: 123.00, img: "usable_img/vodka1.png" },
      ],
    },
    {
      name: "десерты",
      items: [{ id: 1, name: "Торт", description: "Вкусный торт", cost: 500.00, img: "usable_img/cake1.png" }],
    },
    {
      name: "горячие блюда",
      items: [{ id: 1, name: "Стейк", description: "Сочный стейк", cost: 1200.00, img: "usable_img/steak1.png" }],
    },
    {
      name: "завтраки",
      items: [{ id: 1, name: "Омлет", description: "С яйцами", cost: 300.00, img: "usable_img/omlet1.png" }],
    },
    {
      name: "барная карта",
      items: [{ id: 1, name: "Коктейль", description: "Освежающий", cost: 450.00, img: "usable_img/cocktail1.png" }],
    },
  ],
};

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.categoryName as string;

  const decodedCategoryName = decodeURIComponent(categoryName);
  const category = menuTestData.category.find(
    (cat) => cat.name.toLowerCase() === decodedCategoryName.toLowerCase()
  );

  // Состояние для модального окна
  const [selectedFood, setSelectedFood] = useState<any>(null);

  const openModal = (item: any) => {
    setSelectedFood(item);
  };

  const closeModal = () => {
    setSelectedFood(null);
  };

  if (!category) {
    return (
      <div className="Category mt-14">
        <div className="CategoryList">Категория не найдена</div>
      </div>
    );
  }

  return (
    <div className="Category">
      <div className="CategoryList mt-10 container mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.items.map((item) => (
            <CategoryPageItem
              key={item.id}
              index={item.id.toString()}
              img={item.img}
              foodName={item.name}
              foodCost={item.cost.toFixed(2)}
              foodDesc={item.description}
              onClick={() => openModal(item)} // Открываем модальное окно
            />
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {selectedFood && (
        <FoodModal
          FoodName={selectedFood.name}
          FoodeDescription={selectedFood.description}
          FoodImage={selectedFood.img}
          FoodPrice={selectedFood.cost.toFixed(2)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}