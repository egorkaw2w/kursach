import "./FoodModal.scss"

type FoodModalProps = {
    FoodName : string,
    FoodeDescription : string,
    FoodImage : string,
    FoodPrice: string
}

const FoodModal = ({FoodName,FoodeDescription,FoodImage,FoodPrice}:FoodModalProps) => {
    return(
        <div className="Food-item">
            <div className="foodTitle">
                <h3>{FoodName}</h3>
                <div className="">
                    <div className="">
                        <img src={FoodImage} alt={FoodName} />
                    </div>
                    <div className="">
                        {FoodeDescription}
                    </div>
                </div>
                <div className="">
                    <div className="">{FoodPrice}</div>
                    <button className="Order-btn">Заказать</button>
                </div>
            </div>
        </div>
    )
}

export default FoodModal;