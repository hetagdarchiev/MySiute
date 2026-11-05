import type { Content } from "../../lib/content";
import { ageOn, formatAge } from "../../lib/age";
export default function AboutSection({ content }: { content: Content }) {
  return (
    <>
      <div className="light-zone">
        <section className="about section wrap" id="about">
          <div className="section-label">
            <span>01 / ОБО МНЕ</span>
            <span className="tiny-cross">+</span>
          </div>
          <div className="about-content">
            <figure className="about-photo photo-reveal">
              <img
                src="/portrait-business.png"
                alt="Хетаг в графитовом костюме — AI-портрет"
                width="1024"
                height="1536"
                loading="lazy"
              />
              <figcaption>Код — моя работа. Детали — мой интерес.</figcaption>
            </figure>
            <h2>
              Разработчик.
              <br />
              <span className="serif">С вниманием к дизайну.</span>
            </h2>
            <div className="about-columns" id="bio-content">
              {content.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="facts">
              <div>
                <span className="muted mono">ВОЗРАСТ</span>
                <p>{formatAge(ageOn(new Date()))}</p>
              </div>
              <div>
                <span className="muted mono">ОСНОВНОЕ НАПРАВЛЕНИЕ</span>
                <p>Fullstack · фокус на frontend</p>
              </div>
              <div>
                <span className="muted mono">СЕЙЧАС ИЗУЧАЮ</span>
                <p>
                  <span className="dot"></span> Backend
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
