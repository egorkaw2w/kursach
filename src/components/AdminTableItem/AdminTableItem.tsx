'use client';
import { useEffect, useState } from "react";
import "./AdminTableItem.scss";

type AdminTableItemProps<T> = {
  bdItem: T;
};

const AdminTableItem = <T,>({ bdItem }: AdminTableItemProps<T>) => {
  // Получаем количество ключей в объекте bdItem для grid-cols + 1 для кнопки
  const columnCount = Object.keys(bdItem as object).length + 1;

  // Получаем все значения из bdItem
  const values = Object.values(bdItem as object);

  // Состояние для readOnly, изначально true
  const [readOnlyItem, setReadOnlyItem] = useState(true);

  // Функция для переключения состояния
  const setUpToUpdate = () => {
    setReadOnlyItem(prev => !prev); // Используем предыдущее состояние для надежности
  };

  // Устанавливаем readOnlyItem в true только при монтировании компонента
  useEffect(() => {
    setReadOnlyItem(true);
  }, []); // Пустой массив зависимостей — выполняется только один раз при монтировании

  return (
    <div className={`admin-table-item py-1 gap-1 grid-cols-${columnCount}`}>
      {values.map((value, index) => (
        <input
          key={index}
          className={`grid-item ${readOnlyItem ? "":"Editable" }`}
          placeholder={JSON.stringify(value)}
          readOnly={readOnlyItem}
        />
      ))}
<div className="ActionsBtnArea gap-2 grid-cols-2 ">
        <button className={`ChangeBtn `} onClick={setUpToUpdate}>Изменить</button>
        <button className={`DeleteBtn`} >Удалить</button>
  
</div>    </div>
  );
};

export default AdminTableItem;