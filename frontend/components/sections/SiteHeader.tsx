import ThemeToggle from "../ThemeToggle";
import BrandMark from "../BrandMark";
export default function SiteHeader() {
  return (
    <>
      <header className="header wrap">
        <a href="#" className="logo" aria-label="Хетаг Дарчиев, в начало">
          <BrandMark />
        </a>
        <nav aria-label="Основная навигация">
          <a href="#about">Обо мне</a>
          <a href="#projects">Проекты</a>
          <a href="#skills">Навыки</a>
          <a href="#contact">
            Контакты <span>↗</span>
          </a>
        </nav>
        <ThemeToggle />
      </header>
    </>
  );
}
