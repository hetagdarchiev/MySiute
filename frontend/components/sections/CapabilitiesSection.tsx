export default function CapabilitiesSection() {
  return (
    <>
      <section className="capabilities-zone">
        <div className="wrap capabilities">
          <div className="section-label">
            <span>03 / КОМПЕТЕНЦИИ</span>
            <span>ЧЕМ МОГУ БЫТЬ ПОЛЕЗЕН</span>
          </div>
          <h2>
            От макета
            <br />
            до работающего интерфейса.
          </h2>
          <div className="capability-grid">
            <article className="capability">
              <span className="cap-icon">&lt;/&gt;</span>
              <h3>Frontend-разработка</h3>
              <p>
                React и Next.js для интерфейсов. CSS, SCSS и Tailwind CSS для
                оформления и адаптации под разные экраны.
              </p>
              <span className="cap-bottom">
                КОМПОНЕНТЫ / СТИЛИ / АДАПТИВНОСТЬ
              </span>
            </article>
            <article className="capability">
              <span className="cap-icon">&#123; &#125;</span>
              <h3>Логика интерфейса</h3>
              <p>
                Состояние приложения, маршрутизация и проверка данных. Знаком с
                Zustand и Zod, использую Git и GitHub.
              </p>
              <span className="cap-bottom">STATE / ROUTING / VALIDATION</span>
            </article>
            <article className="capability">
              <span className="cap-icon">↗</span>
              <h3>Визуальная сторона</h3>
              <p>
                Разбираюсь в Figma и Pixso, инструментах Adobe, Blender и Cinema
                4D. Дизайн помогает мне видеть интерфейс целиком.
              </p>
              <span className="cap-bottom">ДИЗАЙН / МЕДИА / 3D</span>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
