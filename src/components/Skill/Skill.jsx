import {useRef, useState} from "react";
import style from "./Skill.module.scss";

export default function Skill({img, children, title, data}) {
    const [changeColor, setChangeColor] = useState(false)
    const showMenu = useRef(null);

    function openMenu() {
        showMenu.current.classList.toggle('active-b');
        !changeColor ? setChangeColor(true) : setChangeColor(false)
    }

    return (
        <div className={style.skill} data-aos={data}
             style={!changeColor ? {maxHeight: '60px'} : undefined}
        >
            <button
                className={`${style.skill__btn} ${changeColor && style.skill__btn__active}`}
                title={title}
                onClick={() => openMenu()}>
                <div className={`${style.skill__img} ${changeColor && style.skill__img__colorize}`}>
                    <img src={img} alt="" width={30}/>
                </div>
                <span className={`${style.skill__arrow__down} ${changeColor && style.skill__arrow__up}`}>
                    &#9660;
                </span>
            </button>
            <ul ref={showMenu} className={`${style.skill__list} ${changeColor && style.skill__list__active}`}>
                {children}
            </ul>
        </div>
    )
}