import "./CategoryPageItem.scss";

type CategoryPageProps = {
  index: string;
  img: string;
  foodName: string;
  foodCost: string;
  foodDesc: string;
};

const CategoryPageItem = ({ index, img, foodName, foodCost, foodDesc }: CategoryPageProps) => {
  return (
    <div className={`card-${index} flex`}>
      <img src={img} alt={foodName} className="food-image" />
      <div className="food-details">
        <p className="foodName">{foodName}</p>
        <p className="foodCost">{foodCost} ₽</p>
      </div>
    </div>
  );
};

export default CategoryPageItem;