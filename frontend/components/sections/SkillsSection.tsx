import type { Content } from "../../lib/content";
import { Skills } from "../Content";
export default function SkillsSection({ content }: { content: Content }) {
  return (
    <>
      <section className="skills section wrap" id="skills">
        <div className="section-label">
          <span>04 / ИНСТРУМЕНТЫ</span>
          <span className="tiny-cross">+</span>
        </div>
        <div className="skills-content">
          <div className="section-heading">
            <h2>
              Мой стек<span className="accent">.</span>
            </h2>
            <p>
              Технологии и инструменты,
              <br />с которыми я работаю.
            </p>
          </div>
          <p className="stack-hint">
            Нажмите на технологию — немного интерактива между строк кода.
          </p>
          <Skills skills={content.skills} />
          <a
            className="github-strip"
            href="https://github.com/hetagdarchiev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <span className="mono muted">КОД И РЕПОЗИТОРИИ</span>
              <strong>Больше на GitHub</strong>
            </span>
            <span className="github-handle">@hetagdarchiev</span>
            <span className="large-arrow">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
