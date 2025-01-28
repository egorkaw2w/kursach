import {ReactElement} from "react";

interface Props {
    className: string;
}

const BurgerIco = () : ReactElement => {
    return (
<svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 9.75H25" stroke="#777777" strokeWidth="2" strokeLinecap="round"/>
<path d="M1 18.75H25" stroke="#777777" strokeWidth="2" strokeLinecap="round"/>
<path d="M1 1.25H25" stroke="#777777" strokeWidth="2" strokeLinecap="round"/>
</svg>


    )
}

export default BurgerIco;