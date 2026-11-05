import type { Content } from "../../lib/content";
import { Projects } from "../Content";
export default function ProjectsSection({ content }: { content: Content }) {
  return (
    <>
      <section className="projects-section wrap" id="projects">
        <div className="section-label">
          <span>02 / ПРАКТИКА</span>
          <span>КОД ОТКРЫТ НА GITHUB</span>
        </div>
        <div className="section-heading">
          <div>
            <p className="kicker">ОТ ИДЕИ ДО РЕАЛИЗАЦИИ</p>
            <h2>Избранные проекты</h2>
          </div>
          <p>
            Веб-инструменты, приложения
            <br />и эксперименты с кодом.
          </p>
        </div>
        <Projects projects={content.projects} />
        <p className="project-note">
          Подробнее об устройстве проектов — в исходниках и README каждого
          репозитория.
        </p>
      </section>
    </>
  );
}
