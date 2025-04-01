import {ReactElement} from "react";

interface Props {
    className?: string;
    typeOfBurger: boolean
}

const BurgerIco = ({className, typeOfBurger}:Props)  => {
    if (typeOfBurger) {
    return (
<svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 9.75H25" stroke="#777777" strokeWidth="2" strokeLinecap="round"/>
<path d="M1 18.75H25" stroke="#777777" strokeWidth="2" strokeLinecap="round"/>
<path d="M1 1.25H25" stroke="#777777" strokeWidth="2" strokeLinecap="round"/>
</svg>
    )
    }
    else{
        return(
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="28.8001" width="40.7293" height="1.69705" rx="0.848527" transform="rotate(-45 0 28.8001)" fill="#777777"/>
<rect x="1.20004" width="40.7293" height="1.69705" rx="0.848527" transform="rotate(45 1.20004 0)" fill="#777777"/>
</svg>




        )

    }
}

export default BurgerIco;