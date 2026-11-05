"use client";
import { useEffect, useState } from "react";
export default function EditorNavigation({
  skills,
  projects,
}: {
  skills: number;
  projects: number;
}) {
  const [active, setActive] = useState("editor-about");
  const sections = [
    {
      id: "editor-about",
      title: "Обо мне",
      detail: "Первый экран и биография",
      count: "01",
    },
    {
      id: "editor-skills",
      title: "Навыки",
      detail: "Категории и технологии",
      count: String(skills),
    },
    {
      id: "editor-projects",
      title: "Проекты",
      detail: "Работы, обложки и логотипы",
      count: String(projects),
    },
    {
      id: "editor-tools",
      title: "Копии и выход",
      detail: "Экспорт и восстановление",
      count: "↗",
    },
  ];
  useEffect(() => {
    const update = () => {
      const ids = [
        "editor-about",
        "editor-skills",
        "editor-projects",
        "editor-tools",
      ];
      let current = ids[0];
      for (const id of ids) {
        if (
          (document.getElementById(id)?.getBoundingClientRect().top ??
            Infinity) <= 220
        )
          current = id;
      }
      setActive(current);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <nav className="editor-navigation" aria-label="Разделы редактора">
      <p>СОДЕРЖИМОЕ САЙТА</p>
      {sections.map((s) => (
        <a
          key={s.id}
          href={"#" + s.id}
          aria-current={active === s.id ? "location" : undefined}
          onClick={() => setActive(s.id)}
        >
          <span>
            <strong>{s.title}</strong>
            <small>{s.detail}</small>
          </span>
          <b>{s.count}</b>
        </a>
      ))}
      <small className="editor-nav-hint">
        Откройте карточку, внесите изменения и нажмите «Сохранить».
      </small>
    </nav>
  );
}
