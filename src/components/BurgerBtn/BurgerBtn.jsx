import style from "./BurgerBtn.module.scss";
import {useEffect, useState} from "react";

export default function Btn({Click, Change}) {
    const [burgerBtn, setBurgerBtn] = useState(Click)

    const handleSubmit = (e) => {
        e.preventDefault();
        const newValue = !burgerBtn;
        setBurgerBtn(newValue);
        Click(newValue);
    };
    useEffect(() => {
        burgerBtn ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'scroll';
    }, [burgerBtn])
    return (
        <>
            <button className={`${style.burger__btn} 
            ${burgerBtn && Change && style.burger__btn && style.burger__btn__active}`} onClick={handleSubmit}>
                <div></div>
                <div></div>
                <div></div>
            </button>
        </>
    )
}