import type { Project, Skill } from "../lib/content";
import ShatterTag from "./ShatterTag";
function safeURL(url: string) {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) ? u.href : undefined;
  } catch {
    return undefined;
  }
}
export function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid" id="project-list">
      {projects.map((p, i) => (
        <article className="project-card" key={i}>
          <div
            className={`project-art ${p.cover ? "has-cover" : ""}`}
            aria-hidden="true"
          >
            {p.cover && /^\/api\/media\/[a-f0-9]{64}$/.test(p.cover) && (
              <img className="project-cover" src={p.cover} alt="" />
            )}
            <span className="project-monogram">
              {p.logo && /^\/api\/media\/[a-f0-9]{64}$/.test(p.logo) ? (
                <img className="project-logo" src={p.logo} alt="" />
              ) : (
                ["C_", "H/", "✓", "▦"][i % 4]
              )}
            </span>
            <span className="project-art-label">{p.category}</span>
          </div>
          <div className="project-body">
            <span className="kicker">{p.category}</span>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <div className="tags">
              {p.tags.map((t, j) => (
                <ShatterTag key={j} label={t} />
              ))}
            </div>
            <details>
              <summary>О проекте</summary>
              <p>{p.details}</p>
            </details>
            <div className="project-links">
              <a
                className="project-link"
                href={safeURL(p.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Исходный код ↗
              </a>
              {p.demo && (
                <a
                  className="project-link"
                  href={safeURL(p.demo)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Открыть сайт ↗
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <div id="skills-list">
      {skills.map((s, i) => (
        <div className="skill-row" key={i}>
          <span className="row-number">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
          <div className="tags">
            {s.items.map((t, j) => (
              <ShatterTag key={j} label={t} featured={i === 0} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
