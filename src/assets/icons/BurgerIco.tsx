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
<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.47623 1L21.4762 21" stroke="#777777" stroke-width="2" stroke-linecap="round"/>
<path d="M1 21L21 1" stroke="#777777" stroke-width="2" stroke-linecap="round"/>
</svg>






        )

    }
}

export default BurgerIco;