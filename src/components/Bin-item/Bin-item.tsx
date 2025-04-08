import "./Bin-item.scss";

type BinItemProps = {
  GoodName: string;
  GoodDesc: string;
  GoodImg: string;
  GoodPrice: string;
  onRemove: () => void; // Добавляем функцию удаления
};

const BinItem = ({ GoodName, GoodDesc, GoodImg, GoodPrice, onRemove }: BinItemProps) => {
  return (
    <div className="Bin-item grid grid-cols-3 gap-4 p-4 border rounded-lg">
      <div className="Bin-item-image">
        <img src={GoodImg} alt={GoodName} />
      </div>
      <div className="InfoArea flex flex-col justify-between col-span-2">
        <div>
          <h3 className="text-lg font-semibold">{GoodName}</h3>
          <p className="text-sm text-gray-600">{GoodDesc}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold">{GoodPrice} ₽</span>
          <button
            className="Remove-btn text-red-500 hover:text-red-700"
            onClick={onRemove}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinItem;