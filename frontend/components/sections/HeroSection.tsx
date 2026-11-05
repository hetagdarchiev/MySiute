import PortraitSlider from "../PortraitSlider";
import type { Content } from "../../lib/content";
export default function HeroSection({ content }: { content: Content }) {
  return (
    <>
      <section className="editorial-hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow reveal">FULLSTACK DEVELOPER / FRONTEND FOCUS</p>
          <h1 id="hero-title">
            <span className="title-line">Хетаг</span>
            <span className="title-line serif">Дарчиев.</span>
          </h1>
          <p className="hero-statement reveal">
            Интерфейсы, которыми
            <br />
            удобно пользоваться.
          </p>
          <p data-content="summary" className="hero-summary reveal">
            {content.summary}
          </p>
          <a
            className="button reveal"
            href="https://t.me/Mohatma"
            target="_blank"
            rel="noopener noreferrer"
          >
            Обсудить работу <span>↗</span>
          </a>
          <div className="quick-facts">
            <span>React / Next.js</span>
            <span>{content.projects.length} проекта</span>
            <span>Изучаю backend</span>
          </div>
          <a className="hero-scroll" href="#about">
            ПРОКРУТИТЕ, ЧТОБЫ УЗНАТЬ БОЛЬШЕ <span>↓</span>
          </a>
        </div>
        <PortraitSlider />
        <span className="hero-side" aria-hidden="true">
          DEVELOPMENT — DESIGN — PERSONALITY
        </span>
      </section>
      <div className="ticker" aria-hidden="true">
        <div>
          FRONTEND &nbsp;✳&nbsp; DESIGN &nbsp;✳&nbsp; DEVELOPMENT &nbsp;✳&nbsp;
          FRONTEND &nbsp;✳&nbsp; DESIGN &nbsp;✳&nbsp; DEVELOPMENT &nbsp;✳&nbsp;
        </div>
      </div>
    </>
  );
}
