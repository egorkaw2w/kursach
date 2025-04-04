import "./CategoryPageItem.scss";

type CategoryPageItemProps = {
  index: string;
  img: string;
  foodName: string;
  foodCost: string;
  foodDesc: string;
  onClick: () => void; // Добавляем обработчик клика
};

const CategoryPageItem = ({ img, foodName, foodCost, foodDesc, onClick }: CategoryPageItemProps) => {
  return (
    <div className="CategoryPageItem" onClick={onClick}>
      <div className="itemImage">
        <img src={img} alt={foodName} />
      </div>
      <div className="itemInfo">
        <h3 className="itemName">{foodName}</h3>
        <p className="itemDesc">{foodDesc}</p>
        <p className="itemCost">{foodCost} ₽</p>
      </div>
    </div>
  );
};

export default CategoryPageItem;