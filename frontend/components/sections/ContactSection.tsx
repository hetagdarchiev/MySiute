export default function ContactSection() {
  return (
    <>
      <section className="contact" id="contact">
        <div className="wrap">
          <div className="section-label">
            <span>06 / КОНТАКТЫ</span>
            <span>ОБСУДИМ ВАШУ КОМАНДУ?</span>
          </div>
          <div className="contact-title">
            <h2>
              Давайте
              <br />
              <span className="serif">работать вместе.</span>
            </h2>
            <a
              href="https://t.me/Mohatma"
              className="circle-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать Хетагу в Telegram"
            >
              ↗
            </a>
          </div>
          <p className="contact-copy">
            Напишите о вакансии или задаче. Буду рад обсудить, где мои навыки
            могут пригодиться вашей команде.
          </p>
          <div className="contact-links">
            <a
              href="https://t.me/Mohatma"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>TELEGRAM</span>
              <strong>@Mohatma ↗</strong>
            </a>
            <a href="mailto:het.dar2003@yandex.ru">
              <span>ЭЛЕКТРОННАЯ ПОЧТА</span>
              <strong>het.dar2003@yandex.ru ↗</strong>
            </a>
            <a
              href="https://github.com/hetagdarchiev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>GITHUB</span>
              <strong>hetagdarchiev ↗</strong>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
