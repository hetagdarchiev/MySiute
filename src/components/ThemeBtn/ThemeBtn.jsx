import {useEffect, useState} from 'react';
import style from './ThemeBtn.module.scss';

export default function ThemeBtn() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    function toggleTheme() {
        const newThemeState = !isDark;
        setIsDark(newThemeState);
        localStorage.setItem('theme', newThemeState ? 'dark' : 'light');
        document.body.classList.toggle('dark', newThemeState);
    }

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);
    return (
        <button
            className={style.theme__btn}
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
            <div className={`${style.theme__btn__moon} ${isDark ? style.theme__btn__circle : ''}`}></div>
        </button>
    );
}