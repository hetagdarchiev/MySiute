"use client";
import type { Project } from "../../lib/content";
import ImageField from "./ImageField";
export default function ProjectEditor({
  p,
  onChange,
  onBusy,
}: {
  p: Project;
  onChange: (key: keyof Project, value: string | string[]) => void;
  onBusy: (busy: boolean) => void;
}) {
  return (
    <>
      {(
        [
          ["title", "Название"],
          ["category", "Категория"],
          ["description", "Описание"],
          ["details", "Подробности"],
          ["url", "Репозиторий"],
          ["demo", "Сайт (необязательно)"],
        ] as const
      ).map(([key, label]) => (
        <label key={key}>
          {label}
          {["description", "details"].includes(key) ? (
            <textarea
              maxLength={3000}
              value={p[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          ) : (
            <input
              type={key === "url" || key === "demo" ? "url" : "text"}
              maxLength={key === "title" || key === "category" ? 100 : 2000}
              required={key === "title" || key === "url"}
              value={p[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}
        </label>
      ))}
      <label>
        Технологии через запятую
        <input
          value={p.tags.join(",")}
          onChange={(e) => onChange("tags", e.target.value.split(","))}
        />
      </label>

      <div className="media-fields">
        <ImageField
          label="Обложка проекта"
          value={p.cover}
          onChange={(v) => onChange("cover", v)}
          onBusy={onBusy}
        />
        <ImageField
          label="Логотип проекта"
          value={p.logo}
          onChange={(v) => onChange("logo", v)}
          onBusy={onBusy}
        />
      </div>
    </>
  );
}
