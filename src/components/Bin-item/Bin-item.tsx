import './Bin-item.scss';

type BinItemProps = {
  GoodName: string;
  GoodDesc: string;
  GoodImg: string;
  GoodPrice: string;
  Quantity: number;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

const BinItem = ({
  GoodName,
  GoodDesc,
  GoodImg,
  GoodPrice,
  Quantity,
  onRemove,
  onIncrease,
  onDecrease,
}: BinItemProps) => {
  return (
    <div className="Bin-item grid grid-cols-3 gap-4 p-4 border rounded-lg">
      <div className="Bin-item-image">
        <img src={GoodImg} alt={GoodName} />
      </div>
      <div className="InfoArea flex flex-col justify-between col-span-2">
        <div>
          <h3 className="text-lg ">{GoodName}</h3>
          <p className="text-sm ">{GoodDesc}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <button
              className="px-2 py-1  rounded-l"
              onClick={onDecrease}
              disabled={Quantity <= 1}
            >
              убавить
            </button>
            <span className="px-4">{Quantity}</span>
            <button className="px-2 py-1 rounded-r" onClick={onIncrease}>
              добавить
            </button>
          </div>
          <span className="text-lg font-bold">{GoodPrice} ₽</span>
          <button className="Remove-btn" onClick={onRemove}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinItem;