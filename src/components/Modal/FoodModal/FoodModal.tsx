import "./FoodModal.scss";

type FoodModalProps = {
  FoodName: string;
  FoodeDescription: string;
  FoodImage: string;
  FoodPrice: string;
  onClose: () => void; // Добавляем функцию для закрытия
};

const FoodModal = ({ FoodName, FoodeDescription, FoodImage, FoodPrice, onClose }: FoodModalProps) => {
  return (
    <div className="FoodModal-overlay" onClick={onClose}> {/* Overlay для закрытия при клике вне окна */}
      <div className="FoodModal-content" onClick={(e) => e.stopPropagation()}> {/* Предотвращаем закрытие при клике внутри */}
        <div className="Food-item">
          <button className="Close-btn" onClick={onClose}>✕</button> {/* Кнопка закрытия */}
          <div className="foodTitle">
            <h3>{FoodName}</h3>
          </div>
          <div className="foodContent grid grid-cols-2">
            <div className="foodImage">
              <img src={FoodImage} alt={FoodName} />
            </div>
            <div className="foodDescription">{FoodeDescription}</div>
          </div>
          <div className="foodFooter">
            <div className="foodPrice">{FoodPrice} ₽</div>
            <button className="Order-btn">Заказать</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;