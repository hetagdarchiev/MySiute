export default function GrowthSection() {
  return (
    <>
      <section className="growth-section wrap" id="development">
        <div className="section-label">
          <span>05 / РАЗВИТИЕ</span>
          <span>ДВИГАЮСЬ ДАЛЬШЕ</span>
        </div>
        <div className="growth-layout">
          <h2>
            Fullstack-разработка.
            <br />
            <span className="serif">Frontend — сильная сторона.</span>
          </h2>
          <div className="growth-steps">
            <article>
              <span>01</span>
              <div>
                <h3>Углубляю frontend</h3>
                <p>
                  React, Next.js, управление состоянием и работа с интерфейсами
                  остаются моим основным направлением.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Изучаю серверную часть</h3>
                <p>
                  Расширяю знания в backend. В моём наборе языков — C#, PHP, Go
                  и SQL.
                </p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Соединяю инструменты</h3>
                <p>
                  Использую ChatGPT, Gemini, Claude и Cursor, а также
                  инструменты дизайна и медиа в повседневных задачах.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
