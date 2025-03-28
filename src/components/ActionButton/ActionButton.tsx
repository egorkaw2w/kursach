import "./ActionButton.scss";

type ActionProps = {
    buttonText: string;
    img?: string;
    imgHover?: string;
    LinkTo?: string;
};

const ActionButton: React.FC<ActionProps> = ({ buttonText, img = "", imgHover = "", LinkTo = "" }) => {
    return (
        <a href={LinkTo} className="action-link">
            <button
                className="action-button"
                style={{
                    "--img-hover": `url(${imgHover})`,
                    "--button-text": `"${buttonText}"`,
                }}
            >
                {img && <img src={img} alt="Action icon" />}
            </button>
        </a>
    );
};

export default ActionButton;