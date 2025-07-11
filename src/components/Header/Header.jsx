import Logo from '../Logo/Logo.jsx';
import Link from '../Link/Link.jsx';
import ThemeBtn from '../ThemeBtn/ThemeBtn.jsx';
import BurgerBtn from '../BurgerBtn/BurgerBtn.jsx';
import style from './Header.module.scss';
import {useEffect, useState} from "react";

function Header() {
    const [burgerOpen, setBurgerOpen] = useState(false)
    const handleValueChange = (newValue) => {
        setBurgerOpen(newValue);
    };
    useEffect(() => {
        burgerOpen ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'scroll';
    }, [burgerOpen])
    return (
        <header className={style.header}>
            <Logo/>
            <div className={`header__nav__wrapper ${style.header__nav__wrapper} ${burgerOpen ? 'active-f' : ''}`}>
                <nav className={'header__nav'}>
                    <ul className={style.header__list}>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#about">About Me</Link>
                        </li>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#skills">Skills</Link>
                        </li>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#portfolio">Portfolio</Link>
                        </li>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#contacts">Contact</Link>
                        </li>
                    </ul>
                </nav>
                <ThemeBtn active={handleValueChange}/>
            </div>
            <BurgerBtn Click={setBurgerOpen} Change={burgerOpen}/>
        </header>
    )
}

export default Header;