import Logo from '../Logo/Logo.jsx';
import Link from '../Link/Link.jsx';
import ThemeBtn from '../ThemeBtn/ThemeBtn.jsx';
import BurgerBtn from '../BurgerBtn/BurgerBtn.jsx';
import style from './Header.module.scss';
import {useState} from "react";

function Header() {
    const [burgerOpen, setBurgerOpen] = useState(false)
    const handleValueChange = (newValue) => {
        setBurgerOpen(newValue);
    };
    return (
        <header className={style.header}>
            <Logo/>
            <div className={`header__nav__wrapper ${style.header__nav__wrapper} ${burgerOpen ? 'active-f' : ''}`}>
                <nav className={'header__nav'}>
                    <ul className={style.header__list}>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#skill">Skill</Link>
                        </li>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#about">About Me</Link>
                        </li>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#portfolio">Portfolio</Link>
                        </li>
                        <li className={"header__list-item"} onClick={() => setBurgerOpen(false)}>
                            <Link href="#contact">Contact</Link>
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